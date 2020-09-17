const firebase = require('./firebase.js');

let stats = module.exports.stats = {
	
}

module.exports.summary = function() {
	return stats;
}

module.exports.wipeEditorialStats = function () {
	stats.submittedThisMonth = 0;
	stats.publishedThisMonth = 0;
	stats.submitted = 0;
	stats.published = 0;
	stats.technicalReview = 0;
	stats.revisionsRequested = 0;
	stats.finalReview = 0;
	stats.rejected = 0;
}

module.exports.wipeHRStats = function() {
	stats.activeHR = 0;
}
