const   request    = require('request');
const   randtoken  = require('rand-token');
const   bcrypt     = require('bcrypt');
const   crypto     = require('crypto');

getIndex = function(data,id,key,tag,cb){
  for( var x in data ){
      // console.log(data[x]._id,'==', id,',',data[x]._id == id);
      // console.log('-----------------------------------');
      if(data[x][key] == id){
        data.splice(x,1);
        return cb(x,data,tag);
      }
  }
  return cb(null,data,tag);
}
module.exports = {
  index: function (req, res) {
       res.json({code:0,msg:'ok, nothing here :)'});
  },
  signup: function (req, res) {
      var data = {};
          data.name     = req.body.user_name;
          data.email    = req.body.user_email;
          data.country  = req.body.user_country;
          data.phone    = req.body.user_phone;
          data.password = bcrypt.hashSync(req.body.user_password, 10);
          data.token    = randtoken.generate(32);
          data.status   = 0;
      Users.tenant('auditor-master').create(data).exec(function(e,r){
           console.log('User was created in Master');
           console.log(e||r);
           if(e) return res.json({code:100,msg:'Something was wrong with Database trying to add user'});
          var name  = 'My First Workspace';
          var token = randtoken.generate(32);
          var key   = bcrypt.hashSync(token, 10);
          Accounts.tenant('auditor-master').create({name:name,token:token,key:key}).exec(function(e,t){
            console.log('Account was created in Tenant');
            console.log(e||t);
              if(e) return res.json({code:101,msg:'Something was wrong to trying add account'});
              Users.tenant('auditor-master').findOne(r[0]._id.toString()).exec(function(e,u){
                console.log('Find User un tenant');
                console.log(e||u);
                  if(e) return res.json({code:102,msg:'Something was wrong to trying find user'});
                  console.log('This is a tenant:',t[0]._id, typeof t[0]._id);
                  t[0]._id = t[0]._id.toString();
                  u.tenant = t;
                  u.save(function(e,user){
                    console.log('User was updated in master');
                    console.log(e||u);
                    if(e) return res.json({code:102,msg:'Something was wrong to trying save user'});
                    Email.signup(tenant.config,data.email,function(e,er){
                        return res.json({code:0,msg:'ok',user:user});
                    });
                  });
              });
          });
      });
  },
  all: function(req, res){
      var where = {}
      Users.tenant('auditor-'+req.query.tenant).find(where).exec(function(e,r){
          if (!e) {
              res.json({code:0,msg:'ok',data:r});
         }else{
              res.json({code:104,msg:'error! create user in auditor-tenant', error: e});
          }
      });
  },
  invite: function(req, res){
      //post data
      var data   = req.body.user;
      console.log(data)
      //delete id
      delete data.id;
      Users.tenant('auditor-master').findOne({email:data.email}).exec(function(e,u){
          if(u){
            var tenantid = data.tenant;
            delete data.name;
            // console.log('user already exists in master');
            Users.tenant('auditor-'+tenantid).findOne({email:data.email}).exec(function(e,r){
              if(r){
                 // console.log('user already exists in master');
                 res.json({code:101,msg:'the user exists'});
              }else{
                var tenantid = data.tenant;
                    data.key     = randtoken.generate(32);
                Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,account){
                  // console.log('updating user tenant');
                    account.role = data.role;
                    account._id  = account._id.toString();
                    Users.tenant('auditor-master').findOne({email:data.email}).exec(function(e,ur){
                      delete account.createdAt;
                      delete account.updatedAt;
                      delete account.users;
                      u.tenant.push(account)
                      u.save(function(e,us){
                        data.token = u.token;
                        Users.tenant('auditor-'+tenantid).create(data).exec(function(e,r){
                            // console.log('created user in tenant');
                            Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,a){
                                r[0]._id = r[0]._id.toString();
                                a.users.push(r[0]);
                                a.save(function(e,a){
                                    Email.invite(tenant.config,data.email,account.name,function(e,er){});
                                    return res.json({code:0,msg:'Userd added',data:r});
                                })
                                //Account save------------------------------------------------------------------
                            });
                            //Account findone------------------------------------------------------------------
                          });
                        //User create------------------------------------------------------------------
                        });
                      //User findone------------------------------------------------------------------
                    });
                    //Account findeone------------------------------------------------------------------
                });
                //Users findone------------------------------------------------------------------
              }
            });
          }else{
            // console.log('new user in master');
            var tenantid = data.tenant;
            var role     = data.role;
            //token
            data.token = randtoken.generate(32);
            data.key   = randtoken.generate(32);
            //status
            data.status   = 0;
            data.tenant   = [];
            /* Buscamos el tenant al que vamos agregar el usuario
            ------------------------------------------------------------------*/
            Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,account){
              var a = account;
              a.role = role;
              a._id  = account._id.toString();
              a.id   = account._id;
              delete a.users;
              if(typeof data.tenant == 'array'){
                data.tenant.push([a]);
              }else{
                data.tenant = [a];
              }
              delete data.role;
              delete data.users;
              /* Creamos el usuario temporal en auditor master
              ------------------------------------------------------------------*/
              Users.tenant('auditor-master').create(data).exec(function(e,u){
                delete data.tenant;
                var user    = u[0];
                /* Agregamos el usuario al tenantn
              ------------------------------------------------------------------*/
                Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,account){
                    console.log('Auditor Accounts findone');
                    console.log(e||account);
                    user.id  = user._id;
                    user._id = user._id.toString();
                    delete user.users;
                    delete user.status;
                    delete user.createdAt;
                    delete user.updatedAt;
                    if(typeof account.users == 'array'){
                        account.users.push(user);
                    }else{
                        account.users = [user];
                    }
                    account.save(function(e,a){
                        console.log('Auditor Tenantid saved');
                        console.log(e||a);
                        data.master = data._id;
                        delete u._id;
                        delete u.id;
                        delete data.id;
                        delete data._id;
                        Users.tenant('auditor-'+tenantid).create(data).exec(function(e,r){
                            console.log('Auditor Tenantid created');
                            console.log(e||r);
                            Email.signup(tenant.config,r[0].email,r[0].key,function(e,er){
                                console.log('Email sent')
                                res.json({code:0,msg:'Userd added',data:r});
                            });
                            //Send Email------------------------------------------------------------------
                        });
                        //Users create in tenant------------------------------------------------------------------
                    });
                    //Account Save------------------------------------------------------------------
                });
                //Account FindOne------------------------------------------------------------------
              });
            //Users create------------------------------------------------------------------
            });
            //Accounts findone------------------------------------------------------------------
          }
      });
  },

update: function (req, res) {
      var body = req.body.user;
      Users.tenant('auditor-master').findOne({email:body.email,tenant:body.tenant}).exec(function(e,r){
          if (!e) {
            if (r.hasOwnProperty('email') ) {

                   var data  = {};

                  if( body.hasOwnProperty('token') ){
                      data.token = body.token;
                      r.token    = body.token;
                  }

                  if( body.hasOwnProperty('name') ){
                      data.name  = body.name;
                      r.name     = body.name;
                  }

                  if( body.hasOwnProperty('password') && body.password != '' && body.password.length > 3 ){
                      data.password  = bcrypt.hashSync(body.password, 10);
                      r.password     = data.password;
                  }

                   if( body.hasOwnProperty('status') ){
                      data.status  = body.status;
                      r.status     = body.status;
                  }

                r.save(function(e,r){
                  if (!e) {
                       //---------------------------------------------------------------------------------------------
                       Users.tenant('auditor-'+body.tenant).update({email:body.email},{$set:data}).exec(function(e,r){
                        if (!e) {

                         //delete r[data.password];

                          res.json({code:0,msg:'ok',data:r});
                        }else{
                          res.json({code:103,msg:'not update in tenant!!', error:e});
                        }
                      });
                     //---------------------------------------------------------------------------------------------

                  }else{
                      res.json({code:102,msg:'not update in auditor-master!!', error:e});
                  }

                });

          }else{
            res.json({code:101,msg:'Cant find user in database', error:e});
          }
       }else{
          res.json({code:100,msg:'Cant connect with services Users in tenant', error:e});
       }
  });
},

delete:function(req, res){
     var data = req.body;
     // console.log(data.id, typeof(data.id));
      Users.tenant('auditor-'+data.tenant).findOne(data.id).exec(function(e,u) {
        if (!e){
            Users.tenant('auditor-master').findOne({email:u.email}).exec(function(e,user){
                /* Primero traigo los datos del usuario y posteriormente obtengo los datos de tenant
                   consigo el index del actual tenant comparandolo con el tenant actual en session
                   enviado via post, lo elimino tanto de la colección cómo del subdocumento del usuario
                ------------------------------------------------------ */
                getIndex(user.tenant,data.tenant,'_id','tenants',function(i,tenants){
                   user.tenant = tenants;
                   user.save(function(e,r){
                    Accounts.tenant('auditor-master').findOne(data.tenant).exec(function(e,a){
                        // console.log(a.users);
                        getIndex(a.users,user.email,'email','users',function(i,users,tag){
                            // console.log(users,tag);
                            a.users = users;
                            a.save(function(e,a){
                              Users.tenant('auditor-'+data.tenant).remove(data.id).exec(function(e,r){
                                if (!e) {
                                    res.json({code:0,msg:'ok'});
                                }else{
                                  res.json({code:103,msg:'Error! delete in auditor-tenant', error:e});
                                }
                              });
                            });
                        });
                    });
                  });
                });
              });

      }else{
        res.json({code:101,msg:'Error! delete in auditor-master', error:e});
      }
    });
 },
deleteMaster:function(req, res){
       var data = req.body;
        //console.log(data);
        Users.tenant('auditor-'+data.tenant).findOne({id:data.id}).exec(function(e,r){
          var v1  =  r.tenant;
          //console.log(v1);
          if (!e) {
            Users.tenant('auditor-master').remove(data).exec(function(e,r){
              if (!e) {
                Users.tenant('auditor-'+v1).findOne({id:data.id}).exec(function(e,r) {
                   if (!e) {
                    Users.tenant('auditor-'+v1).remove(data).exec(function(e,r){
                      if (!e) {
                        res.json({code:0,msg:'ok'});
                      }else{
                        res.json({code:103,msg:'Error! delete in auditor-tenant', error:e});
                      }
                    })
                     //res.json({code:0,msg:'ok'});
                   }else{
                    res.json({code:102,msg:'Error! not exits id auditor-tenant', error:e});
                   }
                })
                 //res.json({code:0,msg:'ok'});
              }else{
                res.json({code:101,msg:'Error! delete in auditor-master', error:e});
              }
            })
          }else{
            res.json({code:100,msg:'error! Not exits id in auditor-master :', error:e});
          }
        })
},
activate:function(req, res){
   console.log(req.body);
},

validate:function(req, res){
  var data      =  req.body;
  var name      = data.name.length;
  var password  = data.password.length;
  var key       = data.key.length;
  var tam_name  = 4,
      tam_pass  = 6,
      tam_key   = 16;
      
  //--------------------------validation--------------------------
     if (key >= tam_key) {
          if (name >= tam_name) {
                  if (password >= tam_pass) {
                    res.json({code:0,msg:'ok'});
                  }else{
                    res.json({code:102,msg:'Error! the password invalid'});
                  }
          }else{
              res.json({code:101,msg:'Error! the name invalid'});
          }
    }else{
          res.json({code:100,msg:'Error! the key invalid'});
    }
  //--------------------------------------------------------------
}

};



















