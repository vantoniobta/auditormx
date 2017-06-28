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
 , Account  = model.Account
 , Log      = model.Log;

/* Model Class
--------------------------- */
provider = function(){

  this.register   = function(data,callback){
      response = new Log(data);
      response.save(function(err,doc){
      if(err){
        callback({code:100,msg:"Error al guardar la referencia"});
      }else{
        callback({code:0,msg:"Referencia ok"});
      }
    });
  }

  this.lastActions = function(id,callback){      
    Log.find({account:id}).sort('-_id').limit(8).exec(function(e,d){
      if(e){
        callback({code:100,msg:"Error al guardar la referencia"});
      }else{        
        callback({code:0,msg:"Data is read ok",data:d});
      }
    });
  }
};

exports.provider = provider;


