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
  	var e_ = req.session.user.email;
	  	//--------------------------------------------
		  Users.findOne({email:e_}).exec(function(e,user){
		  	if (user) {
		  	   user.save(function(){
		  	       req.session.user = user;
		  	       req.session.lang = user.lang;
	               req.session.authenticated = true;
		  	       res.view();
		  	     })
			   }
			})
		 //--------------------------------------------

  }


};
