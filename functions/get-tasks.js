const dynamoDb = require('../db/dynamodb-factory');
const USERS_TABLE = process.env.USERS_TABLE;

module.exports.getTasks = (event, context, callback) => {

  let queryParams = getQueryParameters(event);

  dynamoDb.get(queryParams, (error, result) => {
    if (error) {
      console.log(error);
      callback(null, { statusCode: 200, body: JSON.stringify(error)});
    }

    if(result === null || result == undefined) {
      callback(null, { statusCode: 500, body: JSON.stringify({})});
    } else if (result.Item === null || result.Item === undefined) {
      callback(null, { statusCode: 404, body: null});
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify(result.Item)});
    }
  });
};

function getQueryParameters(event) {

  let taskId = event.queryStringParameters.taskId;
  let userEmail = event.queryStringParameters.userEmail;
  let priority = event.queryStringParameters.priority;
  
  let queryKeys = {};
  if(taskId) queryKeys.taskId = taskId;
  //if(userEmail) queryKeys.userEmail = userEmail;
  //if(priority) queryKeys.priority = priority;

  return  {
    TableName: USERS_TABLE,
    Key: queryKeys,
  }
}
  
