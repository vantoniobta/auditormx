/**
 * Location
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {
	schema:false,
	migrate: 'safe',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {

		toJSON: function() {
     	 var obj = this.toObject();
      	 delete obj.password;
      	 return obj;
    	}
    	,getPassword :function(){
    		var obj = this.toObject();
    		return obj.password;
    	}
    	,nav: function(role,cb) {

    	 var role = isNaN(role) ? 0 : role ;
    	 Permisions.query('SELECT M.controller, M.name, P.module_id, M.path, M.icon, P.visible FROM permisions P LEFT JOIN module M on (M.id = P.module_id ) WHERE role_id = '+ role + '   AND M.enable = 1 ORDER BY M.position asc ',function(e,permisions){
    	 		cb(permisions);
    	 });

    	}
	},
	beforeCreate: function(values, next) {
	    bcrypt.hash(values.password, 10, function(err, hash) {
	      if(err) return next(err);
	      values.password = hash;
	      next();
	    });
  	},


};

