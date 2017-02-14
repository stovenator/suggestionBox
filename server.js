const express = require('express');
const path = require('path');
const app = express();
const github = require('./server/github');
var bodyParser  = require('body-parser');



app.use(express.static('./build'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next){
  var origin = req.get('origin');
  if (process.env.NODE_ENV === "development"){
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Origin", process.env.WEBSITES_CM_ACCEPT || "http://localhost:3002");
    res.header("Access-Control-Allow-Credentials", true);
  }
 next();
});


app.post('/api/test', function(req, res){
  var body = req.body;
  body.username = req.headers['jwt-un'];
  res.status(200).send(body);
})

app.get('/api/all', function (req, res) {
    github.getSuggestionsAndVoteTotals().then(res.send.bind(res))
});
app.post('/api/vote', function (req, res) {
  console.log("Headers: ", req.headers);
  var body = req.body;
  body.username = req.headers['jwt-un'];
  console.log("Body:", body);
  github.voteForSuggestions(body).then(res.send.bind(res));
});
app.post('/api/create', function (req, res) {
  var body = req.body;
  body.username = req.headers['jwt-un'];
  github.createSuggestion(body).then(res.send.bind(res));
});
app.get('/api/labels', function (req, res) {
  github.getLabels(req.body).then(res.send.bind(res));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.listen(9000);
