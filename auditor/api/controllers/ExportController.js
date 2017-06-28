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


function slugify(s) {
  var _slugify_strip_re = /[^\w\s-]/g;
  var _slugify_hyphenate_re = /[-\s]+/g;
  s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
  s = s.replace(_slugify_hyphenate_re, '-');
  s = s.replace('_', '-');
  return s;
}

function getValues(o){

	var data = [];
	for( x in o){
		var v = o[x];
		if( typeof(v) != 'function' )
			data.push(v);
	}
	return data;
}

function csvexport(data,name,fields,role,cb) {

	var csv = require('fast-csv');
	var fs  = require('fs');
	var ws 	= fs.createWriteStream('assets/uploads/csv/'+name);
	var cs 	= csv.createWriteStream({headers: false});

	ws.on("finish", function(){
	  cb()
	});

	cs.pipe(ws);

	var count = 0;
	async.each(data, function(row, callback){

		//Default delete to export
		delete row.parse;
		delete row.phase;
		delete row.subtype;
		delete row.account_id;
		delete row.campaing_id;
		delete row.supplier_id;
		delete row.segment;
		delete row.list_id;
		delete row._typeCast;
		delete row.createdAt;
		delete row.updatedAt;
		delete row.create;
		delete row.release;
		delete row.start;
		delete row.active;

		//Role exports
		if( role != 1 || role != 2 ){
			delete row.ammount;
			delete row.price;
			delete row.tax;
			delete row.contra;
			delete row.total;
		}

		var fields = {
			  id:'ID'
			  ,uuid: "Codigo Interno"
			  ,name: 'Proveedor'
			  ,code: 'Codigo'
			  ,license_plate: 'Placa'
			  ,numid: 'Permiso'
			  ,coords: 'Coordenadas'
			  ,lng: 'Longitud'
			  ,lat: 'Latitud'
			  ,light: 'Luz'
			  ,price: 'Precio'
			  ,total: 'Total'
			  ,tax: 'IVA'
			  ,ammount: 'Cantidad'
			  ,contra: 'Contra'
			  ,base: 'Base'
			  ,height: 'Altura'
			  ,size: 'Área'
			  ,dimensions: 'Dimensiones'
			  ,material: 'Material'
			  ,street: 'Calle'
			  ,neighbor: 'Colonia'
			  ,ref_street_1: 'Calle de Referencia 1'
			  ,ref_street_2: 'Calle de Referencia 2'
			  ,zip: 'Codigo Postal'
			  ,city: 'Municipio/Delegacion'
			  ,state: 'Estado'
			  ,type: 'Tipo'
			  ,view_type: 'Tipo de vista'
			  ,line: 'Linea'
			  ,route: 'Ruta'
			  ,sector: 'Sector'
			  ,station: 'Estacion'
			  ,place: 'Lugar'
			  ,format: 'Formato'
			  ,tren: 'Tren'
			  ,vagon: 'Vagon'
			  ,structure: 'Estructura'
			  ,comments: 'Comentarios'
			  ,version: 'Version'
			  ,qty: 'Cantidad contratada'
			  }

			var headers = [];
			var nrow    = {};
			for( x in fields ){
				console.log( row[x] );
				nrow[x] = row[x];
				headers.push( fields[x] );
			}



		if ( count === 0 ) {
			cs.write(headers);
		}

		var row = getValues(nrow);
		cs.write(row);
		count++;

		if ( count === data.length ) {
			cs.end();
		}
		callback();

	});

}

function uploadFileToRackspace(tmp,name,cb,remove){

	console.log(tmp);
	var d = require('domain').create();

	d.on('error', function(er) {
		console.log('error al subir un archivo.');
		cb(name,true);
	});

	var remove = typeof remove == 'undefined' ? false : true;
	var fs     = require("fs");
	var cloudfiles = require('cloudfiles');

	var client = cloudfiles.createClient(sails.config.cloudfiles.config);
		 client.setAuth(d.bind(function() {
			client.createContainer(sails.config.cloudfiles.container[process.env.NODE_ENV],d.bind(function (err, container){
				if(err){
					console.log(err);
				}else{
				    client.addFile(sails.config.cloudfiles.container[process.env.NODE_ENV], { remote: name, local: tmp }, function (err, uploaded) {

				    	if(typeof cb != 'undefined')
				    	cb(name,uploaded);
				    	if(remove){
				    		fs.unlinkSync(tmp);
				    	}
				    });
			    }
			}));
		}));
}

module.exports = {

	/**
	 * Action blueprints:
	 *    `/status/index`
	 *    `/status`
	 */
	index: function (req, res) {
		// Send a JSON response
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
		var user      = parseInt(req.session.user.id);
		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = req.session.user.supplier_id;
		var skip = rows * ( page - 1 );

		Vwfile.count({status:{not:6},type:'list',user_id:user}).done(function(e,c){
			Vwfile.find({status:{not:6},type:'list',user_id:user}).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
						var totalpages = Math.ceil(c / rows )
						return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
			});
		});

	},

	/**
	 * Action blueprints:
	 *    `/status/table`
	 */
	list : function(req, res){
		res.contentType('application/json');
		//Variables de session
		var user     = parseInt(req.session.user.id);
		var role     = parseInt(req.session.user.role);

		//Variables del filtro
		var list 	 = parseInt(req.query.list);
		//Si el usuario no es Admin solo puede ver los suppliers que tiene asignados.
		var supplier = typeof(req.query.provider) != 'undefined' && req.query.provider == '*' ?  0 : parseInt(req.query.provider) ;
		var type 	 = req.query.type;
		var state 	 = req.query.state;


		var permisions_providers = req.session.permisions.providers;
		var permisions_types = req.session.permisions.types;

		var where    = {list_id:list};

			if (permisions_providers.length > 0 ) {
				where.supplier_id =  permisions_providers;
			}

			if (permisions_types.length > 0 ) {
				where.type =  permisions_types;
			}

			if( typeof(req.query.provider) != 'undefined' && req.query.provider != '*'  ){
				where.supplier_id = supplier
			}

			if( [1, 2, 3].indexOf(role) == -1 ){
				if( typeof(req.query.provider) != 'undefined' && req.query.provider != '*'  ){
					where.supplier_id = req.session.user.supplier_id;
				}
			}

			if( typeof(req.query.type) != 'undefined' && req.query.type != '*'  ){
					where.type = type;
			}

			if( typeof(req.query.state) != 'undefined' && req.query.state != '*'  ){
					where.state = state;
			}

			if (!supplier){
					supplier = -1;
			}





			console.log("Export List Where params");
			console.log(supplier);


		List.findOne(list).done(function(e,l){
				var filename = 'list-'+slugify(l.name) + (new Date().getTime()) +'.csv';
				var data = {
				 src:filename,
				 user_id:user,
				 supplier_id:supplier,
				 status:0,
				 tmp:'',
				 qty:3,
				 type:'list',
				 comment:'Proceso registrado'
				}


				console.log("ExportController::list => 1 List.findOne ");
				// Register File --------------------------------------------
				File.create(data).done(function(e,r){

					console.log("ExportController::list => 2 File.create");

					if(e){
						console.log(e);
						res.json({code:100,msg:'El Archivo no pudo registrarse correctamente'});
					}else{
						if(r){
							File.findOne(r.id).done(function(e,f){

								console.log("ExportController::list => 3 File.findOne");

								f.status = 1;
								f.comment = 'Leyendo datos de la base de datos'
								f.save(function(e,f){

									console.log("ExportController::list => 4 f.save");

									// Vwlocations --------------------------------------------
									Vwlocations.find(where).done(function(e,l){

										console.log("ExportController::list => 5 Vwlocations.find");
										console.log(where);



										// csvexport --------------------------------------------
										csvexport(l,filename,[],role,function(){

											console.log("ExportController::list => 6 csvexport");

											var tmp = 'assets/uploads/csv/'+filename;
											File.findOne(r.id).done(function(e,f){

												console.log("ExportController::list => 7 File.findOne");

												f.status = 2;
												f.comment = 'Registrando archivo en CDN'
												f.save(function(e,f){

													console.log("ExportController::list => 8 f.save");

													// uploadFileToRackspace --------------------------------------------
													uploadFileToRackspace(tmp,filename,function(){

														console.log("ExportController::list => 9 uploadFileToRackspace");

														File.findOne(r.id).done(function(e,f){

															console.log("ExportController::list => 10 File.findOne");

															f.status = 3;
															f.comment = 'Proceso finalizado'
															f.save(function(e,f){
																console.log('ExportController::list => 11 finished');
															});
															//--------------------------------------------
														});
														//--------------------------------------------
													},true);
													//--------------------------------------------
												});
												//--------------------------------------------
											});
											//--------------------------------------------
										});
										//--------------------------------------------
									});
									//--------------------------------------------
								})
								//--------------------------------------------
							});
							res.json({code:0,msg:'El proceso ha sido registrado correctamente'});
						}else{
							res.json({code:100,msg:'El Archivo no pudo registrarse correctamente'});
						}
					}
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
