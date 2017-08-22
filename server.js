const express = require('express');
const path = require('path');
const app = express();
const github = require('./server/github');
var bodyParser = require('body-parser');



app.use(express.static('./build'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  var origin = req.get('origin');
  if (process.env.NODE_ENV === "development") {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Origin", process.env.WEBSITES_CM_ACCEPT || "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
});


app.post('/api/test', function(req, res) {
  var body = req.body;
  body.username = req.headers['jwt-un'];
  res.status(200).send(body);
});

app.get('/api/all', (req, res) => Promise.resolve(
  (req.headers && req.headers['jwt-un']) ? JSON.parse(req.headers['jwt-un']) : 'Unknown')
  .then(username => {
    var labels = req.query && req.query.labels ? req.query.labels : null;
    return { username: username, labels: labels};
  })
  .then(result => github.getSuggestionsAndVoteTotals(result.username, result.labels))
  .then(res.send.bind(res))
  .catch(error => res.status(200).json({ error })));

app.post('/api/vote', (req, res) => Promise.resolve(
  (req.headers && req.headers['jwt-un']) ? JSON.parse(req.headers['jwt-un']) : 'Unknown')
  .then(username => Object.assign(req.body, { username }))
  .then(mergedBody => Promise.all([
    github.voteForSuggestions(mergedBody),
    res.send.bind(res)
  ]))
  .catch(error => res.status(503).json({ error })));

app.post('/api/create', (req, res) => Promise.resolve (
  (req.headers && req.headers['jwt-un']) ? JSON.parse(req.headers['jwt-un']) : 'Unknown')
  .then(username => Object.assign(req.body, { username }))
  .then(mergedBody => github.createSuggestion(mergedBody))
  .then(res.send.bind(res))
  .catch(error => res.status(503).json({ error })));

app.get('/api/labels', (req, res) => {
  return github.getLabels().then(res.send.bind(res));
});

app.get('/api/labels/tags', (req, res) => {
  return github.getTagLabels().then(res.send.bind(res));
});

app.get('/api/labels/categories', (req, res) => {
  return github.getCategoryLabels().then(res.send.bind(res));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.listen(9000);
