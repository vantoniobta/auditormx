var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  model      = require('../Schemas');

var Schema    = mongoose.Schema
 , salt       = 'mySaltyString'
 , SHA2       = new (require('jshashes').SHA512)()
 , ObjectId   = Schema.ObjectId
 , Company    = model.Company
 , Invoice    = model.Invoice
 , User       = model.User
 , Account    = model.Account
 , Campaing = model.Campaing
 , Inventory  = model.Inventory
 , Log        = model.Log;
 

/* Model Class
--------------------------- */
provider = function(){
//  this.getAll = function(callback){      
//    Inventory.find().exec(function(e,d){
//      if(e){
//        callback({code:100,msg:"Error al guardar la referencia"});
//      }else{        
//        callback({code:0,msg:"Data ok",data:d});
//      }
//    });
//  }
//};
}

exports.provider = provider;