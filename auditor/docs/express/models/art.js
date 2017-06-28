var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  model      = require('../Schemas');

var Schema    = mongoose.Schema
 , salt       = 'mySaltyString'
 , SHA2       = new (require('jshashes').SHA512)()
 , ObjectId   = Schema.ObjectId
 , Inventory  = model.Inventory
 , Art      = model.Art
 , User       = model.User
 , Account    = model.Account
 , Log        = model.Log;
 
 Location    = new ( require('../models/location').provider)();
 Inventory   = new ( require('../models/inventory').provider)();

/* Model Class
--------------------------- */
provider = function(){

 
  this.getAll = function(account,data,callback){      
      var max    = data.rows;
      var today = new Date();
      //console.log(typeof(data.select));
      if (typeof(data.select) != 'undefined') {
        //code
        Art.find({account : account, from : {'$gt' : today}},{_id: 1 ,versions: 1, name : 1}).sort({'from': -1,'to':-1}).exec(function(err, docs){
         if (err) {
            callback({code:100,msg:'Error',data:err});
            return true;
         }else{
            //console.log(docs);
            callback({code : 0,msg : 'ok', data: docs});
         }
        });
      }else{
        Art.find({account:account}).sort({'from': -1,'to':-1}).skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
           //console.log(err || docs)
             if(err){
               callback({code:100,msg:'Error',data:err});
               return true;
             }
             Art.count({account:account}).exec(function(e,rows){             
               var pages = Math.ceil( rows / max );             
               callback({code:0,msg:'Data is ready',data:docs,pages:{current:data.page,total:pages,rows:rows}});
             });        
         });  
      }
  }
  
  this.delete = function(id, callback){
      Inventory.getAllByArt(id, function(response){
         if (response.code == 101) {
            Art.remove({_id : id}).exec(function(error, doc){
               if (error) {
                  callback({code: 100, msg : 'Error en el server'});
               }else{
                  callback({code: 0, msg : 'Delete ok'});
               }
            });
         }else{
            if (response.code == 0) {
               callback({code : 101 , msg : 'Ya hay sitios con este arte, por lo tanto no es posible elimnarlo'});
            }else{
               callback(response);
            }
         }
      });
  }

   this.save = function(data,account,callback){
      var that = this;
      
      data.from = that.formatDate(data.from);
      data.to = that.formatDate(data.to);
      switch (data.status) {
         case 'create':
            delete data._id;
            var response = new Art(data);
            response.account = account;
            response.save(function(error,doc){
               if (error) {
                 console.log(error);
                 callback({code:100,msg:'Error en el server'});
               }else{
                  callback({code:0,msg:'ok, Arte agregado'});
               }
            });   
            break;
         case 'update':
            console.log('------');
            Art.findOne({_id : data._id}).exec(function(err,doc){
               if (err) {
                  callback({code:100,msg:'Error en el servidor'});
               }else{
                  doc.from = data.from;
                  doc.to = data.to;
                  doc.name = data.name;
                  doc.versions = data.versions;
                  doc.save(function(err, newDoc){
                     if (err) {
                        callback({code:100, msg :'Error al actualizar'});
                     }else{
                        callback({code:0, msg:'Arte actualizado'});
                     }
                  });
               }
            });
            break;
      }
   }
   this.loadById = function(data, callback){
      Art.findOne({_id : data._id}, function(err,doc){
         if (err) {
            callback({code:100,msg:'Error interno'});
            console.log(err);
         }else{
            if (data.version) {
               doc.content = data.version;
            }
            callback({code:0, msg:'ok', art: doc});
         }
      });
   }



   this.formatDate = function (date){
      var dateTemp = date.split('-');

      return new Date(dateTemp[2],dateTemp[1]-1,dateTemp[0]);
   }

};

exports.provider = provider;


