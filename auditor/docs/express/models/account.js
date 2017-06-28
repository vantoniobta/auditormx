var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  config     = require('../emailConfig'),
  model      = require('../Schemas');

var Schema  = mongoose.Schema
 , salt     = 'mySaltyString'
 , SHA2     = new (require('jshashes/hashes').SHA512)()
 , ObjectId = Schema.ObjectId
 , User     = model.User
 , Status   = model.Status
 , Location = model.Location
 , Account  = model.Account;

function encodePassword( pass ){
  return SHA2.b64_hmac(pass, salt );
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

function trim (myString)
{
  return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
}
/* Model Class
--------------------------- */
provider = function(){ 
   

  this.exist = function(email,callback){
      Account.find({'users.email':email },function(e,r){    
          if(r.length == 0 ){
            callback(true);
          }else{
            callback(false);
          }
      });
  }

  this.sendEmail = function (data,textMail,textSubject,callback){
    var email   = require("emailjs/email");
    var server  = email.server.connect({
      user: config.user,
      password:config.password,
      host:config.host
    });
    
    var message = {
       text: " "+textMail+" ",
       from:    "contacto@iclicauditor.com",
       to:      data.email,
       cc:      "",
       subject:  textSubject+", " + data.name,
       attachment: 
       [
          {data: textMail, alternative:true}
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


  this.create  = function(host,port,params,callback){

    var that     = this;
    var theToken = getHash(16);
    var theKey   = getHash(32);    
    var theId    = getHash(16);  
    Account.find({'users.email':params.email},function(e,r){          
          if(r.length == 0 ){
              var data = {
                    name     :params.name
                   ,avl      :5
                   ,counter  :0
                   ,billing  :0
                   ,phone    :params.phone                 
                   ,key      :theKey
                   ,token    :theToken
                   ,type     :1
              };

              var user = {
                    name     :params.name
                   ,email    :params.email
                   ,password :params.password
                   ,role     :params.role
                   ,lang     :'es'
                   ,status   :0
              }
              that.new(data, function(a){                           
                 that.addUser(a.data._id,user,function(resp){
                    that.sendEmail({key:resp.key,email:user.email,name:user.name});
                 });             
            });
          }else{
             callback({code:100,msg:'user already exists'}); 
          }
      });      
 }

  /* New
  -------------------------------------------- */
  this.new = function(data,callback){
    var response  = new Account(data);
        response.save(function(error,doc){
            if(error){
              callback({code:100,data:error}); 
            }
            callback({code:0,data:doc});  
        });
  }

  /* addUser
  -------------------------------------------- */
  this.addUser = function(account,user,callback){
    var that   = this;   
    
    if(typeof(user.password) == 'undefined'){
      var pass       = getHash(8);
      user.password  = encodePassword(pass);
    }else{
      var pass       = user.password;
      user.password  = encodePassword(user.password);
    }
    
    if (user.supplier) {
      user.order = 1;
    }
    //adding the key to object
    user.key   = getHash(12);
    Account.findOne({_id:account},function(err, account){
        account.users.push( user );
        account.save(function (e) {
          if (!e){                                    
            callback({code:0,msg:'Signup is ok',key:user.key,email:user.email,name:user.name,password:pass});                        
          }else{
            callback({code:100,msg:'Database error',data:e});
          }
        });
    });
  }

  this.loadAccount = function(id,callback){
    Account.findOne({_id:id}).exec(function(error,doc){
      callback({code:0,msg:'Find ok',data:doc});
    });
  }

  this.updateFirstman = function(a,u,callback){

    var that      = this;
    Account.findOne({_id:a}).exec(function(error,docs){  
        var users = docs.users;
        var max   = users.length;
        var doc   = docs.users.id(u._id);
        var index = docs.users.indexOf(doc)        

        if(doc){

          //update document data
          doc.phone = u.phone;
          doc.email = u.email;
          doc.name  = u.name;
          //update the document
          docs.users[index] = doc;

           docs.save(function(e) {                  
                  callback({code:0,msg:'Update ok',data:e});
           });

        }else{

            //new document data         
            var user = {
              name     :u.name
             ,email    :u.email  
             ,phone    :u.phone                  
             ,role     :'supplier'
             ,lang     :'es'
             ,supplier :u.supplier
             ,order    :1
             ,status   :1
            };

            docs.users.push(user);

            that.addUser(a,user,function(){              
                 //save the document
                docs.save(function(e) {                  
                  callback({code:0,msg:'Update ok',data:e});
                });
            });

        }
        
       
    });
  }

  this.loadFirstman = function(a,s,callback){
    Account.findOne({_id:a},'users').exec(function(error,docs){        
        if(docs){
            var users = docs.users;
            var max   = users.length;
            for(i=0; i < max; i++){
                var row = users[i];           
                if( typeof(row.supplier) != 'undefined' ||  row.supplier != '' )
                  if(row.order == 1 && row.supplier == s && row.role == 'supplier'){
                    callback({code:0,msg:'Find ok',data:row});
                    return;
                  } 
            }
            //if not response anyway
            callback({code:101,msg:'No Assesor data',data:{}});
          }else{
            callback({code:101,msg:'Find ok',data:{}});
          }      
    });
  }
  
  this.loadByToken = function(token, callback){   
    Account.findOne({'users.token':token},function(err,account){     
      if (err) {
       callback({code:100,msg:'Error interno'})
      }else{
       if (account) {         
         var userIndex = 0;
         for(x=0; x<account.users.length;x++){
            if(typeof(account.users[x].token) != 'undefined'){
               if(token == account.users[x].token){
                 userIndex = x;               
                  var user = account.users[userIndex];
                  callback({code:0,user:user});
               }
           }    
         }
       }else{
         callback({code:101,msg:'token no valido'});
       }
      }
    });
  }


  this.saveAccount = function(data,callback){
    switch(data.status){
      case 'update':
        Account.update({_id:data._id},{$set:data.account}).exec(function(error,resp){
            if(error){
              callback({code:100,msg:'Error',data:error}); 
            }else{
              Account.findOne({_id:data._id}).exec(function(error,doc){
                  callback({code:0,msg:'Updating ok',data:doc});
                });
            }
        });
      }    
  }

  this.loadActiveUserFromAcount = function(auth,callback){
      Account.findOne({'users.email': auth.email, 'users.password':auth.password,'users.status':0} ,function(err, doc) {            
      if(err){
        callback({code:100,msg:'something was wrong',data:doc});
      }else{
        callback({code:0,msg:'User was found',data:doc});
      }
    });
  }  

  this.loadActiveUser = function(auth,callback){
    Account.findOne({'users.email': auth.user_email} ,function(err, account) {            
      if(err){
        callback({code:100,msg:'something was wrong',data:account});
      }else{
        if(account !== null){
          var userIndex = 0;
          for(x=0; x<account.users.length;x++){
            if(auth.user_email == account.users[x].email)
            {
              userIndex = x;
              break;
            }
          }

          if (account.users[userIndex].password == encodePassword(auth.user_password) && account.users[userIndex].status == 1) {
            callback({code:0,msg:'User was found',data:account});            
          }else{
            callback({code:100,msg:'Tu email esta registrado, pero tu contraseña no es valida',data:null});
          }
          //callback({code:0,msg:'ok',data: account.users[userIndex]}); 
        }else{
          callback({code:100,msg:'No User Found with these creadentials try again',data: null});
        }
        //callback({code:0,msg:'User was found',data:doc});            
      }
    });
  }

  this.loadAccountByUser = function(id,callback){
      Account.findOne({'users._id':id,'users.status':1} ,function(err, doc) {            
      if(err){        
        callback({code:100,msg:'something was wrong',data:doc});
      }else{
        callback({code:0,msg:'User was found',data:doc});            
      }
    });

  }

  this.billing = function(user,cb){
    Account.findOne({'users._id':user}, function (err, doc) {
      if (!err){
        var newcount = doc.count + 1;  
        var nwavl    = doc.avl - 1;                             
        doc.avl      = nwavl;
        doc.count    = newcount;
        doc.save(cb);
      }
    });
  }

  this.loadStatus = function(id,callback){

    Account.findOne({_id:id},'status',function(err, doc) {            
      if(err){        
        callback({code:100,msg:'something was wrong',data:doc});
      }else{
        callback({code:0,msg:'User was found',data:doc});            
      }
    });
  }


    this.tempCreateAccount = function(p,callback){
     
        var theToken = getHash(12);
        var theKey   = getHash(12);

        //añadimos el key al user object
        p.key = theKey;

        Account.create({
              name     :'Erick Fernando Santiago Soto'
             ,rfc      :'SASE'
             ,address  :'Guipuzcoa 36'
             ,website  :''
             ,phone    :''
             ,city     :'Ciudad de México'
             ,state    :'Distrito Federal'
             ,country  :'Mexico'
             ,key      :theKey
             ,token    :theToken
             ,type     :'1'
          },function(e,a){             
            Account.findOne({_id:a._id},function(err, account){
                p.password = encodePassword(p.password);
                account.users.push( p );
                account.save(function (err,b) {
                if (!err){
                  callback(b);
                }else{
                 callback(err);
                }
            });   
          });
        });
   }
  /*Method for API mobil
  ==========================================================*/
  this.loadKey = function(key,callback){
    var theToken = getHash(12);
    Account.findOne({'users.key':key}, function(err,account){
      if (err) {  
        callback({code:100,msg:'Este key no existe o no esta escrito correctamente'});
      }else{
        if(account !== null){
          var userIndex = 0;
          for(x=0; x<account.users.length;x++){
            if(key == account.users[x].key)
            {
              userIndex = x;
              break;
            }
          }
          if (account.users[userIndex].token == undefined || account.users[userIndex].token == null) {
            account.users[userIndex].token = theToken;
          }
          //account.users[userIndex].token = theToken;
          account.save(function(err,user){
            if (err) {
              callback({code:100,msg:'error al guardar el token'});
            }else{
              callback({code:0,msg:'ok',token: user.users[userIndex].token, role: user.users[userIndex].role})
            }
          }); 
        }else{
          callback({code:100,msg:'Este key no existe o no esta escrito correctamente'});
        }
      }
    });
  }
  
  this.loadToken = function(data, callback){
    Account.findOne({'users.token':data.token},function(err,account){
      if (err) {
        callback({code:100,msg:'Error interno'})
      }else{
        if (account !== null) {
          
          var userIndex = 0;
          for(x=0; x<account.users.length;x++){
            if(data.token == account.users[x].token)
            {
              userIndex = x;
              break;
            }
          }
          var userDoc = account.users[userIndex];          
          Location.findOne({code:trim(data.locCode)}, function(err,location){
            if (err) {
              callback({code:100,msg:'Error interno DB failed in Location Collection'});
            }else{
              console.log('--'+typeof(data.locCode));
              console.log(location);
              if (location !== null) {
               if (userDoc.role === 'supplier') {
                 location.coords = { lat: data.latitud,
                                     lng: data.longitud
                                   };
                location.date = data.timestamp;
                 location.save(function(err,location){
                     if (err) {
                      console.log(err);
                      callback({code:100,msg:'Error interno DB failed Saving in Location Collection'});
                     }else{
                       callback({code:0,msg:'ok',id:location._id});
                     }
                 });                  
               }else{
                 if (userDoc.role === 'auditor' ) {
                   Status.create({
                   location : location._id,
                   supplier : location.supplier,
                   coords   : ({lat: data.latitud,lng : data.longitud}),
                   users    : userDoc,
                   status   : data.status,
                   description : data.description,
                   date     : data.timestamp,
                   code     : data.locCode
                   }, function(error, doc){
                     if (err) {
                       console.log(err);
                       callback({code:100,msg:'Error interno DB failed in Status Collection'});
                     }else{
                       callback({code:0,msg:'ok',id: doc._id});
                     }
                   });
                 }else{
                   callback({code:100, msg: 'Permisos de usuario insuficientes'});
                 }
               }
              }else{
               callback({code:102,msg:'Código de publicación no encontrado'});
              }
            }
          });
        }else{
          callback({code:101,msg:'token no valido'});
        }
      }
    });
  }
  /*End method for API mobil
  ======================================================================*/
  this.getAllUsers = function(account,data,callback){
    var that   = this;
    var max    = data.rows;
    if ( typeof(data.rows) == 'undefined' ) {
      Account.find({_id:account}, function(err,docs){
         if (err) {
            callback({code:100,msg:'Error en la ocnsulta'});
         }else{
            callback({code:0, msg: 'ok', data: docs});
         }
      });
    }else{        
      //.sort('-_id').sort('-_id').skip().limit(max)
      Account.findOne({_id:account}).exec(function(err,docs){
          if(err){
            callback({code:100,msg:'Error',data:err});
            return true;
          }
          var rows  = docs.users.length;
          var pages = Math.ceil( rows / max ); 

          var skip   = max * (data.page - 1);
          var limit  = skip + parseInt( max ); 
          var rowset = new Array();

            // console.log(skip +' -- '+ limit);
            for(i = skip; i < limit; i++){

              if( docs.users[i]){
                rowset.push( docs.users[i] );
              }
            }

            console.log( rowset );
          callback({code:0,msg:'Data is ready',data:rowset,pages:{current:data.page,total:pages,rows:rows }});          
      });
    }

    // Account.findOne({_id:account},function(err,doc){
    //   if(!err){
    //       callback({code:0,data:doc.users});            
    //   }
    //   else{
    //     callback({code:100,data:err});
    //   }
    // });
  }
  
  this.loadUser = function(user,callback){
    Account.findOne({'users._id':user}, function(err,account){
      if (err) {
        //code  
        callback({code:100,msg:'Este key no existe o no esta escrito correctamente'});
      }else{
        if(account !== null){
          var userIndex = 0;
          for(x=0; x<account.users.length;x++){
            if(user == account.users[x]._id)
            {
              userIndex = x;
              break;
            }
          }
          callback({code:0,msg:'ok',data: account.users[userIndex]}); 
        }else{
          callback({code:100,msg:'error'});
        }
      }
    });
  }
  
  this.loadUserEmail = function(email,host,callback){
    
    var that = this;
    Account.findOne({'users.email':email}, function(err,docs){
      if (err) {
        //code  
        callback({code:100,msg:'Este email no esta registrado en el sistema'});
      }else{
        if(docs !== null){
          var userIndex = 0;
          var users = docs.users;
          var max   = users.length;
          //var index = docs.users.indexOf(doc)
          
          for(x=0; x<docs.users.length;x++){
            if(email == docs.users[x].email)
            {
              userIndex = x;
              break;
            }
          }
          var doc   = docs.users[userIndex];
          doc.status = 0;
          doc.password = getHash(16);
          text = '<b>Tu cuenta en iClic Auditor ha sido desactivada porque solicitates la recuperación de tu contaseña:'
                  +'</b><br/><br/><a href="'+host+'/login/recovery/new/?key='+doc.password+'&code='+doc._id+'">Resetear contraseña</a>'
                  +'<br/><br/> Podras cambiar la contraseña una vez des clic en el link.';
          
          docs.users[userIndex] = doc;
          docs.save(function(e) {                
            that.sendEmail(doc,text,'Recuperación de contraseña',function(response){
              console.log(response);
              if(response.code == 0 ){
                callback({code:response.code,msg:'Un email ha sido enviado a su cuenta para recuperar su contraseña'});
              }else{
                callback({code:response.code,msg:response.msg});
              }
            });
          });
          
          //callback({code:0,msg:'ok',data: account.users[userIndex]}); 
        }else{
          callback({code:100,msg:'Este email no esta registrado en el sistema'});
        }
      }
    });
  }
  
  /*@save
 ------------------------------------------*/
  this.save = function(account,data,callback){

      var that   = this;
      var userData = data;
      var text = "";
      
    switch(data.status){  
        case 'create':
          that.addUser(account,data.user,function(data){
              if(data.code == 0 ){
                //console.log(userData.user.role);
                if (userData.user.role != 'supplier') {
                  text = "<b>Tu cuenta en iClic Auditor ha sido creada."
                          +"</b><br/><br/><b>UserName:</b> " + data.name + 
                          "<br/><b>Email:</b> " + data.email + 
                          "<br/><b>Password:</b> "+ data.password +                 
                          "<br/><br/> Podras cambiar la contraseña una vez ingreses al sistema.";
                }else{
                  text = "<b>Tu cuenta de Proveedor en iClic Auditor ha sido creada."
                          +"</b><br/><br/><b>UserName:</b> " + data.name + 
                          "<br/><b>Email:</b> " + data.email + 
                          "<br/><b>Password:</b> "+ data.password +
                          "<br><a href='https://play.google.com/store/apps/details?id=com.iclic.proyectos.sicp'>Descargar aplicación móvil aquí</a><p/>"+
                          "Para ver las instrucciones de uso de la aplicación móvil y web, da click al siguiente link <a href='iclicauditor.com/uploads/iclicauditor.pdf'>Tutorial de uso</a>"+
                          "<br/><br/> Podras cambiar la contraseña una vez ingreses al sistema, y empezar a subir los sitios que ofreces a la empresa que te contrato.<p/>"+
                          "";
                }
                
                that.sendEmail(data,text,'Tu cuenta en IClic Auditor ha sido creada',function(response){
                  if(response.code == 0 ){
                    callback({code:response.code,msg:'Proveedor agregado'});
                  }else{
                    callback({code:response.code,msg:response.msg});
                  }
                });
              }else{
                callback({code:100,msg:'error'});
              }
          });
        //callback({code:0,msg:'ok',user : data});
      
      break;
      case 'update':   

        Account.findOne({_id:account}).exec(function(error,docs){  
          var users = docs.users;
          var max   = users.length;
          var doc   = docs.users.id(data._id);
          var index = docs.users.indexOf(doc)        

          if (data.user.updatePass) {
            
            text = "<b>Tus datos de acceso en iClic Auditor han sido modificados:"
                    +"</b><br/><br/><b>UserName:</b> " + data.user.name + 
                    "<br/><b>Email:</b> " + doc.email + 
                    "<br/><b>Password:</b> "+ data.user.password +                 
                    "";
            
            doc.password = encodePassword(data.user.password);
          }
          if (data.user.supplier) {
            doc.supplier = data.user.supplier;
            doc.order = 1;
          }else{
            doc.supplier = null;
            doc.order = 0;
          }
          data.user.email = doc.email;
          doc.name  = data.user.name;
          doc.role  = data.user.role;
          doc.status = data.user.status;
          docs.users[index] = doc;
          docs.save(function(e) {
            if (data.user.updatePass) {
                that.sendEmail(data.user,text,'Tu cuenta en IClic Auditor ha sido modificada',function(response){
                if(response.code == 0 ){
                  callback({code:response.code,msg:'Update ok email'});
                }else{
                  callback({code:0,msg:'Update ok',data:e});
                }
              }); 
            }else{
              callback({code:0,msg:'Update ok',data:e});
            }
          });     
        }); 
      break;

    }
  }
  
  this.deleteUser = function (account,user,callback){

    Account.findOne({_id:account}).exec(function(error,docs){       
      docs.users.id(user._id).remove();
      docs.save(function(err,docs){
       console.log(err,docs);
        callback({code:0,msg:'Delete of user ok',data:docs});
      });
    });
  }

  this.deleteUsersBySupplier = function(account,supplier, callback){

    var that = this;
    Account.findOne({_id:account}).exec(function(error,doc){
      if (error) {
        callback({code:100,msg:'Server error'});
      }else{
       var users    = doc.users;
       var max      = users.length;
       var newusers = [];
       console.log('-------------------------', users.length);       
        for(i=0; i < max; i++){
          if ( typeof(users[i]) == 'undefined' ||  typeof( users[i].supplier )  != 'undefined') {                            
              if( users[i].supplier != supplier.toString() ){                  
                  newusers.push(users[i]);
              }
          }else{
              newusers.push(users[i]);
          }
        }
        
        doc.users = newusers;
        doc.save(function(e,s){
            console.log(e || s); 
            if(!e){
              callback({code:0,msg:'delete ok fuuuuuuuuuuuuuuuuuck!!  dammit :D'})
            }
        })
      }
    });
  }
  
  this.searchKeyRecovery = function(key,code,callback){

    Account.findOne({'users._id':code}, function(err,docs){
      if (err) {
        callback({code:100,msg:'Error'});
      }else{
        if(docs !== null){
          
          var users = docs.users;
          var max   = users.length;
          var doc   = docs.users.id(code);
          var index = docs.users.indexOf(doc);
          console.log(key);
          console.log(doc.password)
          if (key == doc.password) {
            callback({code:0,msg:'ok',data: doc});            
          }else{
            callback({code:100,msg:'Error de validacion de claves'});
          }
        }else{
          callback({code:100,msg:'Error de validacion de claves'});
        }
      }
    });
  }
  
  this.newPassword = function(data,host,callback){
    
    var that = this;
    Account.findOne({'users._id':data.code}, function(err,docs){
      if (err) {
        //code  
        callback({code:100,msg:'Error en el server'});
      }else{
        if(docs !== null){
          
          var users = docs.users;
          var max   = users.length;
          var doc   = docs.users.id(data.code);
          var index = docs.users.indexOf(doc);
          
          doc.status = 1;
          doc.password = encodePassword(data.user.password);
          text = '<b>Tu cuenta en iClic Auditor se encuentra nuevamente activa:'
                +"</b><br/><br/><b>UserName:</b> " + doc.name + 
                "<br/><b>Email:</b> " + doc.email + 
                "<br/><b>Password:</b> "+ data.user.password;
        
          docs.users[index] = doc;
          docs.save(function(e) {                
            that.sendEmail(doc,text,'Tu cuenta en IClic Auditor ha sido modificada',function(response){
              console.log(response);
              if(response.code == 0 ){
                callback({code:response.code,msg:'Contraseña cambiada de manera satisfactoria, te hemos enviado un email con tus datos de acceso'});
              }else{
                callback({code:response.code,msg:response.msg});
              }
            });
          });                      

        }else{
          callback({code:100,msg:'Error de validacion de claves'});
        }
      }
    });
  }

};

exports.provider = provider;


