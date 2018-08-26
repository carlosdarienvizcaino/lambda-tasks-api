const dynamoDb = require('../db/dynamodb-factory');
const USERS_TABLE = process.env.USERS_TABLE;

module.exports.deleteTask = (event, context, callback) => {

    const params = {
        TableName: USERS_TABLE,
        Key: {
          taskId: event.pathParameters.taskId
        },
      };
  
    dynamoDb.delete(params, (error, result) => {
      if (error) {
        console.log(error);
        callback(null, { statusCode: 500, body: JSON.stringify(error)});
      }

      callback(null, { statusCode: 200, body: JSON.stringify(result.Item)});
    });
  };