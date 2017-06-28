/**
 * StatusController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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
	 *    `/status/index`
	 *    `/status`
	 */
	index: function (req, res) {

		Vwfullstatus.find({supplier_id:79,list_id:1},{id:1}).done(function(e,docs){
			var data = [];
			for(x in docs){
				data.push(docs[x].id);
			}

			console.log( "'"+ data.join("','")+"'");
		});

		return res.view();
	},

	/**
	 * Action blueprints:
	 *    `/status/table`
	 */
	table : function(req, res){

		res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = req.session.user.supplier_id;
		var skip = rows * ( page - 1 );


		if( [1,2,3].indexOf(role) > -1   ){

			var state      = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
			var provider   = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
			var active     = typeof(req.query.active) == 'undefined' ? null : req.query.active;
			var where      = {};
			var wherecount = {}


			var permisions_providers = req.session.permisions.providers;
			var permisions_types = req.session.permisions.types;

			if (permisions_providers.length > 0) {
				where.supplier_id = permisions_providers;
			}

			if (permisions_types.length > 0 ) {
				where.type =  permisions_types;
			}


			if( keyword ){
					where.or = [{uuid:keyword}];
			}

			Vwstatus.count(where).done(function(e,c){
				Vwstatus.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
							var totalpages = Math.ceil( c/rows )
							return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
				});
			});
		}

		if( [1,2,3].indexOf(role) == -1 ){


			Vwstatus.count({supplier_id: supplier }).done(function(e,c){
				Vwstatus.find({supplier_id: supplier }).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
							var totalpages = Math.ceil(c / rows )
							return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
				});
			});
		}

	},

	/**
	 * Action blueprints:
	 *    `/status/table`
	 */
	files : function(req, res){
		res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = req.session.user.supplier_id;
		var skip = rows * ( page - 1 );

		File.count({status:{not:6},type:'status'}).done(function(e,c){
			File.find({status:{not:6},type:'status'}).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
						var totalpages = Math.ceil(c / rows )
						return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
			});
		});

	},


		/**
	 * Action blueprints:
	 *    `/status/index`
	 *    `/status`
	 */
	 report: function (req, res) {
		var fs 	 	= require('fs');
		var path 	= require('path');
		var mkdirp 	= require('mkdirp');
		var request	= require('request');

		var date    = new Date();
		var dmonth  = String(date.getMonth()).length == 1 ? '0'+date.getMonth() : date.getMonth();
		var ddate   = String(date.getDate()).length == 1 ? '0'+date.getDate() : date.getDate();
		var dirdate = date.getFullYear()+''+dmonth+''+ddate;

		var user      = parseInt(req.session.user.id);
		var supplier  = parseInt(req.session.user.supplier_id);

		if( req.files.images_upload.size > 0){

			if( req.files.images_upload.headers['content-type'] == 'application/zip' ){

				var tmp 		= req.files.images_upload.path;
				var name 		= req.files.images_upload.originalFilename;
				var dir  		= path.resolve( __dirname +'/../../assets/uploads/files/');
				var ext         = '.'+name.split('.').slice(-1).pop();
				var directory   = name.replace(ext,'');

				//-- Read file  -------------------------------------------------------------------------------------------------
				fs.readFile(tmp, function (err,data) {
					var data = {
						 src:name,
						 user_id:user,
						 supplier_id:supplier,
						 status:0,
						 tmp:tmp,
						 qty:5,
						 type:'status',
						 comment:'Descomprimiendo Archivo'
						}
					// File Process ---------------------------------------------------------------------------------------
					File.create(data).done(function(e,doc){
						var id = doc.id

						var service   = 'http://localhost:4442/status/report?id='+id;
				        //console.log(service);
				        //console.log('-------------------------------------------------------'.grey);
						var client  = request.get(service,{id:id},function(err, response, body) {
							try{
								var data = JSON.parse(body);
						    	if(data.code == 0 ){
						    		return res.json(200,{code:0,msg:'File is correctly saved',id:id})
						    	}
						    }catch(e){
						    	File.destroy(id).done(function(e,f){
						    		return res.json(200,{code:100,msg:'Problemas al registrar el archivo, intenta de nuevo',id:id})
						    	});
						    }
						  });

					});
					//----------------------------
				});
			}else{
				res.json(200,{code:101,msg:'Error to upload this file. Not valid file type, Zip File is required '});
			}
		}else{
			res.json(200,{code:100,msg:'Error to upload this file'});
		}

	 },


};
