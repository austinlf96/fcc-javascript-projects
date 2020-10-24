/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const MONGODB_CONNECTION_STRING = process.env.DB;
const client = new MongoClient(MONGODB_CONNECTION_STRING, {
  useUnifiedTopology: true
});
module.exports = function(app) {
  client.connect((err, database) => {
    if (err) console.log(err);
    else {
      const db = database.db("personalLibrary");
      let collection = db.collection("books");
      console.log("Successful connection");

      app
        .route("/api/books")

        .get(function(req, res) {

          collection
            .find({})
            .project({ comments: 0 })
            .toArray((err, result) => {
              if (err) res.send(err);
              else {
                res.json(result);
              }
            });
        })

        .post(function(req, res, next) {
          var title = req.body.title;
          let id = new ObjectId();
          collection.insertOne(
            {
              _id: id,
              title: title,
              comments: [],
              commentcount: 0
            },
            (err, result) => {
              if (err) next(err);
              else {
                collection.findOne({ _id: id }, (error, doc) => {
                  if (error) next(error);
                  else res.json({ _id: doc._id, title: doc.title });
                });
              }
            }
          );
        })

        .delete(function(req, res) {

          let deleted;
          db.dropCollection("books", (err, result) => {
            console.log(result);
            if(result === true) res.send('complete delete successful');
            else console.log(err);
          });
        });

      app
        .route("/api/books/:id")

        .get(function(req, res) {
          try {
            var bookid = new ObjectId(req.params.id);
            collection.findOne({ _id: bookid }, (err, book) => {
              if (err) res.send('no book exists');
              else {
                if (book === null) res.send('no book exists');
                else res.json(book);
              }
            });
          } catch (e) {
            console.log(e);
            res.send('no book exists');
          }
        })

        .post(function(req, res, next) {
          try {
              var bookid = new ObjectId(req.params.id);
              var comment = req.body.comment;
              collection.findOne({ _id: bookid }, (err, book) => {
                if (err) return res.send('no book exists');
                else if (!book) return res.send('no book exists');
                else {
                  let comments = [...book.comments];
                  comments.push(comment);
                  collection.findOneAndUpdate(
                    { _id: bookid },
                    {
                      $set: { comments: comments, commentcount: comments.length }
                    },
                    { returnOriginal: false, projection: { commentcount: 0 } },
                    (err, updatedBook) => {
                      if (err) next(err);
                      else res.json(updatedBook.value);
                    }
                  );
                }
              });              
            
          } catch (e) {
            console.log(e);
            res.send('no book exists');
            next(e);
          }
        })

        .delete(function(req, res) {
          try {
           
              var bookid = new ObjectId(req.params.id);
              collection.findOneAndDelete({ _id: bookid }, (err, result) => {
                if (err) console.log(err);
                else if (result === null) res.send('no book exists');
                else return res.send("delete successful");
                
              });
          } catch (e) {
            console.log(e);
            res.send("no book exists");
          }

        });

      //404 Not Found Middleware
      app.use(function(req, res, next) {
        res
          .status(404)
          .type("text")
          .send("Not Found");
      });
    }
  });
};
