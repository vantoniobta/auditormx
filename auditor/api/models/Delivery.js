/**
 * Delivery
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe', 
  attributes: {
  	  state:'string'
  	, address:'string'
  	, type:'string'
  	, provider_id:'integer'
  }

};
