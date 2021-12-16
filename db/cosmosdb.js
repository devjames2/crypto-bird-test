// const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

// import mongoose from "mongoose"
/**
* Set to Node.js native promises
* Per https://mongoosejs.com/docs/promises.html
*/
mongoose.Promise = global.Promise;

// const env = require('./env/environment');

// eslint-disable-next-line max-len
const mongoUri = `mongodb://cosmosdb-blockchain-test:taqbU4ZbrTvtqKLMjNLx5FFKnL7zxDQAK5HdLhKPVL5S3YXqa2AJY5aah3Ukm6BEIVlkRn8BxzMs61hU6T8yvw%3D%3D@cosmosdb-blockchain-test.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmosdb-blockchain-test@`;

function connect() {
    // mongoose.set('debug', true);
    return MongoClient.connect(mongoUri);
}

module.exports = {
    connect
    // mongoose
};