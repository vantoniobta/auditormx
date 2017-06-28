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
  	supplier_id:'integer',
  	create_by:'integer',
  	update_by:'integer',
  	name:'string',
  	uuid:'string',
  	src:'string',
  	src_public:'string',
  	start:'date',
  	end:'date'
  }
};


// INSERT INTO list
// SELECT
// 0 as id,
// id as suplier_id,
// uuid,
// 'Primera Etapa' as name,
// '2014-09-01 00:00:00' as createdAt,
// '2014-09-01 00:00:00' as updatedAt,
// '2014-09-01' as start,
// '2014-09-30' as end
// FROM provider
