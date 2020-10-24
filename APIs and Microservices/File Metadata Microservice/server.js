'use strict';

var express = require('express');
var cors = require('cors');
var multer= require('multer');
// require and use "multer"...

var app = express();
var upload= multer();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/', (req, res, next)=> {
  console.log(req.method + ' - ' + req.path);
  next();
});
app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  console.log('hello');
  res.json({name: req.file.originalname, size: req.file.size});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
