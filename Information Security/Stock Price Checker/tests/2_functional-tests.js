/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
// FCC Back-End tester says data.assertions is undefined?
suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai
        .request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end((err, res) => {
           if(err) done(err);
           assert.equal(res.status, 200);
           assert.equal(res.body.stockData.stock, "GOOG");
           assert.isString(res.body.stockData.stock);
           assert.property(res.body.stockData, 'price');
           assert.property(res.body.stockData, 'likes');
           assert.typeOf(res.body.stockData, 'Object');
           done();
 
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end((err,res) => {
           if(err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "GOOG");
            assert.isString(res.body.stockData.stock);
            assert.property(res.body.stockData, 'price');
            assert.equal(res.body.stockData.likes, 1)
            assert.property(res.body.stockData, 'likes');
            assert.typeOf(res.body.stockData, 'Object');   
            done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai
          .request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end((err, res) => {
            if(err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "GOOG");
            assert.isString(res.body.stockData.stock);
            assert.property(res.body.stockData, 'price');
            assert.equal(res.body.stockData.likes, 1)
            assert.property(res.body.stockData, 'likes');
            assert.typeOf(res.body.stockData, 'Object');  
            done();
          });
      });
      
      test('2 stocks', function(done) {
        chai
          .request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'gnus']})
          .end((err, res) => {
            if(err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].stock, "GOOG");
            assert.equal(res.body.stockData[1].stock, "GNUS");
            assert.equal(res.body.stockData[0].rel_likes, 1);
            assert.equal(res.body.stockData[1].rel_likes, -1);
            assert.isString(res.body.stockData[0].stock);
            assert.isString(res.body.stockData[1].stock);
            assert.isArray(res.body.stockData); 
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[1], 'price');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.property(res.body.stockData[1], 'rel_likes');
            done();
          });        
      });
      
      test('2 stocks with like', function(done) {
        chai
          .request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'twtr'], like: true})
          .end((err, res) => {
            if(err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].stock, "GOOG");
            assert.equal(res.body.stockData[1].stock, "TWTR");
            assert.equal(res.body.stockData[0].rel_likes, 0);
            assert.equal(res.body.stockData[1].rel_likes, 0);
            assert.isString(res.body.stockData[0].stock);
            assert.isString(res.body.stockData[1].stock);
            assert.isArray(res.body.stockData); 
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[1], 'price');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.property(res.body.stockData[1], 'rel_likes');
            done();
          });        
      });
      
    });

});
