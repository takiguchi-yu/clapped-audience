// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
  console.log(JSON.stringify(event, 3, null));
  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId,
      eventCode: 'eb605ee4-4c78-4d62-b580-6b2ab216a8a0',
    }
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
