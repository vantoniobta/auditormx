const fs 			 = require('fs');
const request  = require('request');
const uid 		 = require('rand-token').uid;
const objectid = require('objectid');


var checkResponse = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false
  }
  return true
};

module.exports = {
 index: function (req, res) {
    res.json({code:0,msg:'ok'})
  },

  save: function (req, res) {
  	//Get Values
    // var token 		= data.token == '' ? gen_token : data.token;
    var data 			= req.body.app;
    var tenantid 	= String(data.tenant);
    var case_type	= '';

    //Assign save type
    if( data.id == ''){
    	case_type = 'add';
    }else{
    	case_type = 'update';
    }

    // Used to Check if Email Already Existed
    // Accounts.tenant('auditor-master').find({_id:objectid(tenantid),'apps.email':data.email}).exec(function(e,r){
      // if( checkResponse(r) == false && case_type == 'add'){
      	// res.json({code:101,msg:'the user exists'});
      // }else{

      	//Case ADD
      	if( case_type == 'add'){

      		//Set Values
		    	data.token 	= uid(12);
			    data._id   	= objectid();
			    data.id    	= String(data._id);
			    data.status	= 0;

			    //Find the tenant
			    Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,r){
			    	//Check if there are apps already to asign data without erasing previous Apps
			    	var apps_type = typeof r.apps;
			    	if( apps_type == 'undefined' ){
			    		r.apps = [data];
			    	}else{
			    		r.apps[(r.apps).length] = data;
			    	}

			    	//Save New App
			      r.save(function(err,doc){
			        if (!e) {
                res.json({code:0,msg:'App added',data:[data]});
                console.log('----------- ADD NEW APP ----------');
                console.log(r.apps);
                console.log('----------------------------------');
              //Error handling : Database Error
              }else{
                res.json({code:103,msg:'Error! Saving in auditor-tenant', error:e});
              }
			      });
			      
			    });
			  // Case Update
		    }else{
		    	//Find tenant
		    	Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,r){
		    		//Iterate through Existing Apps to find the App to Update
		        for( var x in r.apps ) {
		        	if( r.apps[x].id == data.id ){
		        		var current = x;
		        		//Set new values
		        		r.apps[x].name = data.name;
		        		r.apps[x].email = data.email;

		        		//Update App
		        		r.save(function(e,r){
		        			if (!e) {
		                res.json({code:0,msg:'App Updated',data:r.apps[current]});
                		console.log('------------ UPDATE APP ----------');
		                console.log(r.apps[current]);
		                console.log('----------------------------------');
		              //Error handling: Database Error
		              }else{
		                res.json({code:103,msg:'Error! Updating in auditor-tenant', error:e});
		              }
		        		});
		        	}
		        }
		        
		    	});

		    }

      // }
    // });

  },

  delete:function(req, res){
  	//Get Values
    var data 		 = req.body;
    var tenantid = String(data.tenant);

    // Find tenant
    Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,r){
      if (!e){

    		var apps = r.apps;
    		//Iterate though Existing Apps to find the App to Delete
	      for(var x in apps){
	        if( apps[x].id == data.id ){
	        	var current = x;
	        	//Save future deleted app for response
	        	var deleted = r.apps[x];
	        	//Eliminate Subdocument
	        	apps.splice(x,1);
	        	//Assign the new object
	        	r.apps = apps;

	        	//Save new object (without deleted App)
        		r.save(function(e,r){
        			if (!e) {
                res.json({code:0,msg:'ok'});
                console.log('------------ DELETE APP ----------');
        				console.log(deleted);
        				console.log('----------------------------------');
        			//Error handling: Database Error
              }else{
                res.json({code:103,msg:'Error! delete in auditor-tenant', error:e});
              }
        		});

	        }
	      }
	    //Error handling: Database Error
      }else{
        res.json({code:101,msg:'Error! delete in auditor-master', error:e});
      }
    });
	},

  all: function (req, res) {
    var where  	 = {};
    var tenantid = String(req.query.tenant);
    console.log(tenantid);
    Accounts.tenant('auditor-master').findOne(tenantid).exec(function(e,r){
      if (!e) {
      	console.log(r.apps);
        res.json({code:0,msg:'ok',data:r.apps});
      }else{
        res.json({code:104,msg:'error! Cant find the tenant', error: e});
      }
    });

  },

};
