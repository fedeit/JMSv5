const path = require('path')
const express = require('express')
const router = express.Router()
const firebase = require('./../api/firebase')
const drive = require('./../api/googledrive')
const storage = require('node-persist');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./jwt_middleware');

// Use JWT auth middleware
router.use(authMiddleware);

router.post('/signupForNotifications', function (req, res) {
	firebase.articleOverview(req, res, (article, req, res) => {
		if (typeof article.notificationsSignedUp === "undefined") {
			article.notificationsSignedUp = [];
		}
		if (req.query.isSignup == "true") {
			article.notificationsSignedUp.push(req.query.user);
		} else {
			article.notificationsSignedUp = article.notificationsSignedUp.filter(el => { return el != req.query.user});
		}
		firebase.saveArticle({ notificationsSignedUp: article.notificationsSignedUp }, req.query.id, req, res);
	});
});

router.get('/getAutocomplete', async function (req, res) {
	let staff = await storage.getItem('staff');
	let autocomplete = staff.map(el => {
		return el.firstname + " " + el.lastname + " | " + el.email;
	});
	return res.status(200).json({ success: true, data: autocomplete })
});

router.post('/deleteMember', function (req, res) {
	firebase.deleteMember(req, res);
});

router.get('/articles', function (req, res) {
	firebase.getAllArticles(req, res);
});

router.get('/getArticlesWPTeam', function (req, res) {
	firebase.getArticlesWPTeam(req, res);
});

router.get('/getArticle', function (req, res) {
	firebase.articleOverview(req, res, (data, req, res) => {
    	return res.status(200).json({ success: true, data: data })
	});
});

router.get('/deptInfo', function (req, res) {
	firebase.getEditorialDepartmentInfo(req, res);
});

router.get('/members', function (req, res) {
	firebase.getAllUsers(req, res);
});

router.get('/getFinalReviews', function (req, res) {
	firebase.getFinalReviews(req, res);
});

router.get('/archive', function (req, res) {
	firebase.getArchive(req, res);
});

router.get('/signup', function (req, res) {
	firebase.signupPageRequest(req, res)
});

router.post('/signup', (req, res) => {
	firebase.signupUser(req, res, () => {
	});
});

router.post('/makeSignupCode', (req, res) => {
	firebase.makeSignupCode(req, res);
});

router.post('/login', (req, res) => {
	firebase.login(req, res, async (res) => {
		// Issue a JWT token
      	const payload = { email: req.body.email };
  		const secret = 'mysecretsshhh';
 	 	const token = jwt.sign(payload, secret, {
      	  expiresIn: '2h'
      	});
      	// Respond with token and 200
      	console.log("Responding with 200");
      	res.cookie('token', token, { httpOnly: false });
        res.redirect('/members');
	});
});

router.post('/saveArticle', (req, res) => {
	firebase.saveArticle(req.body, req.query.id, req, res);
});

router.post('/assignEditor', (req, res) => {
	firebase.assignEditor(req.body, req.query.id, req.query.dept, req, res);
});

router.post('/resetPassword', (req, res) => {
	firebase.resetPassword(req.body.email, req, res);
});

router.get('/socialmedia_all_posts', (req, res) => {
	firebase.socialmediaAllPosts(req, res);
});

router.get('/socialmedia_post', (req, res) => {
	firebase.socialmediaPost(req, res);
});

router.post('/socialmedia_post', (req, res) => {
	if (req.files.imageId.name != "") {
		drive.uploadFile(req.body.title, req.files.imageId.mimetype, req.files.imageId.tempFilePath, req, res);
	} else {
		firebase.saveSocialmediaPost(req, res);
	}
});


module.exports = router
