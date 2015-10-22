console.log("loading express...");
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var parser = bodyParser.json();

var fsd = require("./firestep-driver");
var firestep = new fsd.FireStepDriver();

//var kue = require('kue');
//var jobs = kue.createQueue();
//var firepick = require('./fireick/firepick.js');

express.static.mime.define({
    'application/json': ['firestep']
});

app.use(parser);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var __appdir = path.join(__dirname, "../www");

var dirs = ['bootstrap', 'html', 'img', 'css', 'js', 'lib', 'partials'];
for (var i = 0; i < dirs.length; i++) {
    var urlpath = '/firerest/' + dirs[i];
    var filepath = path.join(__appdir, dirs[i]);
    app.use(urlpath, express.static(filepath));
    console.log("INFO\t: Mapping urlpath:" + urlpath + " to:" + filepath);
}

//app.use('/www', express.static(__appdir));
//app.use('/firerest/index.html', express.static(__appdir + "/html/index.html"));
app.get('/firerest/index.html', function(req, res) {
    res.sendFile(path.join(__appdir, 'html/index.html'));
});
app.get('/firestep', function(req, res) {
    res.sendFile(path.join(__appdir, 'html/firestep.html'));
});
app.get('/', function(req, res) {
    res.redirect('/firerest/index.html');
});
app.get('/index.html', function(req, res) {
    res.redirect('/firerest/index.html');
});

post_firestep = function(req, res, next) {
    console.log("INFO\t: POST firestep");
    console.log(req.body);
    console.log(JSON.stringify(req.body));
};
app.post("/firestep", parser, post_firestep);

///////////////////////// CHOOSE HTTP PORT ////////////////////////
// Choose port 80 if you are comfortable having your web server operate with root-level access
//var firerest_port=80; // sudo node server/firerest.js
var firerest_port = 8080; // node server/firerest.js

app.listen(firerest_port);
console.log('INFO\t: firestep-cam REST service listening on port ' + firerest_port);

