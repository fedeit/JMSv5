module.exports = {

	socialMediaStatuses: function() {
		return ["Draft",
				"Approved",
				"Released",
				"Cancelled"]

	},

	currentDate: function() {
		let currentDate = new Date();
		let dd = currentDate.getDate();
		let mm = currentDate.getMonth() + 1;
		let yyyy = currentDate.getFullYear();

		let currentTime = dd + "-" + mm + "-" + yyyy;
		return currentTime;
	},

	newSocialMediaPost: function(article) {
		let post = {
			author: 'JMS',
			content: article.title + '\n',
			imageId: module.exports.defaultSocialMediaImage(),
			schedule: module.exports.currentDate(),
			tags: 'Original Research',
			timestamp: module.exports.currentDate(),
			title: "A YSJ Submission",
			type: 'Instagram, Twitter'
		};

		return post;
	},

	defaultSocialMediaImage: function() {
		return "1IWQL6j1_qnURl82bpAFGKaic_9Asq3je";
	},

	minimumAccess: function(page) {
		let levels = {
			'': 0,
			'/': 0,
			'/index': 0,
			'/articles': 1,
			'/members': 3,
			'/dept_info': 2,
			'/login': 0,
			'/article_overview': 1,
			'/logout': 0,
			'/final_reviews' : 2,
			'/saveArticle': 1,
			'/assignEditor': 2,
			'/assignFinalEditor' : 3,
			'/resetPassword': 0,
			'/admin': 4,
			'/socialmedia_all_posts': 1,
			'/socialmedia_post': 1,
			'/signup': 0,
			'/makeSignupCode': 0,
			'/archive': 1,
			'/subjects_setup': 1
		};
		return levels[page];
	},

	timelineFor: function(status, timestamp, department) {
		let percentages = {
			'Submitted': '0',
			'Passed Data Check': '5',
			'In Review': '10',
			'Revisions Requested': '35',
			'Technical Review':	'50',
			'Final Review': '70',
			'Final Review Edits Requested': '90',
			'Ready to Publish': '100',
		};
		return percentages[status];
	},

	colorForState: function(status) {
		let colors = {
			'Submitted': 'danger',
			'Technical Review':	'primary',
			'Passed Data Check': 'info',
			'In Review': 'secondary',
			'Revisions Requested': 'warning',
			'Final Review': 'success',
			'Final Review Edits Requested': 'info',
			'Ready to Publish': 'dark',
			'Published': '6ABE71',
			'Rejected': 'DE3428',
			'Unreachable author': 'DE3428',
			'Failed Data Check': 'E37735'};
		return colors[status]
	},

	articleStatuses: function() {
		return [
			'Submitted',
			'Passed Data Check',
			'In Review',
			'Revisions Requested',
			'Technical Review',
			'Ready for Final Review',
			'Final Review',
			'Final Review Edits Requested',
			'Ready to Publish',
			'WP Review',
			'Published',
			'Rejected',
			'Unreachable author',
			'Withdrawn',
			'Failed Data Check',
			'DUPLICATE'];
		
	},

	departments: function() {
		return [
			"Editorial",
			"Production",
			"PR & Marketing",
			"Outreach"
		];
	},

	articleTypes: function() {
		return ["Original Research",
				"Review Article",
				"Magazine Article",
				"Blog"]
	},

	subjects: function() {
		return [
			"Astrophysics",
			"Biochemistry",
			"Biology",
			"Chemistry",
			"Computer Science",
			"Engineering",
			"Environmental & Earth Science",
			"Materials Science",
			"Mathematics",
			"Medicine",
			"Physics",
			"Policy & Ethics",
		];

	}
};
