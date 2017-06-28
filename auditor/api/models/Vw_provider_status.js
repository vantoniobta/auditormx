/**
 * Version
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
		list_id:'integer'
		,supplier_id:'integer'
		,provider:'string'
		,suppliers:'string'
		,anomalies:'integer'
		,repaired:'integer'
		,witnesses:'integer'
		,total:'integer'
	}

};
