//import packages 
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const crypto = require('crypto');
const fileUpload = require('express-fileupload');
const storage = require('node-persist');
// //On load
storage.init();

require('dotenv').config()

fs.writeFile("./credentials.json", process.env.GOOGLE_DRIVE_CRED, function(err) {
    console.log("Drive credentials created!");
}); 

fs.writeFile("./token.json", process.env.GOOGLE_DRIVE_TOKEN, function(err) {
    console.log("Drive token created!");
}); 

const firebase = require('./api/firebase.js')
// firebase.getEditorialAnalytics();
// console.log("All analytics parsed!");
firebase.getAllUsers(undefined, undefined, () => {
	let teamLeaders = ["federico.galbiati@icloud.com"];
	// Object.keys(user.departments).forEach((dept) => {
	// 	let team = user.departments[dept];
	// 	if (Object.keys(team).includes("Leaders")) {
	// 		teamLeaders.push(user.email)
	// 	}
	// });
    storage.setItem('teamLeaders', teamLeaders);
	console.log("All users parsed for autocomplete!");
	const st = require('./api/scheduled_tasks.js')
});

const app = express();

// Load router files
var webplatform = require('./routers/management.js');
var submissions = require('./routers/submission.js');

console.log('Running server')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.use('/', webplatform);
app.use('/submit', submissions);

let listener = app.listen(process.env.PORT || 8080);
console.log('Listening on port ' + listener.address().port)
