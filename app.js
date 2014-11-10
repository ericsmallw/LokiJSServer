var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var loki = require('lokijs');
var names = require('./names')
var cors = require('cors');
var lokiInstance;
var users;
//initialize lokijs db if db.json is empty
var dbFileStats = fs.statSync('db.json');
lokiInstance = new loki('db.json');

if(dbFileStats["size"] == 0){
    var users = lokiInstance.addCollection('users');
    for(var i = 0; i < 100000; i ++){
        var firstnamerand = Math.floor(Math.random() * 1000);
        var lastnamerand = Math.floor(Math.random() * 1000);
        var username = names.firstNames[firstnamerand] + " " + names.lastNames[lastnamerand];
        var age = Math.floor(Math.random() * (60 - 18) + 18);
        users.insert({name: username, age: age});
    }
    lokiInstance.save();
}else {
    lokiInstance.loadDatabase()
};;


var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', cors(), function(req, res){
    var collection = lokiInstance.getCollection('users');
    var user = collection.get(Math.floor(Math.random() * 10000));
    res.send(user.name);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
