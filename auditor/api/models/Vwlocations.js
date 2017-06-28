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
  	  uuid:'string'
	  ,account_id:{ 
	  	  type:'integer',
	  	  defaultsTo:0
	  }
	  ,supplier_id:{ 
	   	  type:'integer',
	  	  defaultsTo:0
	  }
	  ,uuid:'string'	    
	  ,code:'string'
	  ,coords:'string'
	  ,lng:'string'
	  ,lat:'string' 	
	  ,light:'string'
	  ,price:'integer'
	  ,iva:'integer'
	  ,tax:'string'
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
	  ,type:'text'
	  ,view_type:'text'
	  ,active:'integer'
	  ,release:'datetime'
	  ,created:'datetime'
	  ,status:'integer'	
  }


};



