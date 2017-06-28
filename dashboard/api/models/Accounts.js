/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt    = require('bcrypt');
var crypto    = require('crypto');
var randtoken = require('rand-token');

module.exports = { 
  attributes: {    
  	account_name:'string',
    status:'number',
    token:'string',
    uuid:'string',
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.api;
      return obj;
    }   
  }
    
};

