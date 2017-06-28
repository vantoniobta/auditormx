/**
 * Audit
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
  	  code: 'integer'
  	, status: 'integer'
  	, comments: 'text'
    , side: 'string'
  	, createAt: 'string'
  	, files: 'string'
  }
};