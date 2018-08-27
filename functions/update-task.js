const dynamoDb = require('../db/dynamodb-factory');
const uuidv1 = require('uuid/v1');
const USERS_TABLE = process.env.USERS_TABLE;

module.exports.updateTask = (event, context, callback) => {
    
    // TODO Validate request body
    let taskRequestBody = JSON.parse(event.body);
    let taskId = taskRequestBody.taskId;
    let userEmail = taskRequestBody.userEmail;
    let description  = taskRequestBody.description;
    let priority = taskRequestBody.priority;
    let completed = taskRequestBody.completed;

    // TODO: Don't update completed if the request complete is false
    const params = {
      TableName: USERS_TABLE,
      Key: {
        taskId: taskId
      },
      AttributeUpdates: {
        'userEmail': {
          Action: 'PUT',
          Value: userEmail
        },
        'priority': {
          Action: 'PUT',
          Value: priority
        },
        'description': {
          Action: 'PUT',
          Value: description
        },
        'completed': {
          Action: 'PUT',
          Value: completed  
        },
      }
    };
    
    dynamoDb.update(params, (error, result) => {
      if (error) {
        console.log(error);
        callback(null, { statusCode: 400, body: JSON.stringify(error.code) });
      }

      let taskResponse  = {
          taskId: taskId, 
          userEmail: userEmail,
          description: description,
          priority : priority,
          completed : completed
        };

      callback(null, { statusCode: 200, body: JSON.stringify(taskResponse)});
    });
};
