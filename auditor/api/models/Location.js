/**
 * Location
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe',
  attributes: {
  	  uuid:'string'
	  ,account_id:{
	  	  type:'integer',
	  	  defaultsTo:0
	  }
	  ,supplier_id:{
	   	  type:'integer',
	  	  defaultsTo:0
	  }
	  ,campaing_id:{
	   	  type:'integer',
	  	  defaultsTo:1
	  }
	  ,list_id:{
	   	  type:'integer',
	  	  defaultsTo:0
	  }
	  ,code:'string'
	  ,version:'string'
	  ,coords:'string'
	  ,lng:'string'
	  ,lat:'string'
	  ,light:'string'
	  ,price:'string'
	  ,tax:'string'
	  ,total:'string'
	  ,ammount:'string'
	  ,contra:'string'
	  ,base:'text'
	  ,height:'text'
	  ,dimensions:'text'
	  ,material:'text'
	  ,neighbor:'text'
	  ,ref_street_1:'text'
	  ,ref_street_2:'text'
	  ,zip:'string'
	  ,street:'text'
	  ,city:'text'
	  ,state:'text'
	  ,type:'text'
	  ,view_type:'text'
	  ,active:'integer'
	  ,start:'date'
	  ,release:'date'
	  ,status:'integer'
	  ,size:'string'
	  ,phase:'integer'
	  ,segment:'string'
	  ,comments:'string'
 	  ,license_plate:'string'
      ,line:'string'
      ,route:'string'
      ,sector:'string'
      ,station:'string'
      ,tren:'string'
      ,vagon:'string'
      ,place:'string'
      ,structure:'string'
      ,format:'string'
      ,numid:'string'
      ,qty:'integer'


  }


};



