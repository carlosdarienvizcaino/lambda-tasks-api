var aws = require("aws-sdk");
aws.config.update({region:'us-east-1'});
var nodemailer = require("nodemailer");
var SES = new aws.SES();
const TASK_NOTIFIER_EMAIL = process.env.TASK_NOTIFIER_EMAIL;
const REGION = process.env.REGION;

module.exports.notifyUser = (event, context, callback) => {
    
    var transporter = nodemailer.createTransport({
        SES: SES
    });

    let users = getAllUsersIncompletedTaskOrderByPriority();

    users.forEach(user => {
        let htmlEmailBody = createEmailBody(user);

        var mailOptions = {
            from: TASK_NOTIFIER_EMAIL,
            subject: "This is an email from Tasks APIs",
            html: htmlEmailBody,
            to: user.userEmail,
            region: REGION
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log("Error sending email");
                callback(err);
            } else {
                console.log(`Email sent to ${user.userEmail} successfully`);
            }
        });
    });
};

function getAllUsersIncompletedTaskOrderByPriority() {
    return [{userEmail: 'biscayne3@gmail', tasks: [ {description: 'description'}] }];
}

function createEmailBody(user) {
    let tasks = '';
    user.tasks.forEach(task => {
        tasks += `<tr>
                    <td>${task.description}</td>
                    <td>${task.priority}</td> 
                    <td>${task.completed}</td>
                 </tr>\n`;
    });
    let taskTable = `<table style="width:100%">
                    <tr>
                        <th>Description</th>
                        <th>Priority</th> 
                        <th>Completed</th>
                    </tr>
                    ${tasks}
                    </table>`;
    return `<p>This is a list of your incompleted by priority:</p>\n ${taskTable}`;
}