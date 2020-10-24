// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser= require('body-parser');

app.use((req,res,next) => {
  console.log(req.method + ' ' + req.path);
  next();
})
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//If no time is provided api returns current time by default
app.get("/api/timestamp", (req, res) => res.json({unix: new Date().getTime(), utc: new Date().toUTCString()}));


app.get("/api/timestamp/:date_string", (req, res) => {
  //Checks for initial violations of date formats including exceeding date restrictions
  if(req.params.date_string.match(/[A-za-z]/) || parseInt(req.params.date_string, 10) > 8640000000000000){
    res.json({error: "Invalid Date"});
  } else {
      req.time= new Date(req.params.date_string);
      if(req.time.getTime()){        
        //If date is in ISO-8601 or similar format      
        res.json({unix: req.time.getTime(), utc: req.time.toUTCString()});
      }else{
        if(req.params.date_string.match(/\D/)){
          //If date has multiple hyphons (This is an error trap)
          res.json({error: "Invalid Date"});
        } else {
          //If date is in milliseconds
          req.time = new Date(parseInt(req.params.date_string, 10));
          res.json({unix: req.time.getTime(), utc: req.time.toUTCString()});
        }
      }   
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});