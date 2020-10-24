/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();
const mongo        = require('mongodb');
const MongoClient  = mongo.MongoClient;
const ObjectId     = mongo.ObjectId;
const expect       = require('chai').expect;
const client       = new MongoClient(process.env.DB, {useUnifiedTopology: true});
 
module.exports = function (app) {
  client.connect((err, database) => {
    if (err) console.log(err);
    else{
      const db = database.db('boards');
      console.log('Successful connection!');
      app.route('/api/threads/:board')
       
        .get((req, res) => {
          const board = req.params.board;
          const collection = db.collection(board);
          let threads, newReplies;
          collection.find({})
            .limit(10)
            .project({'reported':0, 'delete_password': 0})
            .toArray((error, docs) => {
              if(error) console.log(error);
              else {
                for( let i =0; i < docs.length; i++){
                  docs[i].replycount = docs[i].replies.length;
                }                
                return res.send(docs);
              }
            });
        })
      
        .post((req, res) => {
          const collection = db.collection(req.params.board);
          const date = new Date();
          const text = req.body.text;
          const password = req.body.delete_password;
          const newThread = new Object({
            _id: new ObjectId(),
            text: text,
            created_on: date,
            bumped_on: date,
            reported: false,
            delete_password: password,
            replies: []
          });
          collection.insertOne(newThread, (err, result) => {
            if (err) console.log(err);
            else{
              if(result.result.ok === 1) res.redirect('/b/' + req.params.board)
              else res.send('Uh oh, there was an error');
            }
          });  
        })
      
        .put((req, res) => {
          const collection = db.collection(req.params.board);
          const id = ObjectId(req.body.thread_id);
          collection.findOneAndUpdate({_id: id}, {$set: {reported: true}}, (err, doc) => {
            if(err) console.log(err);
            else if(doc.ok === 1) res.send('reported');
            else res.send('incorrect password');
          });
        })
      
        .delete((req, res) => {
          const collection = db.collection(req.params.board);
          const id = ObjectId(req.body.thread_id);
          const password = req.body.delete_password;
          collection.findOneAndDelete({_id: id, delete_password: password}, (err, doc) => {
            if(err) console.log(err);
            else if(doc.value === null) res.send('incorrect password');
            else if(doc.ok === 1) res.send('success');
            else res.send('incorrect password');
          });        
        });

      app.route('/api/replies/:board')
      
        .get((req, res) => {
          const collection = db.collection(req.params.board);
          const id = ObjectId(req.query.thread_id);
          collection.findOne({_id: id}, {project: {delete_password: '0', reported: '0'}}, (err, doc) => {
            if(err) console.log(err);
            else{
                let safeReplies = doc.replies.map((reply) => {
                delete reply.delete_password;
                delete reply.reported;
                return reply;
              });
              return res.json({_id: doc._id, text: doc.text, created_on: doc.created_on, bumped_on: doc.bumped_on, replies: safeReplies});              
            }
          });
        })
      
        .post((req, res) => {
          const collection = db.collection(req.params.board);
          const id = ObjectId(req.body.thread_id.slice(0,24));
          const text = req.body.text;
          const password = req.body.delete_password;
          const date = new Date();
          const _id = new ObjectId();
          const reply = new Object({
            _id: _id, 
            text: text,
            delete_password: password,
            created_on: date,
            reported: false
          });        
          collection.findOneAndUpdate({_id: id}, {$set : {bumped_on: date}, $push: {replies: reply}}, (err, doc) => {
            if (err) console.log(err);
            else if(doc.ok === 1) res.redirect('/b/' + req.params.board +'/' +id);
            else{
              console.log(doc);
            }
          });
        })
      
        .put((req, res) => {
          const collection = db.collection(req.params.board);
          const r_id= ObjectId(req.body.reply_id);
          const t_id = ObjectId(req.body.thread_id);
          collection.findOneAndUpdate(
            {"replies._id": r_id}, 
            {$set: {"replies.$.reported": true}}, 
            (err, result) => {
              if (err) res.json(err);
              else return res.send('reported');
            });
          })
      
        .delete((req, res) => {
          const collection = db.collection(req.params.board);
          const r_id = ObjectId(req.body.reply_id);
          const password = req.body.delete_password;
          collection.findOneAndUpdate(
            {"replies._id" : r_id, "replies.delete_password" : password}, 
            {$set: {"replies.$.text" : "[deleted]"}}, 
            (err, doc) => {
              if (err) res.json(err);
              else if(doc.value === null) res.send('incorrect password');
              else if (doc.ok === 1) res.send('success')
              else res.send('incorrect password');
          });
        });   
    }
      //404 Not Found Middleware
      app.use(function(req, res, next) {
        res.status(404)
          .type('text')
          .send('Not Found');
      });
    
  });
};
