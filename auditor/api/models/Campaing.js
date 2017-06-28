/**
 * Campaings
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
migrate: 'safe', 
  attributes: {
    account_id:'integer'
  	,name:'string'
    ,start:'date'
   	,finish:'date'
    ,status:'int'  
    // ,created:'datetime' 
  }

};



