<!--
title: 'AWS Serverless REST API in NodeJS'
description: 'This demonstrates how to setup a RESTful Web Service allowing you to create, list, get, update and delete Players. DynamoDB is used to store the data.'
layout: Doc
framework: v1
platform: AWS
language: nodeJS
authorLink: 'https://github.com/koreyboone'
authorName: 'Korey Boone'
-->
# Serverless REST API

This is a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create, list, get, update and delete Players for a trivia app. DynamoDB is used to store the data. This is just an example and of course you could use any data storage as a backend.

## Structure

This service has a separate directory for all the player operations. For each operation exactly one file exists e.g. `players/delete.js`. In each of these files there is exactly one function which is directly attached to `module.exports`.

The idea behind the `players` directory is that in case you want to create a service containing multiple resources e.g. games, questions, comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use-case and your preference.

## Setup

```bash
npm install
```

## Deploy

In order to deploy the endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
Serverless: Stack update finished…

Service Information
service: serverless-rest-api-with-dynamodb
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  POST - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/players
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/players
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/players/{id}
  PUT - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/players/{id}
  DELETE - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/players/{id}
functions:
  create: trivia-service-dev-create
  list: trivia-service-dev-list
  get: trivia-service-dev-get
  update: trivia-service-dev-update
  delete: trivia-service-dev-delete
```

## Usage

You can create, retrieve, update, or delete todos with the following commands:

### Create a Player

```bash
curl -X POST --url "https://XXXXXXX.execute-api.us-east-2.amazonaws.com/dev/players/Korey Boone" --data '{score": 1}'
```

Example Result:
```bash
{"createdAt":1564759441508,"score":3,"id":"Korey Boone","updatedAt":1564760589253}%
```

### List all Players

```bash
curl https://XXXXXXX.execute-api.us-east-2.amazonaws.com/dev/players
```

Example output:
```bash
[{"score":0,"createdAt":1564775446831,"id":"tommy","updatedAt":1564775446831},{"score":0,"createdAt":1564776181202,"id":"kduen","updatedAt":1564776181202},{"createdAt":1564759441508,"score":3,"id":"Korey Boone","updatedAt":1564760589253},{"createdAt":1564764146906,"score":77,"id":"dana","updatedAt":1564767168452},{"score":0,"createdAt":1564776042757,"id":"Justin","updatedAt":1564776042757},{"score":0,"createdAt":1564776011612,"id":"Aaron","updatedAt":1564776011612},{"score":0,"createdAt":1564767876710,"id":"Phil","updatedAt":1564767876710},{"score":0,"createdAt":1564775935833,"id":"Hope","updatedAt":1564775935833},{"score":0,"createdAt":1564775972391,"id":"Alex","updatedAt":1564775972391}]%
```

### Get one Player

```bash
# Replace the <id> part with a real id from your players table
curl https://XXXXXXX.execute-api.us-east-2.amazonaws.com/dev/players/<id>
```

Example Result:
```bash
{"score":0,"createdAt":1564775446831,"id":"tommy","updatedAt":1564775446831}%
```

### Update a Player

```bash
# Replace the <id> part with a real id from your palyers table
curl -X PUT --url "https://XXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/players/<id>" --data '{"score": 3}'
```

Example Result:
```bash
{"createdAt":1564759441508,"score":3,"id":"Korey Boone","updatedAt":1564760589253}%
```

### Delete a Player

```bash
# Replace the <id> part with a real id from your todos table
curl -X DELETE https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos/<id>
```

No output

## Scaling

### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

### DynamoDB

When you create a table, you specify how much provisioned throughput capacity you want to reserve for reads and writes. DynamoDB will reserve the necessary resources to meet your throughput needs while ensuring consistent, low-latency performance. You can change the provisioned throughput and increasing or decreasing capacity as needed.

This is can be done via settings in the `serverless.yml`.

```yaml
  ProvisionedThroughput:
    ReadCapacityUnits: 1
    WriteCapacityUnits: 1
```

In case you expect a lot of traffic fluctuation we recommend to checkout this guide on how to auto scale DynamoDB [https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/](https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/)
