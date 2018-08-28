<!--
title: AWS Serverless Tasks API with NodeJS and DynamoDB
layout: Doc
-->
# Serverless Tasks REST API with DynamoDB, Email Scheduler and offline support


## Setup

```bash
npm install
serverless dynamodb install
```

## Run lambdas offline

```bash
serverless offline start
```

## Deploy lambdas to AWS

```bash
serverless deploy
```

## Development Base Urls

```bash
url: http://localhost:3000/dev
api-key: will be provision when serverless offline start
```

## AWS Base Urls

```bash
url: https://91p3zjetzd.execute-api.us-east-1.amazonaws.com/dev/
api-key: email biscayne3@gmail.com to request an API Key. 
```


## Tasks API

### Create a Task

```bash
curl -X POST {url}/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: <api-key>' \
  -d '{
      "userEmail": "user@gmail.com",
      "description": "assigment",
      "priority": 1,
      "completed": false
     }'
```

Example Result:
```bash
{
    "taskId": "3703c040-a9a9-11e8-a106-55ed5c41dcd8",
    "userEmail": "user@gmail.com",
    "description": "assigment",
    "priority": 1
}
```
### Update a Task

```bash
curl -X PUT {url}/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: <api-key>' \
  -d '{
        "taskId": "3703c040-a9a9-11e8-a106-55ed5c41dcd8",
        "userEmail": "other_user@gmail.com",
        "description": "assigment",
        "priority": 1,
        "completed": true
     }'
```
Example Result:
```bash
  {
    "taskId": <task-id>
    "description": "assigment",
    "userEmail": "user@user.com",
    "priority": 1,
    "completed": <date-time>
  }
```

### Get a task

```bash
curl -X GET '{url}/api/v1/tasks?taskId=<task-id>' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: <api-key>'
```

Example Result:
```bash
  {
    "taskId": <task-id>
    "description": "assigment",
    "userEmail": "user@user.com",
    "priority": 1,
    "completed": <date-time>
  }
```



### Delete a task

```bash
curl -X DELETE {url}/api/v1/tasks/{task-id} -H 'x-api-key: <api-key>' \
```

## Performance 

```bash
  This section is to create a wish list for this API.
```

### API Enrichment
```bash
  Support query parameters such as userEmail, priority, completed, page, pageSize.
  Support pagination to API (e.g all users task could be queried and paged).
  Support to create and update in batches.
```
### DB Indexies
```bash
  Add database indexies to support:
    Query all tasks for a user
    Query a user's completed task order by priority.
    Query users incompleted task order by priority.
```



