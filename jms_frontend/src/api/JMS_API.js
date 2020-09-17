const axios = require('axios');

const url = "http://localhost:8080";
const instance = axios.create({
  withCredentials: true,
  baseURL: url
})


const testing = false;
let endpoints = {}

endpoints.getMembers =  async function getMembers(callback) {
	makeGETRequest("members", {}, callback);
}

endpoints.getArchive = async function getArchive(callback) {
	makeGETRequest("archive", {}, callback);
}

endpoints.getArticles = async function getArticles(callback) {
	makeGETRequest("articles", {}, callback);
}

endpoints.getFinalReviews = async function getFinalReviews(callback) {
	makeGETRequest("getFinalReviews", {}, callback);
}

endpoints.getArticle = async function getArticle(callback, params) {
	makeGETRequest("getArticle?id=" + params.id, {}, callback);
}

endpoints.getAutocomplete = async function getAutocomplete(callback) {
	makeGETRequest("getAutocomplete", {}, callback);
}

endpoints.signupForNotifications = async function signupForNotifications(callback, params) {
	makePOSTRequest("signupForNotifications", params, callback);
}

endpoints.deleteMember = async function deleteMember(callback, params) {
	makePOSTRequest("deleteMember", params, callback);
}

endpoints.getArticlesWPTeam = async function getArticlesWPTeam(callback, params) {
	makeGETRequest("getArticlesWPTeam", params, callback);
}

endpoints.login = async function login(callback, params) {
	let axiosConfig = {
	  headers: {
	      'Content-Type': params.headers
	  }
	};
	makePOSTRequest("login", {email: params.body.email, password: params.body.password}, callback)
}

async function makeGETRequest(url, params, callback) {
	try {
		const response = await instance.get(url, {params});
		callback(response.data.data, undefined);
	} catch (error) {
		callback(undefined, error);
	}
}

async function makePOSTRequest(url, params, callback) {
	try {
		const response = await instance.post(url, null, {params});
		callback(response.data.data, undefined);
	} catch (error) {
		callback(undefined, error);
	}
}

export var callApiFunction = (callname, callback, params = {}) => {
	if (callname in endpoints) {
		endpoints[callname](callback, params);
	} else {
		console.log("Function " + callname + " does not exist!");
	}
};
