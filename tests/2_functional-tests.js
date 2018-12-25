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

  var testText = Math.floor(Math.random()*10000000);
  var testId; //_id of thread 1 created
  var testId2; //_id of thread 2 created
  var testId3; //_id of reply created
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('post test for threads(create 2 thread because one will be deleted later)', (done) => {
        chai.request(server)
        .post('/api/threads/test')
        .send({text: testText, delete_password: 'delete'})
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post('/api/threads/test')
        .send({text: testText, delete_password: 'delete'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
      })
    });
    
    suite('GET', function() {
      test('get test for threads', (done) => {
        chai.request(server)
        .get('/api/threads/test')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isBelow(res.body.length, 11);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isArray(res.body[0].replies);
          assert.isBelow(res.body[0].replies.length, 4);
          testId = res.body[0]._id;
          testId2 = res.body[1]._id;
          done();
        })
      })
    });
    
suite('DELETE', function() {
      
      test('delete thread with good password', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id:testId, delete_password:'delete'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
      test('delete thread with bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: testId2, delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      test('put test for thread', (done) => {
        chai.request(server)
        .put('/api/threads/test')
        .send({report_id: testId2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: testId2, text:'a reply'+testText, delete_password:'delete'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('Get all replies for 1 thread', function(done) {
        chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: testId2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'a reply'+testText);
          testId3 = res.body.replies[0]._id
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('report reply', function(done) {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id:testId2 ,reply_id:testId2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('delete reply with bad password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: testId2 ,reply_id: testId3, delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('delete reply with valid password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: testId2 ,reply_id: testId3, delete_password: 'delete'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
  });

});
