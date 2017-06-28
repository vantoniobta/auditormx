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

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

update = function(u,data,res){

   u.save(function(error,data){
      if(!error){
        return res.json({code:0,mode:'update',msg:'ok',data:data});     
      }else{
        return res.json({code:1,mode:'update',msg:'Error',data:data});     
      }
    });
}

module.exports = {
	 
  index: function (req, res) {        	    
      return res.view();
  },

  all: function (req, res) {
  	var rows 	  = req.query.rows;
  	var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
  	var where = {};

  	if( keyword ){
		var keyword = keyword.trim();
		where.or = [ { like: {name: '%'+keyword+'%'} } ];
	}
    //,{fields: {name:1,email:1,status:1,type:1}}
  	Users.find(where).limit(rows).exec(function(e,data){
  		return res.json({code:0,msg:'ok',data:data});     
  	});    	
  },

  save: function (req, res) {     
  var data        = req.body.user;
  		data.status   = 1;
      data.name     = data.name.trim();
      data.email    = data.email.trim();
      data.password = data.password.trim();
      data.tenant   = 'auditor-coca';//req.session.user.tenant;
      
      request.post({url:'http://ws.iclicauditor.com/users/add', timeout: 10000, form:data}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
         return res.json({code:0,mode:'insert',msg:'ok',data:data});     
        }else{
          console.log( error );
          return res.json({code:1,mode:'insert',msg:'Error',data:error});     
        }       
      });   
  },
  delete : function(req, res){
    var id = req.body.id;
    Users.destroy({id:id}).exec(function(error,data){
      if(!error){
        return res.json({code:0,mode:'delete',msg:'ok',data:data});     
      }else{
        console.log( error );
        return res.json({code:1,mode:'delete',msg:'Error',data:error});     
      }
    });
  },


  example: function(req, res){
         var data        = req.body.user;
            data.status   = 1;
            data.name     = data.name.trim();
            data.email    = data.email.trim();
            data.password = data.password.trim();
            data.token    = data.token.trim();
            data.tenant   = data.tenant.trim();
            data.role     = data.role.trim();
            data.tenant   = data.tenant.trim();
            //data.tenant   = 'pepsi';//req.session.user.tenant;

            request.post({url:'http://ws.iclicauditor.com/users/add', timeout: 10000, form:data}, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                   return res.json({code:0,mode:'insert',msg:'ok',data:data});     
                  }else{
                    console.log( error );
                    return res.json({code:1,mode:'insert',msg:'Error',data:error});     
                  }       
        }); 

  }




};
