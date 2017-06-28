/*
	* USE *

	In controller method
	=======================
	  var log = require('../../utilities').logs(Logs)
	  log.create('login', req.session.user.id )
*/

module.exports = function(Logs){
	var log = {};
	log.create = function(option, user_id){

		var messages = {
			  'login': 'Usuario logueado'
			, 'repassword': 'Recuperación de Password'
			, 'status_sended': 'Estatus Enviado'
			, 'csv_upload': 'CSV Subido'
			, 'profile_changed': 'Perfil de Usuario Modificado'
			, 'provider_changed': 'Datos de Proveedor Modificados'
			, 'user_created': 'Usuario Creado'
			, 'user_updated': 'Usuario Actualizado'
		}

		Logs.create({
			message: messages[option] || option // si no esta registrado el mensaje lo crea
			, user_id: user_id
		}).done(function(e,d){
			//if (e) console.log(e)
		})

	};

	/* LOG */
	return log;
};