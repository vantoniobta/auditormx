/**
 * LocationsController
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

	var csv 	  = require('csv');
	var fs        = require('fs');
	var path      = require("path");
	var crypto    = require("crypto");
	var mkdirp    = require('mkdirp');
 	var im   	  = require('imagemagick');
	var async	  = require('async');
	//var permisos  = require('../service/permisos.js');


	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	var getTheFind = function(supplier,listid,data,mode){

		var find = {supplier_id:parseInt(supplier),list_id:parseInt(listid)};

		if( mode == 'location' ){
			find.code = data.code;
		}

		if( mode == 'mobile' ){
			if( data.code != '' ){
				find.code = data.code;
			}
			if( data.license_plate != '' ){
				find.license_plate = data.license_plate;
			}
			if( data.numid != '' ){
				find.numid = data.numid;
			}
		}
		return find;
	}
	var moneyformat = function(str){

			var str = String(str);
			if( str.length > 0 ){
				str = str.replace('$','');
				str = str.replace(',','');
				return str == 'undefined' ? null : str;
			}

			return null;

	}

	var excelToMysql = function(str){
		var str   = str.replace(/\//g,'-');
		var d     = str.split('-');

		if( typeof(d[2]) == 'string' && typeof(d[1]) == 'string' && typeof(d[0]) == 'string' ){

			var day   = d[0].length == 1 ? '0'+d[0]: d[0];
			var month = d[1].length == 1 ? '0'+d[1]: d[1];
			var year  = d[2].length == 2 ? '20'+d[2] : d[2];
			return new Date(d[2],month,day,0,0,0);

		}else{
			return '';
		}
	}

	function dateValidation(date_val){
				var matches = /(\d{2})[-\/](\d{2})[-\/](\d{4})/.exec(date_val);

				if (matches == null){
						return  '';
				 }else{
					return date_vall
				 }
	}

	function cleanSizes(str){
		var str = String(str);
		var str = str.replace(/cm/g,'');
		return str;
	}

	var get_settings = function(){
		Settings.findOne().done(function(error, data){
			if (data) return data
		})
	}

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


function slugify(s) {
  var _slugify_strip_re = /[^\w\s-]/g;
  var _slugify_hyphenate_re = /[-\s]+/g;
  s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
  s = s.replace(_slugify_hyphenate_re, '-');
  s = s.replace('_', '-');
  return s;
}


function cleaningCSV(tmp,src,cb){

	var path    = require("path");
	var tmpdir 	 = path.resolve( __dirname +'/../../assets/uploads/csv/' );

	csv().from(tmp, { delimiter: ',', escape: '"' })
	.to.path( tmpdir+'/'+src)
	.transform( function(row){

		row.splice(5,1);
		row.splice(5,1);
		row.splice(5,1);
		row.splice(5,1);
		row.splice(5,1);

		return row;
	})
	.to.array( function(data){
		var tmp = tmpdir+'/'+src;
		cb(tmp,src);

	}).on('error', function(error){
		console.log(error);
	}).on('end', function(o){

	});
}

_thumbnails = function(status,filename,tmp,client,cb){

	var route  = path.resolve( __dirname +'/../../assets/uploads/statuss/'+status );
	var nmfile = status+'_tmb_'+filename;
	var nfile  = route+'/'+nmfile;

	try{
		console.log(nfile);
		//------------------------------------------------------------------------
		im.resize({
		  srcPath: tmp,
		  dstPath: nfile,
		  width: 100,
		  height: 70,
		  quality: 0.80,
		}, function(err, stdout, stderr){
			if(err){
				console.log('errors');
				cb();
			}else{
				client.addFile(sails.config.cloudfiles.container[process.env.NODE_ENV], { remote: nmfile, local: tmp }, function (err, uploaded) {
			    	cb();
			 	});
			}
		});
		//-----------------------------------------------------------------------

	}catch(err){
		console.log(err);
		cb();
	}

}
_optimze = function(status,client,tmp,filename,cb){

	var route  = path.resolve( __dirname +'/../../assets/uploads/statuss/'+status );
	var nmfile = status+'_'+filename;
	var nfile  = route+'/'+nmfile;
	try{
		im.identify(tmp, function(err, metadata){
			if(err){
				cb(err,null);
			}else{
				//------------------------------------------------------------------------
				im.resize({
				  srcPath: tmp,
				  dstPath: nfile,
				  width:  metadata.width,
				  height: metadata.height,
				  quality: 0.80,
				}, function(err, stdout, stderr){
					if(err){
						console.log(err);
						cb();
					}else{
						client.addFile(sails.config.cloudfiles.container[process.env.NODE_ENV], { remote: nmfile, local: tmp }, function (err, uploaded) {
					    	cb();
					 	});
					}
				});
				//-----------------------------------------------------------------------
			}
			//-----------------------------------------------------------------------
		});
		//-----------------------------------------------------------------------

	}catch(err){
		console.log(err);
		cb(err,null);
	}
}

_uploadToCloud = function(thenames,status,files,idx,total,client,cb){

	var idx = parseInt(idx) + 1;
	if( idx < total ){

		console.log(idx,' --> ',total);
		var tmp   		= files[idx].path;
		var rname  		= files[idx].originalFilename;
		var ext    		= rname.split('.').slice(-1)[0];
		var filename   	= String( crypto.randomBytes(16).toString('hex')+'.'+ext).toLowerCase();

		thenames.push(filename);
		console.log(thenames);

		_optimze(status,client,tmp,filename,function(){
			_thumbnails(status,filename,tmp,client,function(e){
				_uploadToCloud(thenames,status,files,idx,total,client,cb);
			});
		});

	}else{
		console.log('finalizado upload')
		cb(thenames.toString());
	}
}

_connectcloud = function (cb){

	var d = require('domain').create();
	var cloudfiles = require('cloudfiles');

	d.on('error', function(err) {
		cb(err,null);
	});

	var client = cloudfiles.createClient(sails.config.cloudfiles.config);
		client.setAuth(d.bind(function() {
			client.createContainer(sails.config.cloudfiles.container[process.env.NODE_ENV],d.bind(function (err, container){
				if(err){
					console.log(err,null);
				}else{
					//---------------------------------------
						cb(err,client);
					//---------------------------------------
			    }
			}));
		}));

}

_removedir = function (path) {

  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


function uploadFileToRackspace(tmp,name,cb,remove){

	var d = require('domain').create();

	d.on('error', function(er) {
		console.log('error al subir un archivo.');
		cb(name,true);
	});

	var remove = typeof remove == 'undefined' ? false : true;
	var fs     = require("fs");
	var cloudfiles = require('cloudfiles');
	var config = {
	    auth : {
	      username: 'pinochoproject',
	      apiKey: '48a104f4f5f21aef36e22c86ecba0e22'
	    }
	};

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



function toCreate(action,list,csv,indx,total,supplier,cb){

		var csv      = csv;
		var indx     = parseInt(indx) + 1;
		var total    = total;
		var supplier = supplier;

		if( indx < total ){

		//console.log(indx,total, (indx < total) );
		//console.log('--------------------------------------');

			var row  = csv[indx];
			var mode = String(row[0]).toLowerCase();

			var base = {
				location: {
				'segment':''
				,'type':''
				,'code':''
				,'version':''
				,'light':''
				,'price':''
				,'tax':''
				,'total':''
				,'contra':''
				,'ammount':''
				,'base':''
				,'height':''
				,'size':''
				,'dimensions':''
				,'material':''
				,'street':''
				,'neighbor':''
				,'ref_street_1':''
				,'ref_street_2':''
				,'zip':''
				,'city':''
				,'state':''
				,'view_type':''
				,'start':''
				,'release':''
				,'delivery':''
				,'comments':''
			},
			mobile : {
			  'segment':''
	          ,'type':''
	          ,'code':''
	          ,'license_plate':''
	          ,'numid':''
	          ,'version':''
	          ,'line':''
	          ,'route':''
	          ,'sector':''
	          ,'station':''
	          ,'tren':''
	          ,'vagon':''
	          ,'place':''
	          ,'city':''
	          ,'state':''
	          ,'structure':''
	          ,'base':''
	          ,'height':''
	          ,'dimensions':''
	          ,'format':''
	          ,'tax':0
	          ,'price':0
	          ,'total':0
	          ,'start':''
	          ,'release':''
	          ,'comments':''
	          ,'qty':1
	        }};


	        var data = base[mode];
	       if( typeof(data) != 'undefined' ){

				var i    = 0;
				for( var x in data){
					if( typeof(row[i]) == 'string' ){
						str = row[i].trim();
						// var iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE'); // console.log(   );
					}else{
						str = typeof(row[i]) == 'undefined ' ? data[x] : str;
					}
					data[x] = str;
					i++;
				}

				//data validations -----------------------
				data.supplier_id  = supplier;
				data.campaing_id  = 1;
				data.list_id	  = list;
				data.account_id	  = 1;
				data.phase  	  = 2;
				data.status 	  = 0;
				data.active 	  = 0;
				data.base         = cleanSizes(data.base);
				data.height       = cleanSizes(data.height);

				var size = parseFloat(data.base) * parseFloat(data.height);


				// console.log(data.type,data.qty, isNumber(data.qty));

				data.size  	  	  = isNaN(size) ? null : size;
				data.dimensions   = data.base +'x'+ data.height;
				data.qty		  = isNumber(data.qty) ? parseInt(data.qty) : 1 ;
				//------------------------------------------------

					console.log(typeof(data.release));

				if(  data.release  == '' ){
					data.release = null;
				}else{
					 var release = excelToMysql(data.release);

					 if( release == ''){
						data.release = null;
					 }else{
						data.release = release;
					 }
				}

				//------------------------------------------------

				//console.log(data.start);
				if(  data.start  == '' ){
					data.start = null ;
				}else{

					var start = excelToMysql(data.start);
					if( start == ''){
						data.start = null ;
					}else{
						data.start = start;
					}
				}

				//------------------------------------------------

				 //price
				data.price 		= moneyformat(data.price) ;
				data.ammount 	= moneyformat(data.ammount);
				data.tax 		= moneyformat(data.tax);
				data.total 		= moneyformat(data.total);
				data.contra 	= moneyformat(data.contra);


				// console.log(data);

				if( action == 'create' ){

					Location.create(data).done(function(err,doc,indx,toCreate) {
						// Error handling
						if (err) {
							return cb({code:100,msg:'Error al crear un registro de la lista',field:err.ValidationError});
						}else{
							toCreate(action,list,csv,indx,total,supplier,cb);
						}

					}.bindAll(indx,toCreate));
				}else{

					var find = getTheFind(supplier,list,data,mode);
					//console.log(find);
					//console.log('================================================'.cyan)
					Location.update(find,data,function(err, doc, indx,toCreate){
						// Error handling
						if (err) {
							return cb({code:100,msg:'Error al crear un registro de la lista',field:err.ValidationError});
						}else{
							if( doc.length > 0 ){
								console.log('update object');
								toCreate(action,list,csv,indx,total,supplier,cb);
							}else{
								console.log('create object');
								Location.create(data).done(function(err,doc,indx,toCreate) {
									// Error handling
									if (err) {
										console.log(data);
										return cb({code:100,msg:'Error al crear un registro de la lista',field:err.ValidationError});
									}else{
										toCreate(action,list,csv,indx,total,supplier,cb);
									}
								}.bindAll(indx,toCreate));

							}
						}
					}.bindAll(indx,toCreate));
				}

			}else{
				return cb({code:100,msg:'Error con los datos del del archivo, válidar datos antes de subir'});
			}

		//-------------------------------------------------------------------------------------

		}else{
			console.log(indx,total, (indx < total) );
			console.log('--------------------------------------');
			console.log('finished');
			return cb({code:0,msg:'La lista fué cargada correctamente'});
		}

}


function get_providers_from_user_id (user_id, callback){

	var providers = [];

	User_Provider.find({'user_id':user_id}).done(function(err, result){

		for (p in result){
			//console.log(result[p]);
			providers.push(result[p].provider_id);
		}

		callback(null, providers);
	});



}

function get_types_from_user_id (user_id, callback){

	//console.log("user_id en typos" + user_id);

	var types = [];

	User_Type.find({'user_id':user_id}).done(function(err, result){

		for (p in result){
			//console.log(result[p]);
			types.push(result[p].type);
		}

		callback(null, types);
	});



}


module.exports = {

	/**
	 * Action blueprints:
	 *    `/locations/index`
	 *    `/locations`
	 */
	index: function (req, res) {

		// Send a JSON response
		// console.log(req.session.user.id)
		res.view();
	},

	 /**
	 * Action blueprints:
	 *    `/locations/index`
	 *    `/locations`
	 */
	view: function (req, res) {

		if( req.param('id') ){
			var id = req.param('id');
			Location.findOne(id).done(function(e,doc){
				if(doc){
					return res.view({id:doc.id,uuid:doc.uuid});
				}else{
					res.redirect('/locations');
				}
			})
		}else{
			 res.redirect('/locations');
		}
	},

	/**
	 * Action blueprints:
	 *    `/campaings/get`
	 */
	get: function (req, res) {
		var id = req.query.id;
		res.header("Content-Type", "application/json;");
		Location.find(id).done(function(err,doc){
				if( doc.length > 0){
				res.json(doc[0]);
			}else{
				res.json({'error':0,'msg':'Cant find this provider id'});
			}
		});
	},


	table: function (req, res) {

		res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = req.session.user.supplier_id;
		var skip 	  = rows * ( page - 1 );
		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;
		var state     = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
		var provider  = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
		var type  = typeof(req.query.type) == 'undefined' ? null : req.query.type;

		var permisions_providers = req.session.permisions.providers;
		var permisions_types = req.session.permisions.types;


		var where      = {};


		if (permisions_providers.length > 0 ) {
			where.supplier_id =  permisions_providers;
		}

		if (permisions_types.length > 0 ) {
			where.type =  permisions_types;
		}




			if( list && list != '*' ){
				where.list_id = list;
			}
			if( keyword ){
				var keyword = keyword.trim();
				where.or = [
				{ like: {code: '%'+keyword+'%'} },
				{ like: {license_plate: '%'+keyword+'%'} },
				{ like: {numid: '%'+keyword+'%'} }]
				;
			}

			if( state && state != '*'){
					where.state = state;
			}


			if( state && state != '*'){
					where.state = state;
			}
			if( provider && provider != '*'){
					where.supplier_id = provider;
			}
			if( type && type != '*'){
				where.type = type;
			}


			console.log("Location Table Where params");
			console.log(where);

			//Root, Administrador, Auditor
			if( [1,2,3].indexOf(role) > -1   ){
				console.log("Es Root, Adminitrador, o Auditor RoleID: "+ role);
				Vwlocations.count(where).done(function(e,c){
					Vwlocations.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
						var totalpages = Math.ceil( c/rows )
						return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows,count:c}});
					});
				});
			}

			//Si no es Root, Administrador, Auditor
			if( [1,2,3].indexOf(role) == -1 ){
				console.log("NO es Root, Adminitrador, o Auditor RoleID: "+ role);
				where.supplier_id = supplier;
				console.log(where);
				Vwlocations.count(where).done(function(e,c){
					Vwlocations.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
						var totalpages = Math.ceil(c / rows )
						return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows,count:c}});
					});
				});
			}



	},

	status: function (req, res) {

		res.contentType('application/json');

		var id        = req.query.id;
		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = req.session.user.supplier_id;

		var skip = rows * ( page - 1 );

			var where      = { uuid_object: id };
			var wherecount = {}

			if( keyword ){
					where.or = [{uuid:keyword}];
			}

		Vwfullstatus.count(where).done(function(e,c){
			Vwfullstatus.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
				var totalpages = Math.ceil(c / rows )
				for(i in r ) {
					r[i].ssuser_id = req.session.user.id
					r[i].role = req.session.user.role

				}
				return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
			});
		});
	},

	laststatus: function (req, res) {
		res.contentType('application/json');

		var fs      = require("fs");
		var path    = require("path");
		var mkdirp  = require('mkdirp');
		var isUtf8  = require('is-utf8');
		var id      = req.query.id;

		Status.findOne({uuid_object:id}).sort('id DESC').done(function(e,r){
		// console.log(e||r)
			if( e ){
				return res.send({code:100,msg:'No Status exist for this item '});
			}else{

				if(typeof(r) != 'undefined' ) {
					var data = '';
					if( typeof(r.snapshots) == 'string' ){
						var data =  r.snapshots.split(',');
					}
					return res.send({code:0,msg:'ok',dir:r.id, data: data});
				}else{
					return res.send({code:100,msg:'No Status exist for this item '});
				}
			}
		});
	},

	getstatus: function (req, res) {
		res.header("Content-Type", "application/json; charset=utf-8");

		var fs    = require("fs");
		var path  = require("path");
		var id    = req.query.id;

		Status.findOne(id).sort('id DESC').done(function(e,r){
			var dir   = path.resolve( __dirname +'/../../assets/uploads/statuss/'+ r.key );
			var wpath = '/uploads/'+r.key;
			fs.readdir(dir, function (err, files) {
				if (!err) {
					for( x in files){
							files[x] = wpath+'/'+files[x];
							console.log('------------------------------------------------');
					}
					return res.send({code:0,msg:'ok',data:r,files:files});
				}else{
					return res.send({code:100,msg:'Error to read this directory',data:wpath});
				}
			});
		});
	},

	/* upload
	------------------------------------------------------------ */
	upload : function(req, res){

			var log      = require('../../utilities').logs(Logs)
			var fs       = require('fs');
			var csv      = require('csv');
		 	var path     = require("path");
		 	var campaing = 6;

		 	//-- User
		 	var user = req.session.user.id;

			//-- Supplier id
			var supplier  = typeof(req.body.supplier_id) != 'undefined'  ? req.body.supplier_id : req.session.user.supplier_id;

			//-- List id
			var listid  = typeof(req.body.listid) != 'undefined' && req.body.listid != 0  ? req.body.listid : false;

			//-- Mode
			var action  = req.body.mode;

			var theDate = new Date();
			var tDate = theDate.getFullYear()+''+theDate.getMonth()+''+theDate.getDate();
			var tmp   = req.files.csvfile.path
			var oname = req.files.csvfile.originalFilename;
			var ext   = oname.split('.').slice(-1)[0];
			var role  = parseInt(req.session.user.role);


			Provider.findOne(supplier).done(function(e,p){

				if(typeof(p) != 'undefined' ){

					var cname = p.nickname != '' ? p.nickname : p.name;
					var cname = cname.split(' ');
					var cname = cname.length > 1 ? cname[0] +' '+ cname[1] : cname[0] ;
					var name  = cname+' '+tDate;
					var name  = slugify(name);
					var src   = new Date().getTime()+'-'+name+'.'+ ext;
					var psrc  = name+'.'+ ext;

					csv().from(tmp, { delimiter: ',', escape: '"' })
						.to.array( function(data){

						//------------------------------------------------------------------

						if( action == 'create') {


								toCreate(action,listid,data,0,data.length,supplier,function(response){

									if(response.code != 0 ){

										List.destroy(l.id).done(function(e,r){
											Location.destroy({list_id:listid}).done(function(e,r){
												console.log('List && Locations in List removed');
												return res.json(response);
											})
										});
									}else{

									log.create('Se cargó el listado' + src, req.session.user.id )
										//-- Upload csv file to rackspace
										uploadFileToRackspace(tmp,src,function(name,uploaded){
											if(uploaded){
												//-- Remove prices from csv
												cleaningCSV(tmp,psrc,function(tmp,psrc,listid,response){
													//-- Upload csv file to rackspace
													uploadFileToRackspace(tmp,psrc,function(name,uploaded){
														if(uploaded){
															console.log('Archivo subir a rackspace');
															response.list_id = listid;
															return res.json(response);
														}
													});
													//----------------
												}.bindAll(listid,response));
											}else{
												return res.json(response);
											}
											//------------------------------------
										});
										//------------------------------------
									}
									//------------------------------------
								});

						}

						// ------------ UPDATE
						if( action == 'update' ){


							toCreate(action,listid,data,0,data.length,supplier,function(response){
								if(response.code == 0 ){
									console.log('Listado actualizado',name)
									//---------------------------------------------------------------------------
									log.create('Actualizó el listado' + src, req.session.user.id );
										//-- Upload csv file to rackspace
										uploadFileToRackspace(tmp,src,function(name,uploaded){
											if(uploaded){
												console.log('First File uploaded',src)
												//-- Remove prices from csv
												cleaningCSV(tmp,psrc,function(tmp,psrc,listid,response){
													//-- Upload csv file to rackspace
													uploadFileToRackspace(tmp,psrc,function(name,uploaded){
														if(uploaded){
															console.log('Second File uploaded',psrc)
															List.findOne(listid).done(function(e,l){
																l.update_by = user;
																l.save(function(){

																})
															});
															console.log('Archivo subir a rackspace');
															response.list_id = listid;
															return res.json(response);
														}
													});
													//---------------
												}.bindAll(listid,response));
												//---------------
											}else{
												return res.json(response);
											}
										//------------------
										}.bindAll(listid,response));
									//---------------------------------------------------------------------------
								}else{
									return res.json(response);
								}
								//----------------------------------
							});
							//------------------------------------------
						}
						//------------------------------------------------------------------------------------------------------------

					}).on('error', function(error){
						return res.send({code:100,msg:'Error to upload this file',data:wpath});
					}).on('end', function(o){

					});

				}else{

					return res.send({code:100,msg:'Problemas al intentar registrar el listado!, favor de intentar nuevamente'});
				}
			});


	},

	statetable : function(req,res){
		 Location.query('SELECT state FROM location GROUP BY state',function(e,r){
				 return res.send(r); //console.log(r)
		 });
	},

	migrate :function(req,res){

	},

	csv: function(req,res){
		var list_id = req.body.list_id

		List_location.find( {list_id : list_id} ).done(function(err,docs){
			if(err) return callback(err, [])

			if( docs.length > 0){
				csv()
					.from(docs)
					.to.path(__dirname+'/sample.out')
					.transform( function(row){
						row.unshift(row.pop());
						return row;
					})
					.on('record', function(row,index){
						console.log('#'+index+' '+JSON.stringify(row));
					})
					.on('end', function(count){
						console.log('Number of lines: '+count);
					})
					.on('error', function(error){
						console.log(error.message);
					});

			}else{

			}
		});
	},

	report :function(req,res){

		 var fs      = require('fs');
		 var path    = require("path");
		 var crypto  = require("crypto");
		 var mkdirp  = require('mkdirp');
	 	 var im   	 = require('imagemagick');
		 var user    = req.session.user.id;
		 var id      = req.body.report.id;
		 var type    = req.body.report.type;
		 var message = req.body.report.message;
		 var stamp   = new Date().getTime();


			//-------------------------------------------------------------------------------------------------------
			var data = {
					uuid_object : id,
					user_id : user,
					message : message,
					type:type,
					status:type,
					stamp : stamp,
			}

			Status.create(data).done(function(err,s){

				var dir 	 = path.resolve( __dirname +'/../../assets/uploads/statuss/'+ s.id );
				var thenames = [];
				mkdirp(dir, function(err) {

					if(!err){
					//-------------------------------------------------------------------------------------------------------
						if( Object.prototype.toString.call( req.files.images_upload ) === '[object Array]' ) {
								var files  = req.files.images_upload;
								var status = s.id;

								//---------------------------------------------------------------
								_connectcloud(function(err,client){
									//---------------------------------------------------------------
									_uploadToCloud(thenames,status,files,-1,files.length,client,function(thenames){

										//---------------------------------------------------------------
										Status.findOne(status).done(function(e,r){
											r.snapshots = thenames;
											r.save(function(){
												res.send({code:0,msg:'Los archivos subieron correctamente!'});
												_removedir(dir);
											})
										});
										//---------------------------------------------------------------
									});
									//---------------------------------------------------------------
								});
								//---------------------------------------------------------------
						}else{

								var files   = [req.files.images_upload];
								var status  = s.id;

								//---------------------------------------------------------------
								_connectcloud(function(err,client){
									//---------------------------------------------------------------
									_uploadToCloud(thenames,status,files,-1,files.length,client,function(thenames){

										//---------------------------------------------------------------
										Status.findOne(status).done(function(e,r){
											r.snapshots = thenames;
											r.save(function(){
												res.send({code:0,msg:'Los archivos subieron correctamente!'});
												_removedir(dir);
											})
										});
										//---------------------------------------------------------------
									});
									//---------------------------------------------------------------
								});
								//---------------------------------------------------------------


							// var tmp 	= req.files.images_upload.path;
							// var rname  = req.files.images_upload.originalFilename;
							// var ext    = rname.split('.').slice(-1)[0];
							// var name   = crypto.randomBytes(16).toString('hex')+'.'+ext;


							// 	//-------------------------------------------------------------------------------------------------------

							// 		fs.readFile(tmp, function (err, data,name,rname,dir) {

							// 			var newPath = dir +'/'+ name;

							// 			 fs.writeFile(newPath, data, function (err) {
							// 								// console.log(rname, newPath ,(err||'saved'));
							// 							fs.unlinkSync(tmp);

							// 							Status.findOne(s.id).done(function(e,r){
							// 					r.snapshots = name;
							// 					r.save(function(){
							// 						res.send({code:0,msg:'Los archivos subieron correctamente!'});
							// 					})

							// 			});

							// 							console.log((err||'saved'));
							// 							console.log( '------------------------------------------------------------------------------------' );

							// 								 res.send({code:0,msg:'Los archivos subieron correctamente!'});
							// 						});

							// 		}.bindAll(name,rname,dir));
								//-------------------------------------------------------------------------------------------------------


						}
							 //-------------------------------------------------------------------------------------------------------
					}else{
						res.send({code:100,msg:'error al crear el directorio'});
					}
				});
				//-------------------------------------------------------------------------------------------------------
			});
		//-------------------------------------------------------------------------------------------------------
	} ,
	statusdelete: function (req, res) {

		if( req.param('uuid') ){

			var status_uuid = req.param('uuid');
			var ssuser_id = req.session.user.id

			var qrs = " SELECT uuid \
									FROM status \
									WHERE uuid='" + status_uuid + "'";
			Status.query(qrs, function(error, docs){
				if(error){
					return res.json({'code':200,'msg':'Problemas en la Base de Datos, intente de nuevo más tarde'})
				}else if (docs.length > 0 ){

					Status.destroy({uuid: docs[0].uuid }, function(error){
						if(!error) return res.json({'code':0,'msg':'Estatus Eliminando'});
						else return res.json({'code':0,'msg':'Estatus no eliminado'});
					})
				}else{
					return res.json({'code':200,'msg':'No tienes los permisos para eliminar este estatus'})
				}
			})
		}else{
			return res.json({'code':200,'msg':'No existe el status indicado'})
		}

	},
	/**
	 * Action blueprints:
	 *    `/locations/types`
	 */
	types: function(req, res){
		res.contentType('application/json');
		var provider  = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;
		var where = [];

		if( provider && provider != '*' && list != 'null'){
			where.push(" supplier_id = '" + provider +"'");
		}

		if( list && list != '*' && list != 'null' ){
			where.push(" list_id = '" + list +"'");
		}


		str_where  = where.join(" AND ").trim();

		if (str_where){
			where = "where "+ str_where;
		}
		else{
			where = '';
		}

		var str_SQL = "select distinct type as id, type as name from location " + where + " order by type";

		console.log(str_SQL);

		Provider.query( str_SQL, function(err, docs) {
			if (err) {
				console.log(err);

				res.json({code:100,msg:'Error en la ocnsulta'});
			}else{
				res.json({code:0,msg:'ok',data:docs});
			}
		});
	},
	/**
	 * Action blueprints:
	 *    `/locations/typesuser`
	 */
	typesuser: function(req, res){
		res.contentType('application/json');
		var provider  = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;
		var where = [];

		if( provider && provider != '*' && list != 'null'){
			where.push(" supplier_id = '" + provider +"'");
		}
		else {
			if (req.session.permisions.providers.length > 0){
				where.push(" supplier_id in ("+ req.session.permisions.providers.join(',') +") ")
			}
		}

		if (req.session.permisions.types.length > 0){
			where.push(" type in ('"+ req.session.permisions.types.join("','") +"') ")
		}

		if( list && list != '*' && list != 'null' ){
			where.push(" list_id = '" + list +"'");
		}


		str_where  = where.join(" AND ").trim();

		if (str_where){
			where = "where "+ str_where;
		}
		else{
			where = '';
		}

		var str_SQL = "select distinct type as id, type as name from location " + where + " order by type";

		console.log(str_SQL);

		Provider.query( str_SQL, function(err, docs) {
			if (err) {
				console.log(err);

				res.json({code:100,msg:'Error en la ocnsulta'});
			}else{
				res.json({code:0,msg:'ok',data:docs});
			}
		});
	},
	/**
	 * Action blueprints:
	 *    `/locations/types`
	 */
	state: function(req, res){
		res.contentType('application/json');
		var provider  = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;
		var type      = typeof(req.query.type) == 'undefined' ? null : req.query.type;
		var where = [];

		if( provider && provider != '*' && list != 'null'){
			where.push(" supplier_id = '" + provider +"'");
		}

		if( list && list != '*' && list != 'null' ){
			where.push(" list_id = '" + list +"'");
		}

		if( type && type != '*' && type != 'null' ){
			where.push(" type = '" + type +"'");
		}

		str_where  = where.join(" AND ").trim();

		if (str_where){
			where = "where "+ str_where;
		}
		else{
			where = '';
		}

		var str_SQL = "select distinct state as id, state as name from location " + where + " order by state";

		console.log(str_SQL);

		Provider.query( str_SQL, function(err, docs) {
			if (err) {
				console.log(err);

				res.json({code:100,msg:'Error en la ocnsulta'});
			}else{
				res.json({code:0,msg:'ok',data:docs});
			}
		});
	}


};
