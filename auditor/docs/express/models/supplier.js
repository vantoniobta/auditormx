var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  config     = require('../emailConfig'),
  model      = require('../Schemas');

var Schema  = mongoose.Schema
 , salt     = 'mySaltyString'
 , SHA2     = new (require('jshashes').SHA512)()
 , ObjectId = Schema.ObjectId
 , User     = model.User
 , Account  = model.Account
 , Log      = model.Log
 , Supplier = model.Supplier;

/* Conect with Database
-------------------------------------- */ 

Account      = new ( require('../models/account').provider)();
Location      = new ( require('../models/location').provider)();
Inventory      = new ( require('../models/inventory').provider)();


/* Model Class
--------------------------- */
provider = function(){

 /*@getAll
 ------------------------------------------*/
  this.getAll = function(account,data,callback){
      
    //max rows
    var max    = data.rows;
    var condition = {account : account};
    if (typeof(data.keyword) != 'undefined') {
      switch (data.condition) {
        case 'name' :
           condition.name = {$regex : data.keyword , $options : 'i'};
           break;
        case 'rfc' :
           condition.rfc = {$regex : data.keyword, $options : 'i'};
           break;
        default : ;
      }
    }
    
    if (data.noMaxRow) {
      Supplier.find({account : account}, function(err,docs){
         if (err) {
            callback({code:100,msg:'Error en la ocnsulta'});
         }else{
            callback({code:0, msg: 'ok', data: docs});
         }
      });
    }else{
      if(typeof(data.keyword) != 'undefined'){
         console.log(condition);
         Supplier.find(condition).sort('-_id').sort('-_id').skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
            if(err){
              callback({code:100,msg:'Error',data:err});
            }
              Supplier.count({account:account}).exec(function(e,rows){             
                var pages = Math.ceil( rows / max );             
                callback({code:0,msg:'Data is ready',data:docs,pages:{current:data.page,total:pages,rows:rows}});
              });        
         });
      }else{
         Supplier.find(condition).sort('-_id').sort('-_id').skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
            if(err){
              callback({code:100,msg:'Error',data:err});
            }
              Supplier.count({account:account}).exec(function(e,rows){             
                var pages = Math.ceil( rows / max );             
                callback({code:0,msg:'Data is ready',data:docs,pages:{current:data.page,total:pages,rows:rows}});
              });        
         });
      }
    }
  }

  this.getAllCount = function(id,callback){
    Supplier.count({account:id}, function(err,count){
      if(err){
        console.log(err);
        callback({code:100,count:0});
      }
      else{
        console.log(count);
        callback({code:0,count:count});
      }
    });
  }

  /*@load
 ------------------------------------------*/
  this.load = function(id,callback){
     Supplier.findOne({_id:id}).exec(function(error,doc){
        Account.loadFirstman(doc.account,id,function(r){
            callback({code:0,msg:'Find ok',data:doc,user:r.data});
        });
       
    });
  }

 /*@save
 ------------------------------------------*/
  this.save = function(account,data,callback){

      var that   = this;
      data.supplier.account = account;   
 
    switch(data.status){  
        case 'create':
        var response  = new Supplier(data.supplier);      
            response.save(function(error,doc){
              if(error){
                callback({code:100,msg:'Error',data:error});
              }else{
                  var user = {
                    name     :data.supplier.assessor_name
                   ,email    :data.supplier.assessor_email  
                   ,phone    :data.supplier.assessor_phone                  
                   ,role     :'supplier'
                   ,lang     :'es'
                   ,supplier :doc._id
                   ,order    :0
                   ,status   :1
                  }                  
                  Account.addUser(account,user,function(data){                      
                      if(data.code == 0 ){
                        callback({code:0,msg:'Proveedor agregado'});                                                      
                        that.sendEmail(data,function(response){});
                      }else{
                        callback({code:100,msg:response.msg});
                      }
                  });
              }
            });

      break;
      case 'update':   

      console.log( data._id);

       var user = {
            _id      :data.supplier.assessor_id
           ,name     :data.supplier.assessor_name
           ,email    :data.supplier.assessor_email  
           ,phone    :data.supplier.assessor_phone                
           ,role     :'supplier'
           ,lang     :'es'
           ,supplier :data._id
           ,order    :0
           ,status   :1           
          }

        //console.log(user);
        //console.log('---------------------------');
        //console.log(data.supplier);
        Supplier.update({ _id:data._id }, { $set: data.supplier }).exec(function(error,resp){
          if(error){
            callback({code:100,msg:'There was an Error',data:error});
          }else{
            Account.updateFirstman(account,user,function(e,d){
               callback({code:0,msg:'Updating ok',data:resp});
            });
          }
        });
      break;

    }
  }

/*@sendEmail: email notification 
------------------------------------------*/
this.sendEmail = function (data,callback){

    var email   = require("emailjs/email");
    var server  = email.server.connect({
      user: config.user,
      password:config.password,
      host:config.host,
      ssl: config.ssl
    });
    var message = {
       text:     "<b>Tu cuenta de Proveedor en iClic Auditor ha sido creada."
                +"</b><br/><br/><b>UserName:</b> " + data.name + 
                "<br/><b>Email:</b> " + data.email + 
                "<br/><b>Password:</b> "+ data.password +                 
                "<br/><br/> Podras cambiar la contraseña una vez ingreses al sistema, y empezar a subir los sitios que ofreces a la empresa que te contrato.",
       from:    "contacto@iclicauditor.com",
       to:      data.email,
       cc:      "",
       subject:  "Tu cuenta de Proveedor en IClic Auditor ha sido creada, " + data.name,
       attachment: 
       [
          {data: "<b>Tu cuenta en la Plataforma Administración y Auditoria de de Publicidad (iClic Auditor) ha sido creada."
                +"</b><br/><br/><b>UserName:</b> " + data.name + 
                "<br/><b>Email:</b> " + data.email + 
                "<br/><b>Password:</b> "+ data.password + 
                "<br/><br/> Podras cambiar la contraseña una vez ingreses al sistema, y empezar a subir los sitios que ofreces a la empresa que te contrato.", alternative:true}
       ]
    };
    server.send(message, function(err, message) {
        console.log(err || message);
        if(!err){
            callback({code:0,msg:message,data:data});
        }else{
            callback({code:100,msg:err,data:data});
        }        
    });

 }

  /*@delete
 ------------------------------------------*/
  this.delete = function(id,account,callback){
    Supplier.findOne({ _id:id }).exec(function(error,doc){ 
      if (error) {
         callback({code:100,msg:'erro en el server'})
      }else{
         var data = {supplier : doc._id};
         Inventory.getAllBySupplier(data, account, function(response) {
            //console.log(response.code);
            //console.log('-----');
            if (response.code == 101) {
               Location.deleteBySupplier(doc._id, function(responseLoc){
                  if(responseLoc.code == 0){   
                     Account.deleteUsersBySupplier(doc.account,doc._id,function(responseAcc){
                        if (responseAcc.code == 0) {
                           Supplier.remove({ _id:id }).exec(function(error,doc){ 
                             callback({code:0,msg:'Delete of user ok',data:doc});
                           });               
                        }else{
                           callback(response);
                        }
                     });
                  }else{
                     callback(responseLoc);
                  }
               });
            }else{
               if (response.code == 0) {
                  callback({code : 101 , msg : 'Este proveedor ya esta contratado y no es posible borrarlo'});
               }else{
                  callback(response);
               }
            }
         });
      }
    });
  }
};

exports.provider = provider;


