/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = {
  primary:'_id',
  attributes: {
   //  id          :'integer',
  	// uuid        :'string',
   //  key         :'string',
   //  token       :'string',
   //  provider_id :'integer',
   //  name        :'string',
   //  full_name   :'string',
   //  email       :'string',
   //  password    :'string',
   //  lang        :'string',
   //  address     :'string',
   //  phone       :'string',
   //  mobile      :'string',
   //  role        :'integer',
   //  created     :'datetime',
   //  updatedAt   :'datetime',
   //  createdAt   :'datetime',
   //  status      :'integer',
  },
  toJson : function(obj){
      //delete obj.password;
      delete obj.key;
      delete obj.token;
      return obj;
  },
  beforeCreate: function(values, next) {
      bcrypt.hash(values.password, 10, function(err, hash) {
        if(err) return next(err);
        values.password = hash;
        next(values);
      });
  },

};

