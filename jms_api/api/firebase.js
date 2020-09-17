// Google Firebase
require('dotenv').config();

const storage = require('node-persist');
const firebase = require("firebase/app");
const path = require('path');
const fs = require('fs');
const ams = require("./ams.js")
const analytics = require("./analytics.js")
const mailer = require("./mailer.js")

require("firebase/auth");
require("firebase/firestore");

// Set config vars for Firebase
var firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DB_DOMAIN,
	projectId: "ams-v4",
	storageBucket: process.env.FIREBASE_,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREASE_APP_ID,
	measurementId: process.env.MEASURE_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

module.exports = {
	login: function(req, res, callback) {
		let username = req.query.email.toLowerCase();
		let password = req.query.password;
		// Make firebase request for login
		firebase.auth().signInWithEmailAndPassword(username, password)
		.then(function(doc) {
			// Check if user exists
			if (doc) {
				// Get the user info from "staff"
				db.collection("staff").doc(username).get()
			  	.then(doc => {
			    	if (!doc.exists) {
    		        	return res.status(200).json({ success: false, error: "User details not found" })
			    	} else {
			    		let userData = doc.data();
			    		// Update last login variable for user
					    updateUserLastLogin(userData.email);
					    // Callback
					    callback(res);
			    	}
			  	})
			  	.catch((err) => { returnError(err, res) });
			}
		})
		.catch((err) => { returnError(err, res) });
	},

	resetPassword: function(email, req, res) {
		// Send reset password autoemail
		firebase.auth().auth.sendPasswordResetEmail(email)
		.then((res) => {
        	return res.status(200).json({ success: true, data: res })
		}).catch((err) => { returnError(err, res) });
	},

	getOverview: function(req, res) {
		// Get analytics
		let stats = analytics.summary();
        return res.status(200).json({ success: true, data: stats })
	},

	getAllUsers: function(req, res, callback = () => {}) {
		// Get list of users from database
		db.collection('staff').get()
		.then(snapshot => {
			let staff = snapshot.docs.map(doc => {
		    	let user = doc.data();
		    	// Add user id to the object
		    	user.id = doc.id;
		    	// Check if user active and 
		    	user.isActive = isActive(user.lastLogin) ? "Active" : "Inactive";
		    	// Format departments as string list
				user.department = Object.keys(user.departments).join(", ");
		    	// Format teams as string list
				user.teams = Object.keys(user.departments).map(teamsKey => {
					teams = user.departments[teamsKey];
					return Object.keys(teams).join(", ");
				}).join(", ");
		    	// Format roles as string list
				user.roles = Object.keys(user.departments).map(teamsKey => {
					teams = user.departments[teamsKey]
					Object.keys(teams).map(teamKey => teams[teamKey].role).join(", ")
				}).join(", ");
				return user;
		    });
	    	// Update data in persistent storage for autocomplete & analytics
		    storage.setItem('staff', staff);
		    callback();
		    if (typeof res !== "undefined") {
   	     		return res.status(200).json({ success: true, data: staff })
		    }
		})
		.catch((err) => { returnError(err, res) });
	},

	deleteMember: function(req, res) {
		db.collection('staff').doc(req.query.id).delete()
		.then(() => {
			firebase.auth().deleteUser(req.query.id)
			   .then(function() {
        			return res.status(200).json({ success: true})
			   })
			   .catch((err) => { returnError(err, res) });
		})
		.catch((err) => { returnError(err, res) });
	},

	getFinalReviews: function(req, res) {
		// Get all final review articles
		db.collection('articles').where("status", "==", "Final Review").get()
		.then(snapshot => {
			// Get articles in array
		    let articles = snapshot.docs.map(doc => {
		    	let article = doc.data();
		    	// Add the ID to the article obj
				article.id = doc.id;
				// Find the final editor (if available), and add to the article obj
				article.editors.filter((editor) => {
					// Filter for final review editors
					return editor.type == "final";
				}).forEach((editor) => {
					article.finalEditor = {email: editor.email, timestamp: editor.timestamp};
					article.withinDeadline = withinDeadline(article.finalEditor.timestamp);
				})
				// Make a string description of the editors
				let editorEmails = article.editors.map(editor => editor.email);
				article.editorEmails = editorEmails.join(', ');
		    	return article;
		    })
		    .sort(orderByTime); // Sort array by submission date of the articles
        	return res.status(200).json({ success: true, data: articles })
		})
		.catch((err) => { returnError(err, res) });
	},

	getArchive: function(req, res) {
		// Get all articles in the archive
		db.collection('articlesArchive').get()
		.then(snapshot => {
			// Get an articles array
		    let articles = snapshot.docs.map(doc => {
		    	let article = doc.data();
		    	article.id = doc.id; // Add the ID to the article obj
		    	return article;
		    }).sort(orderByTime); // Order by submission date
        	return res.status(200).json({ success: true, data: articles })
		})
		.catch((err) => { returnError(err, res) });
	},

	getArticlesWPTeam: function(req, res) {
		// Articles for the WP team are in status WP Review or Ready to Publish
		// Get articles in WP Review
		db.collection('articles').where('status', '==', 'WP Review').get()
		.then(snapshot => {
			// Get an articles array
		    let articlesWPR = snapshot.docs.map(doc => {
		    	let article = doc.data();
		    	article.id = doc.id; // Add the ID to the article obj
				// Make a string description of the editors
				let editorEmails = article.editors.map(editor => editor.email);
				article.editorEmails = editorEmails.join(', ');
		    	return article;
		    });
		    // Get articles in status Ready to Publish
    		db.collection('articles').where('status', '==', 'Ready to Publish').get()
			.then(snapshot => {
				// Get an articles array
			    let articlesRTP = snapshot.docs.map(doc => {
			    	let article = doc.data();
			    	article.id = doc.id; // Add the ID to the article obj
					// Make a string description of the editors
					let editorEmails = article.editors.map(editor => editor.email);
					article.editorEmails = editorEmails.join(', ');
			    	return article;
			    });

			    // Concatenate articles from both arrays
			    let articles = articlesRTP.concat(articlesWPR).sort(orderByTime);
	        	return res.status(200).json({ success: true, data: articles })
			})
			.catch((err) => { returnError(err, res) });
		})
		.catch((err) => { returnError(err, res) });

	},

	getAllArticles: function(req, res) {
		// Get all active articles
		db.collection('articles').get()
		.then(snapshot => {
			let articles = snapshot.docs.map(doc => {
		    	let article = doc.data();
				article.id = doc.id; // Add the ID to the article obj
				// Make a string description of the editors
				let editorEmails = article.editors.map(editor => editor.email);
				article.editorEmails = editorEmails.join(', ');
				return article;
		    }).sort(orderByTime); // Order by submission date
        	return res.status(200).json({ success: true, data: articles })
		})
		.catch((err) => { returnError(err, res) });
	},
	
	articleOverview: function(req, res, callback) {
		// Check collection to retreive article from
		let collection = req.query.archive == "true" ? "articlesArchive" : "articles"
		// Get article from collection
		db.collection(collection).doc(req.query.id).get()
		.then(doc => {
	    	if (!doc.exists) {
	    		returnError("Article does not exist", res);
	    	} else {
	    		let article = doc.data();
				article.id = doc.id; // Add the article id to the object
				article.timeline = ams.timelineFor(article.status, article.timestamp, article.subject); // Get statistical article timeline
	        	callback({ success: true, data: article }, req, res);
	    	}
	  	})
	  	.catch((err) => { returnError(err, res) });
	},

	saveArticle: function(newDetails, id, req, res) {
		// Get article to update
        db.collection("articles").doc(id).get()
        .then(doc => {
            if (!doc.exists) {
            	returnError("Cannot find article", res)
            } else {
                let article = doc.data()
                if (newDetails.status != article.status) {
		            // Send email of article update
		            console.log("Emailing author");
		            mailer.articleUpdated(article.author, article.editors.map( article.email ).join(","), article.title, newDetails.status)
                }
                // Send email to WP Lead if changing to ready to publisj
                if (newDetails.status == "Ready to Publish") {
	                mailer.informWPLead(art.title, id)
                }
                // Send email to author
                if (newDetails.status == "Published") {
	                mailer.informAuthor(article.author, article.title)
                }
            }
        })
        .catch((err) => { returnError(err, res) })

        // Update the last edited timestamp in the db
        newDetails.lastEdit = ams.currentDate()
        
        // Update the article in the database
        db.collection("articles").doc(id).update(newDetails)

        // Create default social media post for article if ready to publish and relevant
        if (newDetails.status == "Published" && newDetails.type == "Original Research") {
        	// Get default post
        	let post = ams.newSocialMediaPost(newDetails)
        	// Add post to the collection
			db.collection('socialmedia_posts').add(post).then(ref => {})
        }

        if (newDetails.status == "Published" || newDetails.status == "Failed Data Check" || newDetails.status == "Rejected" ||
			newDetails.status == "Withdrawn" || newDetails.status == "DUPLICATE" || newDetails.status == "Unreachable author") {
        	//Move article to archive
        	archiveArticle(id);
        }
    	return res.status(200).json({ success: true })        
	},

	assignEditor: function(toUpdate, id, dept, req, res) {
		// Get requested editor
		let editorStr = toUpdate['editor'].split("-");
		let editorEmail = editorStr[editorStr.length - 1].trim().toLowerCase();
		// Regex validate new email address
		if (!validateEmail(editorEmail)) {
        	return res.status(400).json({ success: false, error: "Email " + editorEmail + " is invalid, please use autocomplete" })
		}
		// Make new editor object
		let newEditor = {
			type: toUpdate["type"],
			email: editorEmail,
			timestamp: ams.currentDate(),
			by: req.session.authenticatedUser
		}
		// Get article object
		db.collection("articles").doc(id).get()
	  	.then(doc => {
	    	if (!doc.exists) {
	    		returnError("Article does not exist", res)
	    	} else {
	    		let article = doc.data()
	    		// Add the new editor to the old editors list
	    		article.editors.push(newEditor)
	    		// Update editors list in the database
				db.collection("articles").doc(id).update({ editors: article.editors, lastEdit: ams.currentDate()})
                // Send email informin new assigned editor
                mailer.newEditor(newEditor.email, article.title)
	        	return res.status(200).json({ success: true, data: article })
	    	}
	  	})
	  	.catch((err) => { returnError(err, res) })
	},

	socialmediaAllPosts: function (req, res) {
		// Get all social media posts from collection
		db.collection('socialmedia_posts').get()
		.then(snapshot => {
			// Make an array of posts
			let posts = snapshot.docs.map(doc => {
		    	let post = doc.data();
				post.id = doc.id // Add ID to the object
				// Make onTime variable, ontime means by today
				post.onTime = postOnTime(post.timestamp)
				return post
		    }).sort(orderByTime) // Sort posts by date
	        return res.status(200).json({ success: true, data: posts })
		})
		.catch((err) => { returnError(err, res) })
	},

	socialmediaPost: function(req, res) {
		// Get a social media post
		db.collection('socialmedia_posts').doc(req.query.id).get()
	  	.then(doc => {
	    	if (!doc.exists) {
	    		returnError("Document does not exist", res)
	    	} else {
	    		let post = doc.data()
	    		post.id = doc.id // Add id of the post to the object
	    		// Add a default image if none defined
	    		if (typeof post.imageId === "undefined") {
	    			post.imageId = ams.defaultSocialMediaImage();
	    		}
	        	return res.status(200).json({ success: true, data: post })
	    	}
	  	})
	  	.catch((err) => { returnError(err, res) });
	},

	saveSocialmediaPost: function(req, res) {
		// Save the post if id is defined
		if (req.body.id != "" && typeof req.body.id !== "undefined") {
	        db.collection("socialmedia_posts").doc(req.body.id).update(req.body)
	        .then(() => {
		        return res.status(200).json({ success: true, data: article })
			}).catch((err) => { returnError(err, res) });
		} else {
			// Create the post if id is undefined
			db.collection('socialmedia_posts').add(req.body).then(ref => {
		        return res.status(200).json({ success: true, data: article })
			}).catch((err) => { returnError(err, res) });
		}
	},

	makeSignupCode: function(req, res) {
		// Make a sinup code of length 8
		let code = makeid(8)
		// Make a new invite in the database with param email
		db.collection('signupCodes').doc(code).set({
			email: req.body["email"]
		}).then(ref => {
			// Send email to the invited user with the code
            mailer.signup(req.body["email"], code);
	        return res.status(200).json({ success: true, data: {email: req.body["email"]}})
		}).catch((err) => { returnError(err, res) });
	},

	signupPageRequest: function (req, res) {
		// Check if user is invited
		db.collection("signupCodes").doc(req.query.code)
		.get().then(doc => {
	    	if (!doc.exists) {
	    		returnError("You are not allowed to signup. If you copied the link make sure you also copy the string after the /signup.", res)
	    	} else {
	    		// Get the access token for the provided code
	    		let accessToken = doc.data()
	    		// CHeck if invite and user email match
	    		if (accessToken.email == req.query.email) {
			        return res.status(200).json({ success: true })
	    		} else {
	    			return res.status(200).json({ success: false })
	    		}
	    	}
	  	})
	  	.catch((err) => { returnError(err, res) });
	},

	signupUser: function (req, res) {
		// Siggnup the user to the JMS
		var first = req.body["firstname"];
		var last = req.body["lastname"];
		var email = req.body["email"].toLowerCase();
		var location = req.body["timezone"];
		var department = req.body["department"];
		var role = req.body["role"];
		var team = req.body["team"];
		var verification = req.body["passwordr"];
		let deptObj = {};
		var pass = req.body["password"];

		// Check if parameters are valid
		if( typeof first === "undefined" || typeof last === "undefined" ||
			typeof email === "undefined" || typeof location === "undefined" ||
			typeof department === "undefined" || typeof role === "undefined" ||
			typeof team === "undefined") {
    		return returnError("Not all fields are completed", res)
		}

		// Validate the email address
		if (!validateEmail(email)) {
    		return returnError("Invalid email for signup", res)
		}

		// Check if all fields are non-blank
		if( first == "" ||  last == "" || email == "" || location == "" ||
			department == "" || role == "" || team == "") {
    		return returnError("Please fill out all the fields.", res)
		}

		// Check if password is equal to the confirmation
		if (verification != pass) {
    		return returnError("Password and confirmation not the same.", res)
		}

		// Make a department object
		deptObj[department] = {}
		deptObj[department][team] = {};
		deptObj[department][team].role = role;
		deptObj[department][team].member = true;
		console.log("Signup for: " + email);
		// Make default user object
	    var data = {
	    	'authorizationLevel': 1,
			'departments': deptObj,
			'location': location,
			'email': email,
			'firstname': first,
			'lastname': last,
			'lastLogin': '01-01-2020'
	    }

	    // Add user data to the staff collection
		db.collection('staff').doc(email).set(data).then(ref => {})
		.catch((err) => { returnError(err, res) })
		.then(function(userRecord) {
			// Create user in Auth with loin info
			firebase.auth().createUserWithEmailAndPassword(email, pass)
			.then(function() {
		        return res.status(200).json({ success: true })
			})
			.catch((error) => {
				// If error encountered while sinin up, delete user info object in the staff collection
				db.collection('staff').doc(email).delete();
				returnError(error, res)
			})
		})
	},

	getEditorialAnalytics: function() {
		analytics.wipeEditorialStats();
		db.collection('articles').get().then(snapshot => {
		    snapshot.forEach(doc => {
		    	let tempData = doc.data();
		    	if (lastMonth(tempData.timestamp)) { analytics.stats.submittedThisMonth += 1; }
			    if (tempData.status == "Submitted") { analytics.stats.submitted += 1; }
			    if (tempData.status == "Technical Review") { analytics.stats.technicalReview += 1; }
			    if (tempData.status == "Revisions Requested") { analytics.stats.revisionsRequested += 1; }
			    if (tempData.status == "Final Review") { analytics.stats.finalReview += 1; }
		    });
		});

		db.collection('articlesArchive').get().then(snapshot => {
		    snapshot.forEach(doc => {
		    	let tempData = doc.data();
		    	if (tempData.status == "Published" && lastMonth(tempData.timestamp)) { analytics.stats.publishedThisMonth += 1; }
			    if (tempData.status == "Rejected" || tempData.status == "Failed Data Check") { analytics.stats.rejected += 1; }
			    if (tempData.status == "Published") { analytics.stats.published += 1; }
			});
		});
	},

	archiveArticle: function(id) {
		// Move article from articles collection to the archive
		moveArticle('articles', 'articlesArchive')
	},

	unarchiveArticle: function(id) {
		// Move article from the archive collection to the articles
		moveArticle('articlesArchive', 'articles')
	}
};

let returnError = (err, res) => {
	// Manage default error
	console.log("ERROR" + err)
	return res.status(200).json({ success: false, error: err })
}

let orderByTime = (a, b) => {
	try {
		// Make date from strin in EU format dd/mm/yyyy
		let bDates = b.timestamp.split("-");
		let aDates = a.timestamp.split("-");
		let bDate = new Date(bDates[2], bDates[1]-1, bDates[0]);
		let aDate = new Date(aDates[2], aDates[1]-1, aDates[0]);
		// Compare the two dates
	  	return bDate - aDate;
  	}catch {
  		console.log("ID of unreadable article: " + a.id)
  	}
}

function moveArticle(fromCollection, toCollection) {
	// Get object from collection A
    db.collection(fromCollection).doc(id).get()
    .then(doc => {
        if (!doc.exists) {
        	returnError("Article not found", res)
        } else {
            let article = doc.data();
            // Add article to collection B
			db.collection(toCollection).add(article)
			.then(ref => {
				// Delete article from old collection
				db.collection(fromCollection).doc(id).delete()
				.then((ref) => {
			        return res.status(200).json({ success: true, data: ref })
				});
			});
        }
    })
    .catch((err) => { returnError(err, res) })
}

function updateUserLastLogin(username) {
	// Get current date in dd/mm/yyyy format
	let currentTime = ams.currentDate()
	// Get the user object from the staff collection
	let user = db.collection("staff").doc(username)
	// Update the user last login
	user.update({lastLogin: currentTime})
};

function textToDate(date) {
	try {
		let aDates;
		if (typeof date === "Date") {
			aDates = date.toDateString().split("-");
		} else {
			aDates = date.split("-");
		}
		let secondDate = new Date(aDates[2], aDates[1]-1, aDates[0]);
		return secondDate;
	} catch {
		console.log("Cannot parse date in textToDate:");
		console.log(date);
	}
	return false;
}

function daysAgoLessThan(days, date) {
	if (typeof date !== "undefined") {
		let firstDate = new Date();
		let secondDate = textToDate(date);
		const oneDay = 24 * 60 * 60 * 1000;
		const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
		if (diffDays < days) {
			return true;
		} else {
			return false;
		}
	}
}

function isActive(lastLogin) {
	return daysAgoLessThan(28, lastLogin)
}

function withinDeadline(date) {
	return daysAgoLessThan(10, date)
}

function lastMonth(date) {
	return daysAgoLessThan(31, date)
}

function postOnTime(date) {
	if (typeof date !== "undefined") {
		let firstDate = new Date();
		let secondDate = textToDate(date);
		if (secondDate <= firstDate) {
			return true;
		} else {
			return false;
		}
	}
}

// Validate email formatting
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Make a unique id for the user invites
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}