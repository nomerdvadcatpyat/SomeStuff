const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/user');
const Image = require('./models/image');

const mongoUri = "Ваша монго uri";
mongoose.connect(mongoUri, {
  // useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const connection = mongoose.connection;
// connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Image API
exports.getImages = function(condition) {
    return new Promise((resolve, reject) => 
      Image.find(condition, function(err, data) {
      if(err) reject(err);
      resolve(data);
    }));
}

exports.uploadImage = function ({ fullImage, alt, owner }) {
  return new Promise((resolve, reject) => {
    Image.create({ fullImage, alt, owner }, function(err, data) {
      console.log('create image', data);
      if(err) {
        reject(err);
      }
      resolve(data);
    })
  });
}

// User API
exports.createUser = function({ login, password }){
    const user = {
        login: login,
        password: hash(password)
    }
    return new Promise((resolve, reject) => {
        User.create(user, function(err, data) {
            console.log('create user', data);
            if(err) {
                // console.log(err);
                reject(err);
            }
            resolve(data);
        })
    });
}

function hash(text) {
  return crypto.createHash('sha1')
  .update(text).digest('base64');
}
 

exports.getUser = function(condition) {
    return new Promise((resolve, reject) => {
        User.findOne(condition, function(err, data) {
            if(err) reject(err);
            resolve(data);
        })
    });
}

exports.removeUsers = function(condition) {
  return new Promise((resolve, reject) => {
    User.deleteMany( condition, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
} 

exports.removeImages = function(condition) {
  return new Promise((resolve, reject) => {
    Image.deleteMany( condition, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
}


exports.closeConnection = function() { mongoose.connection.close(); }


