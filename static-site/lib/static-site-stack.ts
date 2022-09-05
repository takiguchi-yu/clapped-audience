import * as cdk from 'aws-cdk-lib';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { AllowedMethods, Distribution, OriginAccessIdentity, PriceClass, ViewerProtocolPolicy, SecurityPolicyProtocol } from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log("account: " + this.account)
    console.log("region: " + this.region)

    // S3 バケット
    const siteBucket = new Bucket(this, 'SiteBucket', {
      bucketName: 'clapped-audience2',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      // CDK 上で完全にクリーンできるようにするための設定（本番環境非推奨）
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
    });

    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI');
    siteBucket.grantRead(cloudfrontOAI);

    // CloudFront
    const distribution = new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      priceClass: PriceClass.PRICE_CLASS_200,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new S3Origin(siteBucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../client')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
