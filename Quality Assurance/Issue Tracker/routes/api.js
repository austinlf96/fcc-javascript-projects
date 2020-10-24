/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const client = new MongoClient(CONNECTION_STRING, ({useUnifiedTopology: true}));

module.exports = function (app) {
  
  client.connect((err, database) => {
    
    if(err) console.log(err);
    else{
      const db= database.db('projects');
      let collection;
      
      app.route('/api/issues/:project')
      
        .get(function (req, res){
          let project = req.params.project;
          let filters = new Object();
          collection = db.collection(project);
          for (const property in req.query) {
            filters[property] = req.query[property];
          }
          if(req.query._id) filters._id = new ObjectId(req.query._id);
          if(req.query.open == 'false') filters.open = false;
          if(req.query.open == 'true') filters.open = true;
          db.collection(project).find(filters).toArray((err, docs) => res.json(docs));
        })

        .post(function (req, res, next){
        
          let project = req.params.project;
          let document;
          let id= new ObjectId();
        
          db.collection(project).insertOne({            
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to || '', 
            status_text: req.body.status_text || '',
            created_on: new Date(),
            updated_on: new Date(),
            open: true,
            _id: id },
            (err, result) => {
              if(err) next(err);
              else{
                db.collection(project).findOne({_id: id}, (error, doc) => {
                  if (error) next(error);
                  else return res.json(doc);
                });
              }
            });
         })
      
        .put(function (req, res){
          let project = req.params.project;
          collection = db.collection(project);
          if(!req.body) res.send('no updated field sent');
          else {
            
            let update = new Object();
            let properties = Object.keys(req.body);
            try { 
              let id = new ObjectId(req.body._id);
              for (const property in req.body){
                 update[property] = req.body[property];
              }
              update.updated_on = new Date();
              delete update._id;
              if(update.open) update.open=false;
              db.collection(project).updateOne({_id: id}, {$set: update}, (err, result) => {
                if (err) res.send('could not update ' + id);
                else { 
                  if(result.modifiedCount != 0) res.send('successfully updated');
                  else res.send('could not update ' + id);
                }
              });            
            
            } catch { 
              res.send('invalid id');
            }

          }
        })

        .delete(function (req, res){
          let project = req.params.project;
          collection = db.collection(project);
          if(!req.body._id) res.send('_id error');
          else{
            try {
              let id= new ObjectId(req.body._id);

              db.collection(project).deleteOne({_id: id}, (err, result) => {
                if (err) res.send('could not delete ' + id);
                else{
                  if(result.deletedCount === 1) res.send('deleted ' + id);
                  else res.send('could not delete ' + id);
                }
              });
            } catch (err){
              throw (err);
            }
          }
        });    
        
        app.use(function(req, res, next) {
          res.status(404)
            .type('text')
            .send('Not Found');
        });
    }
  });

    
};
