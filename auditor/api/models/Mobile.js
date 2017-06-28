/**
 * Buses
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe',
  attributes: {
	  account_id:{
	  	  type:'integer',
	  	  defaultsTo:0
	  }
	  ,supplier_id:{
	   	  type:'integer',
	  	  defaultsTo:0
	  }
	,'type':'string'
	,'license_plate':'string'
	,'code':'string'
	,'line':'string'
	,'route':'string'
	,'sector':'string'
	,'station':'string'
	,'tren':'string'
	,'vagon':'string'
	,'place':'string'
	,'city':'string'
	,'state':'string'
	,'structure':'string'
	,'base':'string'
	,'height':'string'
	,'dimensions':'string'
	,'format':'string'
	,'price':'string'
	,'tax':'string'
	,'release':'string'
	,'comments':'string'
	,'status':'integer'
  }

};
