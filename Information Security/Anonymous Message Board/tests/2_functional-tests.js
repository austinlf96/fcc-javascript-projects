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
suite('Functional Tests', function() {
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    let id;
    suite('POST', function() {
      test('POST', (done) => {
        chai
          .request(server)
          .post('/api/threads/test')
          .send({
            text: 'A testing life for me',
            delete_password: 'yohoyoho'
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              done();  
            }
          });      
        });
    });
    
    suite('GET', function() {
      
      test('GET', (done) => {
        chai
          .request(server)
          .get('/api/threads/test')
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              assert.property(res.body[0], '_id');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'bumped_on');
              assert.property(res.body[0], 'text');
              assert.property(res.body[0], 'replies');
              assert.notProperty(res.body[0], 'delete_password');
              assert.notProperty(res.body[0], 'reported');              
              assert.isString(res.body[0].created_on);
              assert.isString(res.body[0].bumped_on);
              assert.isString(res.body[0].text);
              assert.isString(res.body[0]._id);
              assert.isArray(res.body[0].replies);
              assert.isArray(res.body);
              id = res.body[0]._id;
              done();  
            }
          });      
        });      
    });
    
    suite('DELETE', function() {
      
      test('DELETE', (done) => {
        chai
          .request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: id, 
            delete_password: 'yohoyoho'
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              assert.equal(res.text, 'success');
              done();  
            }
          });      
        }); 
      
      test('DELETE', (done) => {
        chai
          .request(server)
          .delete('/api/threads/test')
          .send({
            _id: id, 
            delete_password: 'wrongword'
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              assert.equal(res.text, 'incorrect password');
              done();  
            }
          });      
        });  
    });
    
    suite('PUT', function() {
       test('PUT', (done) => {
          chai
            .request(server)
            .put('/api/threads/test')
            .send({
              thread_id: id
            })
            .end((err, res) => {
              if(err) console.log(err);
              else{
                assert.equal(res.status, 200);
                assert.equal(res.text, 'reported');
                done();  
              }
            });      
        });        
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    let id, r_id;
    suite('POST', function() {
      
      test('POST thread', (done) => {
        chai
          .request(server) 
          .post('/api/threads/test')
          .send({
            text: 'Sample replies thread test here',
            delete_password: 'yohoyoho'
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{ 
              assert.equal(res.status, 200);
              done();
            }
          });
      });
      
      test('GET id', (done) => {
        chai
          .request(server)
          .get('/api/threads/test')
          .end((err, res) => {
            if(err) console.log(err);
            else {
              assert.equal(res.status, 200);
              id = res.body[res.body.length-1]._id;
              console.log(id);
              done();
            }
        });
      });
      
      test('POST', (done) => {
        chai
          .request(server)
          .post('/api/replies/test')
          .send({
            thread_id: id,
            text: 'A replying life for me',
            delete_password: 'yohoyoho'
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              done();  
            }
          });      
        });      
    });
    
    suite('GET', function() {
      
      test('GET', (done) => {
        chai
          .request(server)
          .get('/api/replies/test?thread_id='+id)
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              assert.property(res.body, '_id');
              assert.property(res.body, 'created_on');
              assert.property(res.body, 'bumped_on');
              assert.property(res.body, 'text');
              assert.property(res.body, 'replies');
              assert.notProperty(res.body, 'delete_password');
              assert.notProperty(res.body, 'reported');
              assert.property(res.body.replies[0], '_id');
              assert.property(res.body.replies[0], 'created_on');
              assert.property(res.body.replies[0], 'text');   
              assert.notProperty(res.body.replies[0], 'delete_password');
              assert.notProperty(res.body.replies[0], 'reported');              
              assert.isString(res.body.created_on);
              assert.isString(res.body.bumped_on);
              assert.isString(res.body.text);
              assert.isString(res.body._id);
              assert.isArray(res.body.replies);
              assert.isObject(res.body);
              id = res.body._id;
              r_id = res.body.replies[0]._id;
              done();  
            }
          });      
        });  
    });
    
    suite('PUT', function() {
      
      test('PUT', (done) => {
        chai
          .request(server)
          .put('/api/replies/test')
          .send({
            thread_id: id,
            reply_id: r_id
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{
              assert.equal(res.status, 200);
              assert.equal(res.text, 'reported');
              done();
            }
          });
        });        
      });
    
    suite('DELETE', function() {
      
      test('DELETE', (done) => {
        chai
          .request(server)
          .delete('/api/replies/test?thread_id='+id)
          .send({
            thread_id: id,
            reply_id: r_id,
            delete_password: 'yohoyoho'
          })
          .end((err, res) => {
            if(err) console.log(err);
            else{ 
              assert.equal(res.status, 200);
              assert.equal(res.text, 'success');
              done();
            }
          })
      });
      
     test('DELETE', (done) => {
          chai
            .request(server)
            .delete('/api/threads/test')
            .send({
              thread_id: id, 
              delete_password: 'yohoyoho'
            })
            .end((err, res) => {
              if(err) console.log(err);
              else{
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success');
                done();  
              }
            });      
          });       
      });
    });
});