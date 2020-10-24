/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
require("dotenv").config();
const expect = require("chai").expect;
const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");

const CONNECTION_STRING = process.env.DB;
const client = new MongoClient(CONNECTION_STRING, { useUnifiedTopology: true });
const stockUrl = "https://repeated-alpaca.glitch.me/v1/stock/";

module.exports = function(app) {
  client.connect((err, database) => {
    if (err) return console.log(err);
    else {
      console.log("Successful connect!");
      const db = database.db("stocks");
      //FCC Back-End tester is returning undefined, null, or 0 for various stock tests. Console log to diagnose error.
      app.route("/api/stock-prices").get(function(req, res) {
        let stock1, stock2, stockObject1, stockObject2, newStock1, newStock2;
        let like = false;
        let ip = req.ip;
        if (req.query.stock) {
          if (req.query.like) like = true;
          console.log(req.query.like);
          if (Array.isArray(req.query.stock)) {
            if (req.query.stock.length > 2) res.json({ error: "Invalid request" });
            stock1 = req.query.stock[0];
            stock2 = req.query.stock[1];
            console.log(stock1 + ' & 2:  ' +stock2);
            axios
              .all([
                axios.get(stockUrl + stock1 + "/quote"),
                axios.get(stockUrl + stock2 + "/quote")
              ])
              .then(
                axios.spread((stockData1, stockData2) => {
                  let updates1 = [
                    {
                      $set: {
                        stock: stock1,
                        price: stockData1.data.latestPrice,
                        likes: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: [like, true] },
                                // If ip is in $ips
                                {
                                  $eq: [
                                    true,
                                    {
                                      $not: [
                                        {
                                          $in: [
                                            ip,
                                            { $ifNull: ["$registeredIPs", []] }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            then: { $add: ["$likes", 1] },
                            else: { $ifNull: ["$likes", 0] }
                          }
                        },
                        registeredIPs: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: [like, true] },
                                {
                                  $eq: [
                                    true,
                                    {
                                      $not: [
                                        {
                                          $in: [
                                            ip,
                                            { $ifNull: ["$registeredIPs", []] }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            then: {
                              $concatArrays: [
                                { $ifNull: ["$registeredIPs", []] },
                                [ip]
                              ]
                            },
                            else: { $ifNull: ["$registeredIPs", []] }
                          }
                        }
                      }
                    }
                  ];
                  let updates2 = [
                    {
                      $set: {
                        stock: stock2,
                        price: stockData2.data.latestPrice,
                        likes: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: [like, true] },
                                // If ip is in $ips
                                {
                                  $eq: [
                                    true,
                                    {
                                      $not: [
                                        {
                                          $in: [
                                            ip,
                                            { $ifNull: ["$registeredIPs", []] }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            then: { $add: ["$likes", 1] },
                            else: { $ifNull: ["$likes", 0] }
                          }
                        },
                        registeredIPs: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: [like, true] },
                                {
                                  $eq: [
                                    true,
                                    {
                                      $not: [
                                        {
                                          $in: [
                                            ip,
                                            { $ifNull: ["$registeredIPs", []] }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            then: {
                              $concatArrays: [
                                { $ifNull: ["$registeredIPs", []] },
                                [ip]
                              ]
                            },
                            else: { $ifNull: ["$registeredIPs", []] }
                          }
                        }
                      }
                    }
                  ];
                  let message;
                  let relativeLikes;
                  db.collection(stock1).findOneAndUpdate(
                      { stock: stock1 },
                      updates1,
                      { upsert: true, returnOriginal: false },
                      (err, doc1) => {
                        if (err) console.log(err);
                        else {
                          db.collection(stock2).findOneAndUpdate(
                              { stock: stock2 },
                              updates2,
                              { upsert: true, returnOriginal: false },
                              (err, doc2) => {
                                if (err) console.log(err);
                                else {
                                  let SO1 = JSON.parse(JSON.stringify(doc1.value));
                                  let SO2 = JSON.parse(JSON.stringify(doc2.value));
                                  if(SO1.registeredIPs.includes(ip) || SO2.registeredIPs.includes(ip)) message = "Your like(s) were only added to stocks you have not yet liked";
                                  if (SO1.likes === SO2.likes){
                                    SO1.rel_likes = 0;
                                    SO2.rel_likes = 0;
                                  } else if (SO1.likes > SO2.likes){
                                    SO1.rel_likes = SO1.likes - SO2.likes;
                                    SO2.rel_likes = SO2.likes -(SO1.likes - SO2.likes);                                    
                                  } else {
                                    SO2.rel_likes = SO2.likes - SO1.likes;
                                    SO1.rel_likes = SO1.likes -(SO2.likes - SO1.likes);                                     
                                  }
                                  newStock1 = new Object({
                                    stock: SO1.stock.toUpperCase(),
                                    price: SO1.price,
                                    rel_likes: SO1.rel_likes
                                  });
                                  newStock2 = new Object({
                                    stock: SO2.stock.toUpperCase(),
                                    price: SO2.price,
                                    rel_likes: SO2.rel_likes
                                  });
                                  console.log(newStock1 + ' & ' + newStock2)
                                  return res.json({ stockData: [newStock1, newStock2] });
                                }                                
                              }
                            );
                        }
                      }
                    );
                })
              )
              .catch(err => console.log(err));
          } else {
            stock1 = req.query.stock;
            console.log(stock1);
            axios
              .get(stockUrl + req.query.stock + "/quote")
              .then(response => response.data.latestPrice)
              .then(cost => {
                let updates = [
                  {
                    $set: {
                      stock: stock1,
                      price: cost,
                      likes: {
                        $cond: {
                          if: {
                            $and: [
                              { $eq: [like, true] },
                              // If ip is in $ips
                              {
                                $eq: [
                                  true,
                                  {
                                    $not: [
                                      {
                                        $in: [
                                          ip,
                                          { $ifNull: ["$registeredIPs", []] }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          then: { $add: ["$likes", 1] },
                          else: { $ifNull: ["$likes", 0] }
                        }
                      },
                      registeredIPs: {
                        $cond: {
                          if: {
                            $and: [
                              { $eq: [like, true] },
                              {
                                $eq: [
                                  true,
                                  {
                                    $not: [
                                      {
                                        $in: [
                                          ip,
                                          { $ifNull: ["$registeredIPs", []] }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          then: {
                            $concatArrays: [
                              { $ifNull: ["$registeredIPs", []] },
                              [ip]
                            ]
                          },
                          else: { $ifNull: ["$registeredIPs", []] }
                        }
                      }
                    }
                  }
                ];
                db.collection(stock1).findOneAndUpdate(
                  { stock: stock1 },
                  updates,
                  { upsert: true, returnOriginal: false },
                  (err, doc) => {
                    if (err) console.log(err);
                    else {
                      console.log(doc.value);
                      return res.json({
                        stockData: {
                          stock: doc.value.stock.toUpperCase(),
                          price: doc.value.price,
                          likes: doc.value.likes,
                          registeredIPs: doc.value.registeredIPs
                        }
                      });
                    }
                  }
                );
              })
              .catch(err => console.log(err));
          }}
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
