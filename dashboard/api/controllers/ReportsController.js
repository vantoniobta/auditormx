/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */ 
 
module.exports = {
	 
  index: function (req, res) {        	 
     // RemoteApi('/users','post',function(status,body){
     //    console.log(status,body)
         return res.view();
     // });  	
  }   
};

