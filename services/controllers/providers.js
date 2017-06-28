
module.exports = {
		 index: function (req, res) {
	        res.json({code:0,msg:'ok'})
	   },

	      all: function(req, res){
		      var where    = {}
		      Locations.tenant('auditor-'+req.query.tenant).find().exec(function(e,r){
		         if (!e) {
		            res.json({code:0,msg:'ok',data:r});
		        }else{
		             res.json({code:100,msg:'error! database null in auditor-tenant', error: e});
		         }
		      });
		   },

		search: function(req,res){
			var tc     = [];
		   	var read   = req.body.test;
		   	var corr    = req.body.id;
		   	//console.log(corr)
		   	 Users.tenant('auditor-master').findOne({email:corr}).exec(function(e,u){ 		
						   	 if (e) throw e;
							   	 if(u){
								   	   tc.push(u.tenant)
							   	 }
							   	  // for(x in tc){
							   	  // 	 var r = tc[x];
								   	 //  	 for (var i=0; i<r.length; i++){
								   	 //  	 	if(r[i].name==read){
								   	 //  	 		res.json({code:0,msg:'ok',data:r[i]});
								   	 //  	 	}
								   	 //  	 }
							   	  //   }
								   for(var x=0; x<tc.length; x++){
								   	   res.json({code:0,msg:'ok',data:tc[x]});
								   	   console.log('.......................Workspaces...................') 
								   	   console.log(tc[x]) 		
								   	 }
		   	 })
			   	
			   	  
		 }
};