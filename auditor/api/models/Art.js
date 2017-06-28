	/**
 * Art
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
  	 created_by:'integer'
  	,update_by:'integer'
    ,campaing_id:'integer'
  	,name:'string'
  	,uuid:'string'
    ,status:'int'
  } 

};



