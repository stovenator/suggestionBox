var http = require('http');
require('dotenv').config()

var AUTH_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
var apiServer = 'https://api.github.com';
var owner = process.env.REACT_APP_GITHUB_OWNER;
var repo = process.env.REACT_APP_GITHUB_REPO;

var GitHubApi = require("github");

var github = new GitHubApi({
  // optional
  debug: true,
  protocol: "https",
  host: "api.github.com",
  pathPrefix: "", // for some GHEs; none for GitHub
  headers: {
    "user-agent": "node Express server" // GitHub is happy with a unique user agent
  },
  Promise: require('bluebird'),
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

var auth = function() {
  github.authenticate({ type: "oauth", token: AUTH_TOKEN });
};

var getAllSuggestions = function() {
  auth();
  return github.issues.getForRepo({
    owner: owner,
    repo: repo,
    per_page: 100,
    page: 0
  });
};

var getLabels = function() {
  auth();
  return github.issues.getLabels({
    owner: owner,
    repo: repo,
    per_page: 100,
    page: 0
  });
};


var getCommentsForIssue = function(issueNum) {
  auth();
  return github.issues.getComments({
    owner: owner,
    repo: repo,
    number: issueNum
  });

}

var getSuggestionsAndVoteTotals = function() {
  var getComments = [];
  return getAllSuggestions().then((suggestions) => {
    for (var i = 0; i < suggestions.length; i++) {
      getComments.push(getCommentsForIssue(suggestions[i].number));
    }
    return Promise.all(getComments).then((comments) => {
      for (var i = 0; i < suggestions.length; i++) {
        suggestions[i].voteTotal = 0;
        if (comments[i] && comments[i].length > 0) {
          for (var j = 0; j < comments[i].length; j++) {
            if (comments[i][j].body.indexOf('+1') === 0) {
              suggestions[i].voteTotal += 1;
            }
          }
        }
      }
      return suggestions;
    })
  });
}


//
// Doesn't currently check to see if user voted previously
// (needs to be added)

var voteForSuggestions = function(req) {
  console.log("REQ: ", req);
  var issueNum = req.number;
  var username = req.username || 'Unknown'
  var body = "+1 " + username;
  auth();
  return github.issues.createComment({
    owner: owner,
    repo: repo,
    number: issueNum,
    body: body
  });
}


var createSuggestion = function(req) {
  auth();
  var username = req.username || 'Unknown';
  var body = req.body;
  var title = req.title + " \n " + username;
  var labels = req.labels;

  return github.issues.create({
    owner: owner,
    repo: repo,
    body: body,
    title: title,
    labels: labels
  });
}

// Not in use currently
// But could be used to add labels after the creation
var addLabel = function(labelList) {
  var labelList = ["bug", "help wanted", "question"];

  return github.issues.addLabels({
    owner: owner,
    repo: repo,
    number: issueNum,
    body: labelList
  });
};


module.exports = {
  createSuggestion,
  getAllSuggestions,
  getCommentsForIssue,
  getLabels,
  getSuggestionsAndVoteTotals,
  voteForSuggestions,
}
