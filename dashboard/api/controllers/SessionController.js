/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt    = require('bcrypt');
var crypto    = require('crypto');
var randtoken = require('rand-token');
var request   = require('request');

module.exports = {
  index: function (req, res) {
      //return res.view();
  },
  current: function (req, res){
  	 var id 	 			        = req.body.id;
  	 var user			          = req.session.user;
  	 req.session.tenant     = id;
     //-------------------save logs-----------
     Register.tenant('Accedió a tenant',id,user);
     return res.json({code:0});
  }


};



