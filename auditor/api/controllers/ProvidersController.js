/**
 * ProvidersController
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
	 *    `/locations/index`
	 *    `/locations`
	 */
	index: function (req, res) {
		// Send a JSON response
		res.view();
	},
	/**
	 * Action blueprints:
	 *    `/providers/index`
	 *    `/providers`
	 */
	view: function (req, res) {

		var permision_providers = req.session.permisions.providers;
		var provider_id = req.param('id');
		var can_access = false;

		if (permision_providers.length > 0 ){
			for(i in permision_providers){
				if(permision_providers[i] == provider_id){
					can_access = true;
				}
			}
		}
		else {
			can_access = true;
		}

		if(!can_access){
			return res.forbidden("No tienes permisos suficientes para accesar este servicio.", 404);
		}


		if( req.param('id') ){

			var id = req.param('id');
			return res.view({id:id});

		}else{

			return res.view({id:0});

		}
		//res.redirect('/providers');
	},
	/**
	 * Action blueprints:
	 *    `/users/get`
	 */
	get: function (req, res) {
		var id = req.query.id;
		res.contentType('application/json');
		Provider.find(id).done(function(err,doc){
				if( doc.length > 0){
				res.json(doc[0]);
			}else{
				res.json({'error':100,'msg':'Cant find this provider id'});
			}
		});
	},
	/**
	 * Action blueprints:
	 *    `/providers/get_by_role`
	 */
	get_by_role: function (req, res) {
		var role = req.body.role;
		res.contentType('application/json');
		User.find( {role: role} ).done(function(err,doc){
			if(doc){
				res.json(doc);
			}else{
				res.json({'error':0,'msg': err});
			}
		});
	},
	/**
	 * Action blueprints:
	 *    `/users/delete`
	 */
	delete: function (req, res) {
	 var id = req.body.id;
	 res.contentType('application/json');
	 Provider.destroy({id:id},function(e){
			return res.json({'code':0,'msg':'Provider deleted'});
	 });
	},
	/**
	 * Action blueprints:
	 *    `/users/create`
	 */
	save : function(req,res){
		var log = require('../../utilities').logs(Logs)
		var mode = req.body.modeForm;
		var data = req.body.provider;
		//data update by
		data.update_by = req.session.user.id;
		//console.log(req.session.user)

		switch(mode){
			case 'update':
			 Provider.update({id:data.id},data,function(e,u){
				log.create('provider_changed', req.session.user.id )
				res.send(e||u);
			 });
			break;
			case 'add':
				if (data.id) delete data.id

				Provider.create(data).done(function(err, provider){
					// Error handling
					if (err) {

						return res.json({code:100,msg:"Provider cant be created"});
					// The User was created successfully!
					}else {
						console.log([mode, data])
						log.create('Provider Created', req.session.user.id )
						return res.json({code:0,msg:"Provider created:",data:provider});
					}
				});
			break;
		}
	},
	/**
	 * Action blueprints:
	 *    `/users/table`
	 */
	all : function(req, res){
		res.contentType('application/json');

		Provider.find().sort('name asc').done(function(e,docs){
			 if (e) {
						res.json({code:100,msg:'Error en la ocnsulta'});
				 }else{
					res.json({code:0,msg:'ok',data:docs});
				 }
		});
	},
	user : function(req, res){
		res.contentType('application/json');

		var where = {};

		var permisions_providers = req.session.permisions.providers;
		var permisions_types = req.session.permisions.types;

		if (permisions_providers.length > 0) {
			where.supplier_id = permisions_providers;
		}

		/*
		if (permisions_types.length > 0 ) {
			where.type =  permisions_types;
		}
		*/

		Provider.find(where).sort('name asc').done(function(e,docs){
			if (e) {
				res.json({code:100,msg:'Error en la ocnsulta'});
			}else{
				res.json({code:0,msg:'ok',data:docs});
			}
		});
	},
	/**
	 * Action blueprints:
	 *    `/users/table`
	 */
	table : function(req, res){
		res.contentType('application/json');
		var rows = 10000; //req.query.rows;
		var page = req.query.page ;
		var skip = rows * ( page - 1 );

		 //variables
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;

		//if keyword
		if( keyword ){
			var where  = 'WHERE name LIKE "'+keyword +'%" OR nickname LIKE "'+keyword+'%"';
		}

		//sql select
		var sql  = 'SELECT  * FROM treport  ';
				sql += where +" ORDER BY "+sortfield+" "+sortby+" LIMIT "+skip+","+rows;

		Treport.query(sql,function(e,docs){
			 if (e) {
						return res.send({code:100,msg:'Error en la ocnsulta'});
				 }else{
					Treport.count(function(error,counter){
						var totalpages = Math.ceil( counter / rows );
						return res.json({code:0,msg:'ok',data:docs,pages:{current_page:page,last_page:totalpages,rows:rows}});
					})
				 }
		});

	},

	users: function(req, res){
		var rows = req.query.rows;
		var page = req.query.page ;
		var skip = rows * ( page - 1 );

		User.find( { supplier_id: req.query.provider_id } )
				.skip(skip).limit(rows).sort({ id: 'desc' })
				.done(function(error, docs){
					var counter = docs.length
					var totalpages = Math.ceil(counter / rows )
						return res.json({ code: 0, msg: 'ok', data: docs, pages: {current_page: page, last_page: totalpages, rows: rows}});
				})
	},

	locationstable : function(req, res){

		res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var supplier  = req.query.id;
		var skip = rows * ( page - 1 );

			var state      = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
			var provider   = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
			var list   	   = typeof(req.query.list) == 'undefined' ? null : req.query.list;
			var active     = typeof(req.query.active) == 'undefined' ? null : req.query.active;
			var where      = {supplier_id: supplier };


			var permisions_providers = req.session.permisions.providers;
			var permisions_types = req.session.permisions.types;




			if (supplier > 0){
				where.supplier_id = supplier;
			}
			else {
				if (permisions_providers.length > 0) {
					where.supplier_id = permisions_providers;
				}
			}


			 if (permisions_types.length > 0 ) {
			 where.type =  permisions_types;
			 }


			if( keyword ){
				var keyword = keyword.trim();
				where.or = [{ like: {code: '%'+keyword+'%'} },{ like: {license_plate: '%'+keyword+'%'} }];
			}

			if( list ){
				where.list_id = list;
			}


			console.log("ProvidersControllers::locationstable; List ID: "+ list + " Where Params:" );
			console.log(where);


			console.log("ProvidersControllers::locationstable; Consultando Vwlocations");
			Vwlocations.count(where).done(function(e,c){
				Vwlocations.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
					var totalpages = Math.ceil(c / rows )
					return res.send({code:0,msg:'ok',data:r,count:c,pages:{current_page:page,last_page:totalpages,rows:rows}});
				});
			});


			/*
			if( list == 1 ){
				console.log("ProvidersControllers::locationstable; Consultando Vwlocations");
				Vwlocations.count(where).done(function(e,c){
					Vwlocations.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
								var totalpages = Math.ceil(c / rows )
								return res.send({code:0,msg:'ok',data:r,count:c,pages:{current_page:page,last_page:totalpages,rows:rows}});
					});
				});
			}else{
				console.log("ProvidersControllers::locationstable; Consultando Vwlocationlist");
				Vwlocationlist.count(where).done(function(e,c){
					Vwlocationlist.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
								var totalpages = Math.ceil(c / rows )
								return res.send({code:0,msg:'ok',data:r,count:c,pages:{current_page:page,last_page:totalpages,rows:rows}});
					});
				});
			}
			*/
		},

		deletespace : function(req,res){
			var uuid = req.body.uuid;
			var id   = req.body.id;



			res.contentType('application/json');
			Location.destroy({'id':id},function(e){
				return res.json({'code':0,'msg':'Location deleted'});
			});




			/*
			Vwmergelocations.find({uuid:uuid}).done(function(e,doc){

				switch( doc[0].table ){
					case 'mobile':
						Mobile.findOne(doc[0].id).done(function(e,r){
							r.status = 1;
							r.save(function(e,r){
								res.json({msg:'mobiles',data:r});
							})
						});
					break;
					case 'locations':
						Location.findOne(doc[0].id).done(function(e,r){
							r.status = 1;
							r.save(function(e,r){
								res.json({msg:'Locations',data:r});
							})
						})
					break;
					case 'cines':
						Cine.findOne(doc[0].id).done(function(e,r){
							r.status = 1;
							r.save(function(e,r){
								res.json({msg:'Locations',data:r});
							})
						})
					break;
				}


			});
			*/
		}

};
