const TASK_NOTIFIER_EMAIL = process.env.TASK_NOTIFIER_EMAIL;
const REGION = process.env.REGION;
const USERS_TABLE = process.env.USERS_TABLE;

const dynamoDb = require('../db/dynamodb-factory');
var aws = require("aws-sdk");
aws.config.update({region: REGION});
var nodemailer = require("nodemailer");
var SES = new aws.SES();

module.exports.notifyUser = (event, context, callback) => {
    
    var transporter = nodemailer.createTransport({
        SES: SES
    });

    getAllUsersIncompletedTasksOrderByPriority()
    .then(usersTasks => {

        for(var userEmail of usersTasks.keys()) {

            let userTasks = usersTasks.get(userEmail);
            let htmlEmailBody = createEmailBody(userTasks);
    
            var mailOptions = {
                from: TASK_NOTIFIER_EMAIL,
                subject: "This is an email from Tasks APIs",
                html: htmlEmailBody,
                to: userEmail,
                region: REGION
            };
    
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("Error sending email");
                    callback(err);
                } else {
                    console.log(`Email sent to ${userEmail} successfully`);
                }
            });
        }
        callback(null);
    })
    .catch(error =>{
        callback(error);
    });
};

function getAllUsersIncompletedTasksOrderByPriority() {
    return new Promise(function(resolve, reject) {
        const params = {
            TableName : USERS_TABLE,
            LIMIT: 100 
        }
        dynamoDb.scan(params, (error, result) => {
            if(error) {
                console.log(error);
                reject(error);
            } else {
                resolve(groupUsersTasks(result));
            }
        });
    });
}
  
function groupUsersTasks(result) {
    let usersTasks = new Map(); 
    result.Items.forEach(item => {
  
        if(item.completed === false) {
            let userTask = usersTasks.get(item.userEmail);
  
            userTask = (userTask === undefined)? { tasks: []} : userTask;
            userTask.tasks.push({description: item.description});
  
            usersTasks.set(item.userEmail, userTask);
        }
    });
    return usersTasks;
}

function createEmailBody(user) {
    let tasks = '';
    user.tasks.forEach(task => {
        tasks += `<tr>
                    <td>${task.description}</td>
                 </tr>\n`;
    });
    let taskTable = `<table style="width:100%">
                    <tr>
                        <th>Description</th>
                    </tr>
                    ${tasks}
                    </table>`;
    return `<p>This is a list of your incompleted by priority:</p>\n ${taskTable}`;
}