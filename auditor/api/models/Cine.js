/**
 * Cine
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
		uuid:'string',
		name:'string',
		account_id:{
			type:'integer',
			defaultsTo:0
		},
		supplier_id:{
			type:'integer',
			defaultsTo:0
		},
		room_count:{
			type:'integer',
			defaultsTo:0
		},
		code:'string',
		coords:'string',
		lng:'string',
		lat:'string',
		zip:'string',
		street:'text',
		city:'text',
		state:'text',
		view_type:'text',
		active:'integer',
		release:'datetime',
		created:'datetime',
		status:'integer'
	}


};



