/**
* Locations.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
//var bcrypt = require('bcrypt');
//var crypto = require('crypto');

module.exports = {
  attributes: {
   	list_name:{type:'string',index:1},
   	start_date:{type:'date',index:1},
   	finish_date:{type:'date',index:1},
   	status:{type:'integer',index:1},
   	active:{type:'integer',index:1},
   	code:{type:'string',index:1},
   	address:{type:'string',index:1},
   	street:{type:'string',index:1},
   	neighbor:{type:'string',index:1},
   	ref_address:{type:'array',index:1},
   	zip:{type:'string',index:1},
   	city:{type:'string',index:1},
   	state:{type:'string',index:1},
   	type:{type:'string',index:1},
   	coords:{type:'array',index:1},
   	company:{type:'array',index:1},
   	lat:{type:'string',index:1},
   	lng:{type:'string',index:1},
   	size:{type:'array',index:1},
   	price:{type:'BigDecimal',index:1},
   	createdAt:{type:'date',index:1},
   	updatedAt:{type:'date',index:1},
   	comments:{type:'array',index:1}
  },

};