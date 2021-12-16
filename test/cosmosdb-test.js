var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://cosmosdb-blockchain-test:taqbU4ZbrTvtqKLMjNLx5FFKnL7zxDQAK5HdLhKPVL5S3YXqa2AJY5aah3Ukm6BEIVlkRn8BxzMs61hU6T8yvw%3D%3D@cosmosdb-blockchain-test.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmosdb-blockchain-test@';

var insertDocument = function(db, callback) {
db.collection('db-test').insertOne( {
        "id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
            { "firstName": "Thomas" },
            { "firstName": "Mary Kay" }
        ],
        "children": [
            { "firstName": "John", "gender": "male", "grade": 7 }
        ],
        "pets": [
            { "givenName": "Fluffy" }
        ],
        "address": { "country": "USA", "state": "WA", "city": "Seattle" }
    }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the db-test collection.");
    callback();
});
};

var findFamilies = function(db, callback) {
var cursor =db.collection('db-test').find( );
cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
        console.dir(doc);
    } else {
        callback();
    }
});
};

var updateFamilies = function(db, callback) {
db.collection('db-test').updateOne(
    { "lastName" : "Andersen" },
    {
        $set: { "pets": [
            { "givenName": "Fluffy" },
            { "givenName": "Rocky"}
        ] },
        $currentDate: { "lastModified": true }
    }, function(err, results) {
    console.log(results);
    callback();
});
};

var removeFamilies = function(db, callback) {
db.collection('db-test').deleteMany(
    { "lastName": "Andersen" },
    function(err, results) {
        console.log(results);
        callback();
    }
);
};

MongoClient.connect(url, function(err, client) {
assert.equal(null, err);
var db = client.db('kryptobirdz');
insertDocument(db, function() {
    findFamilies(db, function() {
    updateFamilies(db, function() {
        removeFamilies(db, function() {
            client.close();
        });
    });
    });
});
});