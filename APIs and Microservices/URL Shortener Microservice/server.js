"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var dns = require("dns");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.DB_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var Schema = mongoose.Schema;
let urlSchema = new Schema({
  short_url: String,
  url: String
});
let ShortUrl = mongoose.model("ShortURL", urlSchema);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(process.cwd() + "/public"));
app.use((req, res, next) => {
  console.log(req.method + " " + req.path);
  next();
});

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", (req, res) => {
  //Need to figure out sequential numbering system
  let httpRegex = /^(http[s]?:\/\/)/i;
  if (httpRegex.test(req.body.url)) {
    let searchUrl = req.body.url.split("/");
    dns.lookup(searchUrl[searchUrl.length - 1], (err, addresses, family) => {
      if (err) {
        res.json({ error: "invalid URL" });
        return err;
      }
      ShortUrl.findOne({ url: req.body.url }, (err, data) => {
        if (err) {
          let newUrl = new ShortUrl({
            short_url: Math.floor(Math.random() * 10000),
            url: req.body.url
          });
          newUrl.save((err, data) => {
            if (err) return err;
          });
          let createAndSaveShortUrl = done => {
            done(null, newUrl);
          };
          res.json({ original_url: newUrl.url, short_url: newUrl.short_url });
          return;
        }
        res.json({original_url: data.url, short_url: data.short_url});
      });
    });
  } else {
    res.json({ error: "invalid URL" });
    return;
  }
});

//Doesn't follow "node convention" but does work. Figure out how to set up with callback function
//Look into IIFEs (immediately invoked function expressions)

app.get("/api/shorturl/:num", (req, res) => {
  ShortUrl.findOne({ short_url: req.params.num }, (err, data) => {
    if (err) {
      return err;
    } else if (data === null) {
      res.json({ error: "URL does not exist" });
    } else {
      res.redirect(data.url);
    }
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
