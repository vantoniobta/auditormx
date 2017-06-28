/**
 * Location
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe',
autoCreatedAt: false,
autoUpdatedAt: false,  
  attributes: {
    account_id:{ 
  	  type:'integer',
  	  defaultsTo:0
	}	
  ,uuid:'string'
	,name:'string'
  ,nickname:'text'
  ,rfc:'string'
 	,type:'integer'
  ,phone:'string'
 	,address:'string'
  ,address_work:'string'
  ,comments:'text'
  ,owner:'string'
  ,email:'string'
  ,update_by:'integer'
  ,created:'string' 
  },
 

};



