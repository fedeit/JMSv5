const cron = require('node-cron');
const mailer = require("./mailer.js")
const storage = require('node-persist');

cron.schedule('* * * * * 6', async () => {
	let staff = await storage.getItem('staff');
	staff.forEach((user) => {
	  	if (user.isActive != "Active") {
		  	mailer.weeklyMemberPing(user);
	  	}
	});
});

// Weekly HR report
cron.schedule('* * * * * 0', async () => {
	let report = "Users inactive for more than 2 weeks:<br>";
	let staff = await storage.getItem('staff');
	staff.sort((el1, el2) => { return Object.keys(el1.departments) > Object.keys(el2.departments) } )
	.forEach((user) => {
		if (user.isActive != "Active") {
			report += "- " + Object.keys(user.departments) + " | " + user.firstname + " " + user.lastname + " " + user.email + "<br>"
		}
	});
	mailer.emailTeamLeaders(report)
});


