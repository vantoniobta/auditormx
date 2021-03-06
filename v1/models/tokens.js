/**
* Tokens.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = {
  attributes: {    
    user_id     :{type:'string',index:1},
    tenant      :{type:'string',index:1},
    token 		:{type:'string',index:1},
    user_token  :{type:'string',index:1},
    type   		:{type:'string',index:1},
    created     :{type:'datetime',index:1},
    updatedAt   :{type:'datetime',index:1},
    createdAt   :{type:'datetime',index:1},
  },
  toJson : function(obj){
      delete obj.password;
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
