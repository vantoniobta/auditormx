/**
 * Status
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
		},
		user_id: {
			type: 'integer',
			defaultsTo: 0
		},
		type: {
			type: 'string',
			defaultsTo: 0
		}
	}
};
