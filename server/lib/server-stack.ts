import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { CfnApi, CfnDeployment, CfnIntegration, CfnRoute, CfnStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { AssetCode, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class ServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log("account: " + this.account)
    console.log("region: " + this.region)

    // initial api
    const name = id + "-api"
    const api = new CfnApi(this, name, {
      name: "EventReactionAppApi",
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.action",
    });
    const tableName = "event_connections"
    const table = new Table(this, `${name}-table`, {
      tableName: tableName,
      partitionKey: {
        name: "connectionId",
        type: AttributeType.STRING,
      },
      // readCapacity: 5,
      // writeCapacity: 5,
      removalPolicy: RemovalPolicy.DESTROY, // DESTROY: テーブルにデータが入っている状態でcdk destroyが実行された時、データごとテーブルを削除する
      timeToLiveAttribute: 'expiryDate',
    });

    // 読み込みキャパシティー
    table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });
    // 書き込みキャパシティー
    table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    // add global secandary index (GSI)
    table.addGlobalSecondaryIndex({
      indexName: 'eventCodeIndex',
      partitionKey: {
        name: "eventCode",
        type: AttributeType.STRING,
      },
      // readCapacity: 5,
      // writeCapacity: 5,
      projectionType: ProjectionType.ALL,
    });

    // GSI読み込みキャパシティー
    table.autoScaleGlobalSecondaryIndexReadCapacity('eventCodeIndex', {
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });
    // GSI書き込みキャパシティー
    table.autoScaleGlobalSecondaryIndexWriteCapacity('eventCodeIndex', {
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    const connectFunc = new Function(this, 'connect-lambda', {
      code: new AssetCode('./src/onconnect'),
      handler: 'app.handler',
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(180),
      memorySize: 256,
      environment: {
        "TABLE_NAME": tableName,
      },
    });

    table.grantReadWriteData(connectFunc)

    const disconnectFunc = new Function(this, 'disconnect-lambda', {
      code: new AssetCode('./src/ondisconnect'),
      handler: 'app.handler',
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(180),
      memorySize: 256,
      environment: {
        "TABLE_NAME": tableName,
      },
    });

    table.grantReadWriteData(disconnectFunc)

    const messageFunc = new Function(this, 'message-lambda', {
      code: new AssetCode('./src/sendmessage'),
      handler: 'app.handler',
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(180),
      memorySize: 256,
      initialPolicy: [
        new PolicyStatement({
          actions: [
            'execute-api:ManageConnections'
          ],
          resources: [
            "arn:aws:execute-api:" + this.region + ":" + this.account + ":" + api.ref + "/*",
          ],
          effect: Effect.ALLOW,
        })
      ],
      environment: {
        "TABLE_NAME": tableName,
      },
    });

    table.grantReadWriteData(messageFunc)

    // access role for the socket api to access the socket lambda
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [
        connectFunc.functionArn,
        disconnectFunc.functionArn,
        messageFunc.functionArn,
      ],
      actions: ["lambda:InvokeFunction"],
    });

    const role = new Role(this, `${name}-iam-role`, {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });
    role.addToPolicy(policy)

    // lambda integration
    const connectIntegration = new CfnIntegration(this, "connect-lambda-integration", {
      apiId: api.ref,
      integrationType: "AWS_PROXY",
      integrationUri: "arn:aws:apigateway:" + this.region + ":lambda:path/2015-03-31/functions/" + connectFunc.functionArn + "/invocations",
      credentialsArn: role.roleArn,
    });
    const disconnectIntegration = new CfnIntegration(this, "disconnect-lambda-integration", {
      apiId: api.ref,
      integrationType: "AWS_PROXY",
      integrationUri: "arn:aws:apigateway:" + this.region + ":lambda:path/2015-03-31/functions/" + disconnectFunc.functionArn + "/invocations",
      credentialsArn: role.roleArn,
    });
    const messageIntegration = new CfnIntegration(this, "message-lambda-integration", {
      apiId: api.ref,
      integrationType: "AWS_PROXY",
      integrationUri: "arn:aws:apigateway:" + this.region + ":lambda:path/2015-03-31/functions/" + messageFunc.functionArn + "/invocations",
      credentialsArn: role.roleArn,
    });

    const connectRoute = new CfnRoute(this, "connect-route", {
      apiId: api.ref,
      routeKey: "$connect",
      authorizationType: "NONE",
      target: "integrations/" + connectIntegration.ref,
    });
    const disconnectRoute = new CfnRoute(this, "disconnect-route", {
      apiId: api.ref,
      routeKey: "$disconnect",
      authorizationType: "NONE",
      target: "integrations/" + disconnectIntegration.ref,
    });
    const messageRoute = new CfnRoute(this, "message-route", {
      apiId: api.ref,
      routeKey: "sendmessage",
      authorizationType: "NONE",
      target: "integrations/" + messageIntegration.ref,
    });

    const deployment = new CfnDeployment(this, `${name}-deployment`, {
      apiId: api.ref,
    });

    new CfnStage(this, `${name}-stage`, {
      apiId: api.ref,
      // autoDeploy: true,
      deploymentId: deployment.ref,
      stageName: "dev",
      defaultRouteSettings: {
        throttlingBurstLimit: 3000,
        throttlingRateLimit: 1000,
      }
    });

    deployment.node.addDependency(connectRoute)
    deployment.node.addDependency(disconnectRoute)
    deployment.node.addDependency(messageRoute)
  }
}
