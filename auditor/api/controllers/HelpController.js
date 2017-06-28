/**
 * HelpController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


module.exports = {    
  /**
   * Action blueprints:
   *    `/profile/index`
   *    `/profile`
   */
  index: function (req, res) {
    
    // Send a JSON response
    res.view();
  },

  downloads : function(req, res){

    var fs    = require("fs");
    var path  = require("path");
  	var file = req.query.file;
  	var path = path.resolve( __dirname +'/../../assets/uploads/files/CSVTempates/'+ file );  	
  	res.download(path); // Set disposition and send it.

  }

};
