/**
 * Logs
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe',
autoUpdatedAt: false,
  attributes: {
    uuid: {
        type: 'string'
      , defaultsTo: '0'
    }
    ,message: 'string'
    ,user_id: 'integer'
  }

};
