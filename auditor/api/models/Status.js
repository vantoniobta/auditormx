/**
 * Status
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe',
  attributes: {
  	location_id:{
  	  type:'integer',
  	  defaultsTo:0
	},
	user_id:{
  	  type:'integer',
  	  defaultsTo:0
	}
	,file_id:'integer'
	,type:'string'
	,lng:'string'
	,lat:'string'
	,stamp:'string'
	,status:'string'
	,uuid:'string'
	,message:'text'
	,uuid_object:'string'
	,folio:'string'
	,date:'string'
	,snapshots:'text'
  }
};
