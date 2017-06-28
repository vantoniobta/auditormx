/**
 * LoginController
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

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var util = require('../../utilities')
var notifications = util.notifications;


module.exports = {

	index : function (req, res) {
		console.log("LoginController::index; Entrando a la funcion");
		var log = util.logs(Logs);
		var bcrypt = require('bcrypt');

		if(req.method == 'POST') {
			console.log("LoginController::index; Si es una peticion POST ");
			console.log(req.body);
		    var response = {};
			var email    = req.body.email;
			var password = req.body.password;
			Vwuser.findOne({
		    	email:email,
		    	status:1
		    }).done(function(e,user){

		    	if( typeof user == 'undefined'){
					console.log("LoginController::index; NO se encontro el usuario con el correo: "+ req.body.email );
		    		response.email     = email;
		    		response.status    = 500;
		    		response.message   = 'invalid users'
		    		res.view({layout:'login.ejs',data:response});

		    	}else{
					console.log("LoginController::index; Se encontro el usuario con el correo: "+ req.body.email );
		   			bcrypt.compare(password, user.password, function(err, result) {

					  	if(result){
					  	    var crypto = require('crypto');
                		    var hash = crypto.createHash('md5').update(user.email).digest('hex');
                		    user.gravatar    = hash;

							req.session.authenticated = true;
							req.session.user = user;
							req.session.permisions = {};
							req.session.permisions.types = [];
							req.session.permisions.providers = [];

							User_Type.find({'user_id':user.id}).done(function(err, result){

								var types = [];
								for (p in result){
									//console.log(result[p]);
									types.push(result[p].type);
								}

								req.session.permisions.types = types;
							});


							User_Provider.find({'user_id':user.id}).done(function(err, result){

								var providers = [];
								for (p in result){
									//console.log(result[p]);
									providers.push(result[p].provider_id);
								}

								req.session.permisions.providers =  providers;
							});

							//nav
							user.nav(user.role,function(nav){

								if( nav.length > 0 ){
									var navi = {};
									for( var x in  nav ){
										navi[nav[x].controller] = [ nav[x].name, nav[x].path, nav[x].icon,nav[x].visible, nav[x].controller ];
									}
									req.session.nav = navi;

									log.create('login', req.session.user.id )

									return res.redirect( nav[0].path ) ;
								}else{
									response.email     = email;
						    		response.status    = 500;
						    		response.message   = 'invalid profile for this user';
						    		res.view({layout:'login.ejs',data:response});
								}
							});

				    	}else{
							//adding values to result
				    		response.email     = email;
				    		response.status      = 500;
				    		response.message   = 'invalid password';
				    		res.view({layout:'login.ejs',data:response});
				    	}
				    });
			    }
			});
		}else{
			delete req.session.authenticated;

			res.view({layout:'login.ejs'});
			var date    = new Date();
			var day     = String(date.getDate()).length == '1' ? '0'+ date.getDate() : date.getDate();
			var month   = String(parseInt(date.getMonth()+1)).length == '1' ? '0'+ parseInt(date.getMonth()+1) : parseInt(date.getMonth()+1);
			var hour    = String(date.getHours()).length == '1' ? '0'+ date.getHours() : date.getHours();
			var mins    = String(date.getMinutes()).length == '1' ? '0'+ date.getMinutes() : date.getMinutes();
			var secs    = String(date.getSeconds()).length == '1' ? '0'+ date.getSeconds() : date.getSeconds();
			var thedate = date.getFullYear()+'-'+month+'-'+day+' '+hour+':'+mins+':'+secs;

		}
	},

	recovery : function(req,res){
		var log = util.logs(Logs);

		if(req.method == 'POST') {
			if( validateEmail(req.body.email) ){
				User.find({email:req.body.email}).done(function(e,data){

					if( data.length > 0 ){

						var key = data[0].key;
						var msg_data = {
                          subject: "IClic Auditor: Recuperación de Password"
                        , text : {
                              subject: "Recuperación de Password"
                            , message:
                                "Se ha iniciado un proceso de recuperación de password, si deseas continuar haz click en el siguente enlace: <p>" + '<a href="http://iclicauditor.com/login/newpass?key='+key+'">http://iclicauditor.com/login/newpass?key='+key+'</a></p>'
                           }
                        , mail: data[0].email
                      }

                      log.create(1, data.id )

                      notifications.mail( msg_data, 'mailist.ejs', null )
                      return res.view({layout:'login.ejs',form:null,code:0,msg:'Se ha enviado un correo electrónico para confirmación.'});

                  }else{

                  	console.log('no valid ' + req.body.email );
                  	return res.view({layout:'login.ejs',form:true,code:0,msg:'No se han encontrando un usuario con el correo electrónico solicitado, favor de intentar de nuevo.'});
                  }

				});
			}else{
				return res.view({layout:'login.ejs',form:true,code:0, msg:'Un Email válido es requerido'});
			}
		}

		if(req.method == 'GET') {
				return res.view({layout:'login.ejs',form:true});
		}
	},

	newpass : function(req,res){

		if(req.method == 'POST') {

		  var bcrypt      = require('bcrypt');
          var thePassword = req.body.rpassword;

          bcrypt.hash(thePassword, 10, function(err, hash) {
           	User.findOne({key:req.body.key}).done(function(error,user){
           		crypto      = require('crypto');
        		user.key    = crypto.randomBytes(8).toString('hex');
        		user.status = 1;
             	user.password = hash;
             	user.save(function(e,o){
             		//------------------------------------------------------
             		var msg_data = {
                          subject: "IClic Auditor: Cambio de Password"
                        , text : {
                              subject: "Cambio de Password"
                            , main_message:
                                "Ha cambiado exitosamente su password: "
                            , second_message :
                                "<li> Nueva password: <b>" + thePassword + "</b> </li>"

                          }
                        , mail: user.email
                      }
                      // notifications.mail(data, template, attachment )
                      notifications.mail( msg_data, 'index.ejs', null );
                    //------------------------------------------------------

                    return res.view({layout:'login.ejs',form:false,code:0,msg:'Tu Contraseña ha sido actualizada para iniciar <a href="/login"> haz click aqui </a>'});

                    //------------------------------------------------------
             	})

            });

          });


		}

		if(req.method == 'GET') {

			if( typeof(req.query.key) != 'undefined'){

				var key = req.query.key;

				User.find({key:key}).done(function(e,r){
					if(e){
						return res.view({layout:'login.ejs',form:true,code:100,msg:'Ha ocurrido un error en el servidor, por favor intenta de nuevo.'});
					}
					if(r.length){
						return res.view({layout:'login.ejs',form:true,code:0, msg:'Favor de Ingresar nuevo password',key:key});
					}else{
						return res.view({layout:'login.ejs',form:false,code:100, msg:'La clave de recuperación de password es inválida.',key:0});
					}
				});

			}else{
				return res.view({layout:'login.ejs',form:false,code:100, msg:'La clave de recuperación de password es requerida.'});
			}

		}

	}
};





 		  // var bcrypt      = require('bcrypt');
     //      var thePassword = util.string.random(9);

     //      bcrypt.hash(thePassword, 10, function(err, hash) {
     //          	data.password = thePassword;
     //            User.update({id:data.id},data,function(error,user){
     //              if (error) res.send(error);
     //              if (user){
     //                if (thePassword != undefined){
     //                  var msg_data = {
     //                      subject: "IClic Auditor: Cambio de Password"
     //                    , text : {
     //                          subject: "Cambio de Password"
     //                        , main_message:
     //                            "Ha cambiado exitosamente su password: "
     //                        , second_message :
     //                            "<li> Nueva password: <b>" + thePassword + "</b> </li>"

     //                      }
     //                    , mail: data.email
     //                  }
     //                  notifications.mail( msg_data, 'index.ejs', null )
     //                }
     //                res.send(user);
     //              }
     //           });
     //      });
