/**
 * Art_location
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
  	art_id:{ 
    	  type:'integer'
  	}
  	,location_id:{ 
        type:'integer'
    } 
  } 
};
