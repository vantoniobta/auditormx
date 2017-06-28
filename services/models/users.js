/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
var crypto = require('crypto');
module.exports = {
   attributes: {
      name : {
         type: 'string',
         required:true,
         index:1
      },
      email:{
         type: 'string',
         required:true,
         unique:true,
         index:1
      },
      password:{
         type: 'string',
         require:true,
         index:1
      },
      status:{
         type: 'integer',
         require:true,
         index:1
      },
      name_auditor:{
         type: 'string',
         require:true,
         index:1
      },
      role:{
         type: 'string',
         require:true,
         index:1
      },
      key:{
         type: 'string',
         require:true,
         index:1
      },
      updatedAt :{
         type:'datetime',
         index:1
      },
      createdAt :{
         type:'datetime',
         index:1
      }
   },
  toJson : function(obj){
     // delete obj.password;
      // delete obj.key;
      // delete obj.token;
      return obj;
  }
  // beforeCreate: function(values, next) {
  //     bcrypt.hash(values.password, 10, function(err, hash) {
  //       if(err) return next(err);
  //       values.password = hash;
  //       next(values);
  //     });
  // },

};

