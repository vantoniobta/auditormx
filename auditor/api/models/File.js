/**
 * List
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  migrate: 'safe',
  attributes: {
  	 src:'text',
  	 file_id:'integer',
  	 user_id:'integer',
  	 supplier_id:'integer',
  	 status:'integer',
  	 comment:'text',
  	 tmp:'text',
  	 type:'text',
  	 qty:'integer'
  }

};
