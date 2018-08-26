const dynamoDb = require('../db/dynamodb-factory');
const uuidv1 = require('uuid/v1');
const USERS_TABLE = process.env.USERS_TABLE;

module.exports.createTask = (event, context, callback) => {
    
    // Validate request body
    let taskRequestBody = JSON.parse(event.body);
    let userEmail = taskRequestBody.userEmail
    let description  = taskRequestBody.description;
    let priority = taskRequestBody.priority;
    let isTaskCompleted = taskRequestBody.completed;
    
    let taskId = uuidv1();
    taskRequestBody.taskId = taskId;
    let completed = (isTaskCompleted === true) ? new Date() :  null;
    taskRequestBody.completed = completed;
    
    const params = {
      TableName: USERS_TABLE,
      Item: taskRequestBody,
    };
    
    dynamoDb.put(params, (error) => {
      if (error) {
        console.log(error);
        callback(null, { statusCode: 400, body: JSON.stringify(error) });
      }

      let taskResponse  = {
          taskId: taskId, 
          userEmail: userEmail,
          description: description,
          priority : priority,
          completed : completed
        };

      callback(null, { statusCode: 201, body: JSON.stringify(taskResponse)});
    });
};
