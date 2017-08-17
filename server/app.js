const express = require('express');
const fs = require('fs');
const app = express();
var morgan = require('morgan')
var bigData = [];
app.listen(3000);
// app.use(morgan(':user-agent :date[iso] :method :url :http-version :status'));

app.use((req, res, next) => {
// write your logging code here
    //First, store all the details into variables
    var Agent = req.headers['user-agent'].replace(',', " ");
    var Time = new Date().toISOString();
    var Resource = req.url;
    var Method = req.method;
    var Version = "HTTP/" + req.httpVersion;
    var Status = res.statusCode;
    
    //Store the request details into a JSON file to access later
    var data = {Agent,Method,Resource,Status,Time, Version};
    bigData[bigData.length] = data;
    
    var newLogLine = Agent + "," + Time + "," + Method + "," + Resource + "," + Version + "," + Status;
    console.log(newLogLine);
    fs.appendFile('./server/log.csv','\n' + newLogLine, function(err) {
        if (err) throw err;
        next();
    });
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    res.send(bigData);
});

module.exports = app;