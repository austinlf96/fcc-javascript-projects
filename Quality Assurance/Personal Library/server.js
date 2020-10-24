'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var helmet      = require('helmet');
var noCache     = require('nocache');
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
require('dotenv').config();
var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(helmet({
  frameguard: {
    action: 'allow-from',
    domain: 'https://www.glitch.com'
  }, 
  hidePoweredBy: {
    setTo: 'PHP 4.2.0'
  }, 
}));
app.use((req, res, next) => {
  console.log('>>>' + req.method + ' ' + req.path);
  next();
});
app.use(noCache()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  


//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
