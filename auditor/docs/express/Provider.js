var mongoose = require('mongoose')

var Schema = mongoose.Schema
 , salt = 'mySaltyString'
 , SHA2 = new (require('jshashes').SHA512)()
 , crypto = require('crypto')
 , Hashes = require('jshashes')
 , ObjectId = Schema.ObjectId;

function encodePassword( pass ){  
  return SHA2.b64_hmac(pass, salt )
}

function getHash(n){
  return crypto.randomBytes(n).toString('hex');
}

/* Schemas
-------------------------- */

var Users = new Schema({
   name     :{ type: String, required: true }
  ,email    :{ type: String, required: false }
  ,password :{ type: String, required: true, set: encodePassword   }
  ,lang     :{ type: String, default:'es' } //en|es
  ,status   :{ type: Number, default: 0 }
  ,type     :[{ type: ObjectId, ref: 'Accounts', required: true }]
  ,created  :{ type: Date, required: true, default: Date.now }
  ,state    :{ type: String, default:'' }
  ,website  :{ type: String, default:'' }
});

var Suppliers = new Schema({
   name     :{ type: String, required: true }
  ,address  :{ type: String, required: true }
  ,phone    :{ type: String }
  ,email    :{ type: String }
  ,user     :[{ type: ObjectId, ref: 'Users', required: true }]
});

var Accounts = new Schema({
    type :{ type: String, required: true }
});

var User            = mongoose.model('Users',Users);
var Supplier        = mongoose.model('Suppliers',Suppliers  );
var Account         = mongoose.model('Accounts',Accounts);
// var Invoice          = mongoose.model('Invoices',Invoices);


/* Model Class
--------------------------- */
Provider = function(){

  this.checkEmail = function(data,callback){
    validate(data.email, data.password, true, function(err,exists) {
      if (err) {
        callback({code:100,msg:"Error verificando email",data:err});
      }
      callback({code:0,msg:"verificado",count:exists});
    });
  }

   this.createUser = function(callback){
      var response  = new User({name:'Sarai Leon',email:'sleon90@gmail.com',password:'casa'
        ,status: '1', type: 'user',created:new Date(), state:'Tabasco', website:'http://eldojo.org'});
      // var response  = new User({name:'Leyvi',email:'leyvicaz@gmail.com',password:'casa'
        // ,status: '1', type:'51367f4b062ce84595000001',created:new Date(), state:'Tabasco', website:'http://eldojo.org'});
      // var response  = new User({name:'Sarai Leon',email:'sleon90@gmail.com',password:'casa'
        // ,status: '1', type: '51367f356f136aee94000001',created:new Date(), state:'Tabasco', website:'http://eldojo.org'});
      var response  = new User({name:'Leyvi',email:'leyvicaz@gmail.com',password:'casa'
        ,status: '1', type:'51367f4b062ce84595000001',created:new Date(), state:'Tabasco', website:'http://eldojo.org'});
          response.save(function(error,doc){
             callback(error,{code:0,msg:'Saving ok'});
          });
   }

   this.createType = function(callback){
      var response  = new Account({type:'Proveedor'});
          response.save(function(error,doc){
             callback(error,{code:0,msg:'Saving ok'});
          });
   }

  this.updateAccount = function(callback){
     Account.update({ _id:'511e981b994e06fae4000001'}, { $set: { type: 'never' }}).exec(function(error,resp){
        callback(error,{code:0,msg:'Updating ok'});
      });
  }

  this.AllSuppliers = function(callback){
    Supplier.find({ user:ObjectId('51422c5fa6adf12408000001') }).sort('-_id').exec(function(err,docs){
        if(err){
          callback({code:100,msg:'Error',data:err});
        }
        callback({code:0,msg:'Data is ready',data:docs});
    });
  }

  this.saveSupplier = function(data,callback){

    var that   = this;
    switch(data.status){
      case 'create':
        console.log('create');
        data.supplier.user  = ObjectId('51422c5fa6adf12408000001');
        var response  = new Supplier(data.supplier);
        User.findOne({email: data.supplier.email}, function(err, result) {
          if (err) { 
            console.log('err');
          }
          if (result) {
            console.log('result');
            callback({code:100,msg:'Ese Usuario/Proveedor ya existe',data:result});
          } else {
            console.log('fuck');
            response.save(function(error,dc){
              if(error){
                callback({code:100,msg:'Error',data:error}); 
              }else{
                Account.findOne({'type': 'Proveedor'} ,function(err, doc) {
                  if (err){
                    callback({code:100,msg:'Error Type',data:err});
                  }else{
                    var thePass = getHash(16);
                    var saveUser = new User({
                         name     : data.supplier.name
                        ,email    : data.supplier.email
                        ,password : thePass
                        ,lang     : 'es'
                        ,status   : '1'
                        ,type     : doc._id
                        ,created  : new Date()
                        ,state    : ''
                        ,website  : ''
                    });
                    saveUser.save(function(er,d){
                      if(er){
                        callback({code:100,msg:'Error',data:er});
                      }
                      callback({code:0,msg:'Saving Account',data:d, password: thePass });
                      that.confirmSupplier({email: d.email, name: d.name, pass: thePass});
                    }); 

                  }

                });                
              }
            });
          }
        });
      break;
      case 'update':
        console.log('update');
        Supplier.update({ _id:data._id }, { $set: data.supplier }).exec(function(error,resp){

          if(error){
            callback({code:100,msg:'There was an Error',data:error});
          }
          Supplier.findOne({ _id:data._id }).exec(function(error,doc){
            callback({code:50,msg:'Updating ok',data:doc});
          });

        });
      break;
    }
  }

  this.confirmSupplier = function (data){

    var email   = require("emailjs/email");
    var server  = email.server.connect({
      user:    "dojotesting@gmail.com",
      password:"pw.eldojo",
      host:    "smtp.gmail.com",
      ssl:     true
    });
    // send the message and get a callback with an error 
    // or details of the message that was sent
    server.send({
      text:     "<b>Tu cuenta en la Plataforma Administración y Auditoria de de Publicidad (iClic Auditor) ha sido creada."
                +"</b><br/><br/><b>UserName:</b> " + data.name + 
                "<br/><b>Email:</b> " + data.email + 
                "<br/><b>Password:</b> "+ data.pass + 
                "<br/><br/> Podras cambiar la contraseña una vez ingreses al sistema, y empezar a subir los sitios que ofreces a la empresa que te contrato.",
      from:     "dojotesting@gmail.com", 
      to:       "sleon90@gmail.com, dojotesting@gmail.com",
      cc:       "",
      subject:  "Tu cuenta en la Plataforma Administración y Auditoria de de Publicidad (iClic Auditor) ha sido creada, " + data.name,
      attachment: 
      [
        {
        data: "<b>Tu cuenta en la Plataforma Administración y Auditoria de de Publicidad (iClic Auditor) ha sido creada."
              +"</b><br/><br/><b>UserName:</b> " + data.name + 
              "<br/><b>Email:</b> " + data.email + 
              "<br/><b>Password:</b> "+ data.pass + 
              "<br/><br/> Podras cambiar la contraseña una vez ingreses al sistema, y empezar a subir los sitios que ofreces a la empresa que te contrato.", alternative:true
        }
      ]
    }, function(err, message) { console.log(err || message); });
  }

  this.deleteSupplier = function(data,callback){
    var id = data.split('-')[0];
    var email = data.split('-')[1];
    console.log(email);
      Supplier.remove({ _id:id }).exec(function(error,doc){
        User.remove({ email:email }).exec(function(error,doc){
          callback({code:0,msg:'Delete of user ok',data:doc});
        });
      });
  }

  this.loadSupplier = function(id,callback){
       Supplier.findOne({ _id:id }).exec(function(error,doc){
         callback({code:0,msg:'Find ok',data:doc});
      });
  }

   this.deleteCompany = function(id,callback){
       Company.remove({ _id:id }).exec(function(error,doc){
         callback({code:0,msg:'Delete ok',data:doc});
      });
  }

  this.searchCompany = function(){

  }

  this.loadActiveUser = function(auth,callback){  
      User.findOne({'email': auth.user_email,  'password':encodePassword(auth.user_password), 'status':1} ,function(err, doc) {            
        if(err){
          callback({code:100,msg:'something was wrong',data:doc});
        }else{
          Account.findById( doc.type[0] , function (error, result){
            if(error){
              callback({code:100,msg:'something was wrong',data:doc});
            }else{
              doc.typeName = result.type;
              console.log('the other type:'+ result.type);
              console.log(result.type);
              callback({code:0,msg:'User was found',data:doc, type: result.type}); 
            }
          })           
        }
      });
  }



};

exports.Provider = Provider;


