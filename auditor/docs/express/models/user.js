var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  model      = require('../Schemas');

var Schema  = mongoose.Schema
 , salt     = 'mySaltyString'
 , SHA2     = new (require('jshashes').SHA512)()
 , ObjectId = Schema.ObjectId
 , Company  = model.Company
 , Invoice  = model.Invoice
 , User     = model.User
 , Account  = model.Account;

function encodePassword( pass ){  
  return SHA2.b64_hmac(pass, salt )
}

function getHash(n){
  return crypto.randomBytes(n).toString('hex');
}

function check(data, callback) {
    mongoose.model('Account', Accounts).count(data, function (err, count) {
        callback(err, count);
    });
}

function validate(email, confirm, callback) {

    check({'users.email': email}, function (err, exists) {
        if (err) {
            return callback(err);
        }

        callback(err,exists);
    });
}

/* Model Class
--------------------------- */
provider = function(){
   
  

};

exports.provider = provider;


