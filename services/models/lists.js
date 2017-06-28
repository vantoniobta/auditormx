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
      status:{
         type: 'integer',
         require:true,
         index:1
      },
      active:{
         type: 'string',
         require:true,
         index:1
      },
         locations:{
         type: 'array'
      }
   }
};