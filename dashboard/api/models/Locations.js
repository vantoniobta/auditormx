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
      key : {
         type: 'string'
      },
      address : {
         type: 'string'
      },
      neiborghud:{
         type: 'string'
      },
      city:{
         type: 'string'
      },
      state:{
         type: 'string'
      },
      country:{
         type: 'string'
      },
      zip:{
         type: 'string'
      },
      company:{
         type: 'string'
      },
        start_date:{
         type: 'string'
      },
        end_date:{
         type: 'string'
      }

 
   }
};