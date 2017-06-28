/**
 * UsersController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var util = require('../../utilities')
var notifications = util.notifications;

var _ = require('underscore')


updateProviders = function (user_id, providers){
	console.log('Provider: ' + providers);

	var data = {};


	User_Provider.destroy({'user_id':user_id},function(e){
		if(e) {console.log(e)};
	});

	for (key in providers){
		data.user_id = user_id;
		data.provider_id = providers[key];
		User_Provider.create(data).done(function(err, data2) {
			console.log(data2);
		});
	}

};


updateTypes = function (user_id, types){
	console.log('Provider: ' + types);

	var data = {};


	User_Type.destroy({'user_id':user_id},function(e){
		if(e) {console.log(e)};
	});

	for (key in types){
		data.user_id = user_id;
		data.type = types[key];
		User_Type.create(data).done(function(err, data2) {
			console.log(data2);
		});
	}

};


module.exports = {

  /**
   * Action blueprints:
   *    `/users/index`
   *    `/users`
   */
  index: function (req, res) {
    return res.view();
  },


	getusertypes: function(req, res){
	var id = req.query.user_id;
	res.contentType('application/json');

	User_Type.find({'user_id': id}).done(function(err,doc){
		if( doc.length > 0){
			res.json(doc);
		}else{
			res.json({'error':0,'msg':'Cant find this user id'});
		}
	});

},
getuserproviders: function(req,res){
	var id = req.query.user_id;
	res.contentType('application/json');

	User_Provider.find({'user_id': id}).done(function(err,doc){
		if( doc.length > 0){
			res.json(doc);
		}else{
			res.json({'error':0,'msg':'Cant find this user id'});
		}
	});
},


  /**
   * Action blueprints:
   *    `/users/get`
   */
  get: function (req, res) {
    var id = req.query.id;
    res.contentType('application/json');
    User.find(id).done(function(err,doc){
        if( doc.length > 0){
        res.json(doc[0]);
      }else{
        res.json({'error':0,'msg':'Cant find this user id'});
      }
    });
  },
  /**
   * Action blueprints:
   *    `/users/delete`
   */
  delete: function (req, res) {
   var id = req.body.id;
   res.contentType('application/json');
   User.destroy({id:id},function(e){
      return res.json({'code':0,'msg':'User deleted'});
   });
  },



 /**
 * Action blueprints:
 *    `/users/create`
 */
  save : function(req,res){
    var log = require('../../utilities').logs(Logs)
    var mode = req.body.modeForm;
    var data = req.body.user;
	 var user_type = req.body.user_type;
	 var user_provider = req.body.user_provider;

	 console.log('Type: ' + user_type);



    switch(mode){
      case 'update':

        if( typeof(data.password) == 'undefined'){

           User.update({id:data.id},data,function(error,user){
                  if (error) res.send(error);

			   updateProviders(data.id, user_provider);
			   updateTypes(data.id, user_type);

                  if (user){
                    if (thePassword != undefined){
                      var msg_data = {
                          subject: "IClic Auditor: Cambio de Password"
                        , text : {
                              subject: "Cambio de Password"
                            , main_message:
                                "Ha cambiado exitosamente su password: "
                            , second_message :
                                "<li> Nueva password: <b>" + thePassword + "</b> </li>"

                          }
                        , mail: data.email
                      }
                      // notifications.mail(data, template, attachment )
                      log.create('user_updated', req.session.user.id )
                      notifications.mail( msg_data, 'index.ejs', null )
                    }
                    res.send(user);
                  }
               });

        }else{
          var bcrypt = require('bcrypt');
          var thePassword = data.password
          bcrypt.hash(thePassword, 10, function(err, hash) {
              data.password = hash;

            User.update({id:data.id},data,function(error,user){
                if (error) res.send(error);
                if (user){
                  if (thePassword != undefined){
                    var msg_data = {
                        subject: "IClic Auditor: Cambio de Password"
                      , text : {
                            subject: "Cambio de Password"
                          , main_message:
                              "Ha cambiado exitosamente su password: "
                          , second_message :
                              "<li> Nueva password: <b>" + thePassword + "</b> </li>"

                        }
                      , mail: data.email
                    }
                    // notifications.mail(data, template, attachment )
                    log.create('user_updated', req.session.user.id )
                    notifications.mail( msg_data, 'index.ejs', null )
                  }
                  res.send(user);
                }
            });

          });

        }

      break;
      case 'add':
        crypto      = require('crypto');
        data.status = 1;
        data.lang   = 'es';
        data.key    = crypto.randomBytes(8).toString('hex');

        User.count({email:data.email}).done(function(ec,cc){

          console.log(cc);

            if( cc == 0 ) {

              // ----------------------------------------------------------------

              data.password = data.password || util.string.random(9);
              var thePassword = data.password;

              User.create(data).done(function(err, user) {
                // Error handling
                if (err) {
                  return res.send({code:100,msg:"User can't be created"});
                // The User was created successfully!
                } else {

                  var msg_data = {
                          subject: "IClic Auditor: Alta de Cuenta"
                        , text : {
                              subject: "Alta de Cuenta"
                            , main_message:
                                "Se ha creado un usuario y contraseña para usted, \
                                 con los siguientes datos: "
                            , second_message :
                                "<li> Usuario: <b>" + data.email + "</b> </li> \
                                 <li> Password: <b>" + thePassword + "</b> </li>"

                          }
                        , mail: data.email
                      }
                    , attachment = {
                          path: 'assets/uploads/files/CSVTempates/'
                        , type:"text/csv"
                      };

                  switch(data.role) {
                    case '5':
                      attachment.path += 'template_espectaculares.csv'
                      attachment.name = 'template_espectaculares.csv'
                      break;
                    case 'autobuses':
                      attachment.path += 'template_autobuses.csv'
                      attachment.name = 'template_autobuses.csv'
                      break;
                    case '7':
                      attachment.path += 'template_parabuses.csv'
                      attachment.name = 'template_parabuses.csv'
                      break;
                    case 'kioskos':
                      attachment.path += 'template_kioskos.csv'
                      attachment.name = 'template_kioskos.csv'
                      break;
                    case '4':
                      attachment.path += 'template_puentes.csv'
                      attachment.name = 'template_puentes.csv'
                      break;
                    case '6':
                      attachment.path += 'template_casetas.csv'
                      attachment.name = 'template_casetas.csv'
                      break;
                    case 'taxis':
                      attachment.path += 'template_taxis.csv'
                      attachment.name = 'template_taxis.csv'
                      break;
                    case 'suburbano':
                      attachment.path += 'template_suburbano.csv'
                      attachment.name = 'template_suburbano.csv'
                      break;
                    case 'metro':
                      attachment.path += 'template_metro.csv'
                      attachment.name = 'template_metro.csv'
                      break;
                    case 'cine':
                      attachment = null
                      break;
                    default:
                      attachment = null
                  }

                  log.create('user_created', req.session.user.id )
                  notifications.mail( msg_data, 'index.ejs', attachment )

                  return res.send({code:0,msg:"User created:",data:user});
                }
              });

          // ----------------------------------------------------------------
          }else{
              return res.send({code:101,msg:"Error: El email que intentas registrar ya se encuentra en la base de datos"});
          }

        })
      break;
    }
  },
  /**
   * Action blueprints:
   *    `/users/table`
   */
  table : function(req, res){
    var log = require('../../utilities').logs(Logs)
    res.contentType('application/json');
    var rows   = req.query.rows;
    var page   = req.query.page ;
    var skip   = rows * ( page - 1 );
    var where  = '';

    //variables
    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;

    if( keyword ){
      var where  = 'WHERE U.full_name LIKE "'+keyword +'%" OR U.email LIKE "'+keyword+'%"' + ' OR P.name LIKE "'+keyword+'%"' ;
    }

    var sql =  " SELECT U.*, P.name as company_name, R.code as role_name FROM user U ";
        sql += " LEFT JOIN provider P ON ( P.id = U.supplier_id)  ";
        sql += " LEFT JOIN role R ON ( R.id = U.role)  ";
        sql += where +" ORDER BY "+sortfield+" "+sortby+" LIMIT "+skip+","+rows;

    User.query(sql,function(e,docs){
       if (e) {
            return res.send({code:100,msg:'Error en la ocnsulta'});
         }else{
          User.count(function(error,counter){
            var totalpages = Math.ceil(counter / rows )
            return res.send({code:0,msg:'ok',data:docs,pages:{current_page:page,last_page:totalpages,rows:rows}});
          })
         }
    });
  },
   /**
   * Action blueprints:
   *    `/users/recover`

  recover: function (req, res) {
    var mail = req.query.mail;
    res.contentType('application/json');
    User.find( {email: mail} ).done(function(err,doc){
      if( doc.length > 0){
        var text =  "Este es una Notificación de IClic Auditor, <br> \
                     haz solicitado recuperar la password del usuario: " + doc.email + "</p> \
                     <p> Password: " + doc.password + "</p>"

              , subject =  "Recuperación de Password";

        notifications.mail(subject, text, doc.email)
        res.json(doc[0]);
      }else{
        res.json({'error':0,'msg':'Cant find this user id'});
      }
    });
  }
  */
   /**
   * Action blueprints:
   *    `/users/index`
   *    `/users`
   */
  permisions: function (req, res) {

    Permisions.query('select M.id as id, M.controller,M.name, P.module_id, P.visible from module M left join permisions P on ( P.module_id = M.id )',function(i,o){
        return res.view({permisions:o});
    });

  },
   /**
   * Action blueprints:
   *    `/users/index`
   *    `/users`
   */
  getroles: function (req, res) {

    var id = req.query.id;
    Permisions.find({role_id:id}).done(function(i,o){
        return res.json(o);
    });

  },
   /**
   * Action blueprints:
   *    `/users/index`
   *    `/users`
   */
  roles: function (req, res) {
    Role.find().done(function(e,roles){
        return res.json(roles);
    })
  },

  roles_for_provider: function (req, res) {

    var query = 'SELECT * from role where code NOT IN ("root", "admin", "auditor")'

    Role.query(query, function(e,roles){
      return res.json(roles);
    })
  },
   /**
   * Action blueprints:
   *    `/users/index`
   *    `/users`
   */
  modules: function (req, res) {
    Module.find().done(function(e,modules){
        return res.json(modules);
    })
  },

  savepermisions : function(req,res){

      var role = req.body.role;


        Permisions.destroy({role_id:role}).done(function(e,r){

              if( req.body.modules ){

                  for( x in req.body.modules ){

                      var module  = req.body.modules[x];
                      var visible = req.body.visible.indexOf(module);
                      var visible = visible == -1 ? 0 : 1;

                      Permisions.create({role_id:role,module_id:module,visible:visible}).done(function(er,rr){


                      });
                  }

              }


        });

      return res.json(req.body);
  }


};
