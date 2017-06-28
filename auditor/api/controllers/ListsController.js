/**
 * ListsController
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

Function.prototype.bindAll = function() {
	var _function = this;
	var args      = Array.prototype.slice.call(arguments);
	return function() {
		for( var x in args ){
			[].push.call(arguments, args[x]);
		}
		return _function.apply(this,arguments);
	}
}



module.exports = {

	/**
	 * Action blueprints:
	 *    `/buses/index`
	 *    `/buses`
	 */

	//index: function (req, res) {
		//res.view();
	//},

	 /**
	 * Action blueprints:
	 *    `/save/index`
	 *    `/save`
	 */
	save: function (req, res) {

		var collection = typeof(req.body.collection) == 'undefined' ? [] : req.body.collection;
		var name       = req.body.name;
		var last       = collection.length-1;

		List.create({name:name}).done(function(err, list){
			// Error handling
			if (err) {
				return res.json({code:100,msg:"List cant be created"});
			// The List was created successfully!
			}else {

					if( collection.length > 0 ){
						var id = list.id;
						//------------------------------------------------------------------
						for( x in collection){
								var value = parseInt(collection[x]);

									List_location.count({list_id:id,location_id:value}).done(function(e,count,value,x,last){
											if( count == 0 ){
												List_location.create({list_id:id,location_id:value}).done(function(err,location,x,last){

													if( x == last){
															return res.json({code:0,msg:"List created",data:list,count:collection.length});
													}
												}.bindAll(x,last));
											}else{
												if( x == last){
															return res.json({code:0,msg:"List created",data:list,count:collection.length});
													}
											}
								}.bindAll(value,x,last));
						}
					}else{
						return res.json({code:0,msg:"List created",data:list,count:collection.length});
					}
				//------------------------------------------------------------------
				// return res.json({code:0,msg:"List created:",data:list,count:collection.length});
				//------------------------------------------------------------------
			}
		});


	},

	/**
	 * Action blueprints:
	 *    `/update/index`
	 *    `/update`
	 */
	update: function (req, res) {
		res.contentType('application/json');

		var collection = req.body.collection;
		var id         = req.body.id;
		var last       = collection.length-1;

		for(x in collection){
			var value = parseInt(collection[x]);

				List_location.count({list_id:id,location_id:value}).done(function(e,count,value,x,last){
						if( count == 0 ){
							List_location.create({list_id:id,location_id:value}).done(function(err, list, x,last){

								if( x == last){
										return res.json({code:0,msg:"List update:"});
								}

							}.bindAll(x,last));
						}else{
							if( x == last){
										return res.json({code:0,msg:"List update:"});
								}
						}

				}.bindAll(value,x,last));
		}

	},

	/**
	 * Action blueprints:
	 *    `/all/index`
	 *    `/all`
	 */
	all: function (req, res) {

		res.contentType('application/json');
		var role = parseInt(req.session.user.role);
		var id   = req.query.provider;
		var src  = [1,2].indexOf(role) > -1 ? 'I.src as src' : 'I.src_public as src' ;
		var sql  = 'SELECT L.list_id as  id, L.supplier_id, I.name, '+src+'  FROM auditor.location L LEFT JOIN list I on ( I.id = L.list_id ) WHERE L.supplier_id = '+id+' GROUP BY L.list_id';
		var sql  = 'SELECT L.id, L.name  FROM list L ';
		List.query(sql,function(e,lists){
				 return res.json({code:0,msg:"List created:",data:lists});
		});
	},

	 /**
	 * Action blueprints:
	 *    `/all/index`
	 *    `/all`
	 */
	mobile: function (req, res) {

		res.contentType('application/json');
		List.query('SELECT name, id, ( select count(*) from list_mobile where list_id = L.id ) as count FROM list L',function(e,lists){
				 return res.json({code:0,msg:"List created:",data:lists}); //console.log(r)
		});
	},





};
