/**
 * Art_location
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe',
  attributes: {
  	id:{ 
    	  type:'integer'
  	}
  	,art_id:{ 
    	  type:'integer'
  	}
  	,id_object:{ 
    	  type:'integer'
  	}
  	,uuid_object:{ 
        type:'string'
    } 
    ,uuid_art:{ 
        type:'string'
    } 
    ,supplier_id:{ 
        type:'string'
    }
  } 
};

                     