'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.score !== 'number') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the player.',
    });
    return;
  }

  let id = event.pathParameters.id
  id = id.replace(/%20/gi, ' ')

  const params = {

    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id
    },
    ExpressionAttributeNames: {
      '#player_score': 'score',
    },
    ExpressionAttributeValues: {
      ':score': data.score,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #player_score = :score, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the player in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the player.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
