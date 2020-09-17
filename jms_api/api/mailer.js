require('dotenv').config()
const nodemailer = require('nodemailer');
const storage = require('node-persist');

const DOMAIN = "ysjournal.com";

var transporter = nodemailer.createTransport("SMTP", {
    service: "gmail",
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});

module.exports = {
    signup: function(email, code) {
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            to: email,
            subject: 'Welcome to the YSJ', // Subject line
            html: '<p>Hello,<br>We signed you up to our Journal Management System (JMS). Please click on the following link to complete your registration. <br> https://manage.ysjournal.com/signup?code=' + code +'&email=' + email + '<br> If you encounter technical issues please contact technicalissues@' + DOMAIN + '.</p>' // html body
        };
        module.exports.sendEmail(mailOptions);
        console.log("Email for code sent to" + email);
    },

    // setup e-mail data with unicode symbols
    articleUpdated: function(author, editor, article, status) {
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            to: author + ',' + editor,
            subject: 'You article has been updated', // Subject line
        
            html: '<p><b>Hello,</b><br>You article ' + article + ' has been updated to ' + status + '</p>' // html body
        };
        module.exports.sendEmail(mailOptions);
        console.log("Email Sent to" + author + editor);
    },

    sendEmail: function(mailOptions) {
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    },

    newEditor: function(email, title) {
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            to: email,
            subject: 'New article assigned', // Subject line
        
            html: '<p><b>Hello,</b><br>You have been assigned the article: ' + title + '</p>' // html body
        }

        module.exports.sendEmail(mailOptions);
    },

    informWPLead: function(title, id) {
        let WPLead = await storage.getItem('WPLead');
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            to: WPLead,
            subject: 'New article Ready to Publish', // Subject line
        
            html: '<p><b>Hello,</b><br>Please assign the following article to a WP Admin as soon as possible! "' + title + '"<br>Click here to access the JMS: https://manage.ysjournal.com/article_overview?id=' + id + '</p>' // html body
        }

        module.exports.sendEmail(mailOptions);
    },

    informAuthor: function(author, title) {
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            replyTo: "production@" + DOMAIN,
            to: author,
            subject: 'Your article was published!', // Subject line
        
            html: '<p><b>Congratulations,</b><br>Your article titled: "' + title + '" was just published on our website. You can check it out at https://ysjournal.com <br><br> All the best,<br>Federico Galbiati<br>Head of Production<br>Young Scientists Journal</p>' // html body
        }

        module.exports.sendEmail(mailOptions);
    },

    weeklyMemberPing: function(user) {
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            replyTo: "chief.editor@" + DOMAIN,
            to: user.email,
            subject: 'Ping! Please login to the JMS!', // Subject line
        
            html: '<p>Hello ' + user.firstname + ', we noticed you haven\'t logged into the JMS in the past 2 weeks. To let us know you are still active, please login at manage.ysjournal.com with your credentials.<br>Failing to do so for more than a month will result in the automatic removal from our systems. Thank you for contributing to the YSJ!' // html body
        }

        module.exports.sendEmail(mailOptions);
    },

    emailTeamLeaders: async function(body) {
        let teamLeaders = await storage.getItem('teamLeaders');
        var mailOptions = {
            from: 'submissions@' + DOMAIN, // sender address
            replyTo: "chief.editor@" + DOMAIN,
            to: teamLeaders.join(','),
            subject: 'JMS - Email for team leaders', // Subject line
            html: 'THIS EMAIL IS AUTOMATIC FROM THE JMS FOR TEAM LEADERS ONLY<br><br>' + body
        }
        module.exports.sendEmail(mailOptions);
    }
};
