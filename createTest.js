const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'test';

MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  db.collection('users').insertOne({username: '테스트1', id: 'test', pw: 'test1'},
  function(err,result){
      if(err){
        console.log(err.message);
      }else{
        console.log(result);
      }
  });

  client.close();
});