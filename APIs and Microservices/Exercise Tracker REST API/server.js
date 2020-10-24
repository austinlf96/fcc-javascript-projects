const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//Mongoose setup- connects with database & creates schema
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
let userSchema= new Schema({
  username: String, 
  _id: String, 
  exercise_log: [{ 
    description: {type: String}, 
    duration: {type: Number}, 
    date: {type: String} 
  }]
});
let User= mongoose.model("Users", userSchema);

//Other variables
let usedIds=[];
const characters='abcdefghijkmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNPOQRSTUVWXYZ';

//FCC provided middlewares & serves index.html
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

//Console logging middleware
app.use('/', (req, res, next) => {
  console.log(req.method + ' ' + req.path);
  if (req.params) console.log(req.params);
  if(req.query) console.log(req.query);
  next();
});

/*
// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'});
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;
  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});
*/

//Random id generator
function newId(){
  let id= [];
  for(let i=0; i<9; i++){
    id.push(characters[Math.floor(Math.random() * 64)]);
  }
  id = id.join('').toString();
  if(usedIds.includes(id)) return newId();
  return id;
}

//POST Handlers

app.post("/api/exercise/new-user", (req, res) => {
  let newUser= new User({
    username: req.body.username,
    _id: newId(),
    exercise_log: []
  });
  newUser.save((err, data) => {
    if(err) return err;
  });
  res.json({username: newUser.username, _id: newUser._id});
});

app.post('/api/exercise/add', (req, res) => {
  let date, dateString;
  if(req.body.date === ''){
    date= new Date().toDateString();
  } else {
    date= new Date(req.body.date).toDateString();
  }
  let exercise= {
    description: req.body.description,
    duration: req.body.duration,
    date: date
  };
  
  User.findOne({_id: req.body.userId}, (err, data) => {
    User.update(data, data.exercise_log.push(exercise));
    data.save((err, data) => {
      if (err) err;
    });
    let userLog= data.exercise_log;
    res.json({
      username: data.username,
      description: userLog[userLog.length-1].description,
      duration: userLog[userLog.length-1].duration,
      _id: data._id,
      date: userLog[userLog.length-1].date
    });
  });
});

//GET Handlers

app.get('/api/exercise/users', (req, res) => {
  let users = [];
  User.find({}, (err, data) => {
    if (err) err;
    data.forEach((user) => {
      users.push({username: user.username, _id: user._id});
    });
    console.log(users);
    res.json(users);    
  });
});

app.get('/api/exercise/log', (req, res) => {
  if(req.query.userId === null) return res.json({error: "Must provide a user"});
  if(req.query.userId){
    User.findOne({_id: req.query.userId}, (err, data) => {
      let logs= [];

      //Sort logs by date
      data.exercise_log.sort((a, b) => {
        let comparison=0;
        let dateA= new Date(a.date);
        let dateB= new Date(b.date);
        if(dateA === dateB) return comparison;
        dateA > dateB ? comparison=1 : comparison=-1;
        return comparison;
      });

      if(req.query.from){

        //Filter logs that are only after from date
        let fromDate= new Date(req.query.from);
        data.exercise_log.map((logDate) => {
          let tempLogDate= new Date(logDate.date);
          if(tempLogDate > fromDate){
            logs.push({description: logDate.description, duration: logDate.duration, date: logDate.date});
          } 
        });

        //Filter logs between from & to dates 
        if(req.query.to){
          let toDate= new Date(req.query.to);
          logs= [];
          data.exercise_log.map((logDate) => {
            let tempLogDate= new Date (logDate.date)
            if(tempLogDate > fromDate && tempLogDate < toDate){
              logs.push({description: logDate.description, duration: logDate.duration, date: logDate.date});
            } 
          });
        }

        //Limit logs
        if (req.query.limit) { 
          logs=logs.slice(0, req.query.limit);
        }
        return res.json({username: data.username, _id: data._id, log: logs, count: logs.length});
      } else if (req.query.limit){
          logs=data.exercise_log.slice(0, req.query.limit);
          return res.json({username: data.username, _id: data._id, log: logs, count: logs.length});
      } else { 
        return res.json({username: data.username, _id: data._id, log: data.exercise_log, count: data.exercise_log.length});      
      }
    });
  } else { 
    res.json({error: 'Must enter UserID'});
  }
  
});

//Listens for HTTP Requests
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
