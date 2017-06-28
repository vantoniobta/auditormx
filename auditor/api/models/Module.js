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
    id:{ 
  	  type:'integer',
  	  defaultsTo:0
	}	
   ,controller:'string'      
   ,name:'string'
   ,path:'string'
   ,visible:'integer'
   ,position:'integer'
   ,icon:'string'
   ,parent:'integer'
  }

};



