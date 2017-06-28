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
    account         :'integer',
    cve             :'string',
  	owner_name       :'string',
    coowner_name    :'string',
    street          :'string',
    neighbor        :'string',
    city            :'string',
    state           :'string',
    country         :'string',
    zip             :'string',
    coords          :'string',
    phone           :'string',
    mobile          :'string',
    other_phone     :'string',
  	email            :'string',
    status          :'integer',
    membership_id   :'integer',
    address: function (){
      return this.street + ' ' + this.neighbor+ ' ' +this.city+ ' ,' +this.state+ ', CP.' +this.zip+ '. ' +this.country;
    },

    thestatus : function(){
        return this.status == 1 ? 'active' : 'inactive';
    },
    toJSON: function() {
      var obj       = this.toObject();
      obj.address   = this.address();
      obj.thestatus = this.thestatus();
      return obj;
    }

  }
};
