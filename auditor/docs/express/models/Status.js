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
 , Status   = model.Status
 , Log      = model.Log;


/* Model Class
--------------------------- */
provider = function(){

    this.loadById = function(id,callback){
        Status.findOne({_id:id}, function(err,status){
          if (err) {
              callback({code:100, msg:'error en el server'});
          }else{
              callback({code:0,msg:'ok',status:status});
          }
      });


  }

  this.lastByLocation = function(id,callback){     
    Status.findOne({location:id},{status:1,images:1}).sort({created:-1}).limit(1).execFind(function(err,status){
      console.log( err || status);
        if(err) {
            callback({code:100, msg:'error en el server'});
        }else{
            callback({code:0,msg:'ok',status:status});
        }
    });
  }


    this.loadBySupplier = function(id,callback){
        Status.find({supplier:id}).exec(function(error,docs){
           if (err) {
              callback({code:100,msg:'Error en el server'});
           }else{
              if (docs) {
                 callback({code:0,msg:'ok',data:docs});
              }else{
                 callback({code:100,msg:'Locations no encontrados para este proveedor'})
              }
           }
        });
    }

};

exports.provider = provider;


