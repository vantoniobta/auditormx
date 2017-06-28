/**
 * LogsController
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


function toLogs(dataset,indx,total,cb,msg,row,a){
		var fcsv     = require("fast-csv");
		var fs       = require('fs');


}

function toWrite (name,path,data,cb){

	var fcsv     = require("fast-csv");
	var fs       = require('fs');

	var  csvs    = fcsv.createWriteStream({headers: true});
	var wcsvs    = fs.createWriteStream(path);
				wcsvs.on("finish", function(){
					console.log('finished: ',name);
					console.log(odata);
					console.log('----------------------------------------'.grey);
					 cb();
				});

		csvs.pipe(wcsvs);

		if( data.length > 0 ){
			for( x in data ){
				var odata = {};
				var row = data[x];
				for(i in row){
					var d = row[i];
						for( o in d ){
								if( typeof(d[o]) == 'string' || typeof(d[o]) == 'number '){
									// console.log( o, typeof(d[o]), d[o]) ;
									odata[o] = d[o];
								}else{
									delete d[o];
								}
						}
					csvs.write(odata);
					console.log('----------------------------------------'.red);

				}
			}
		}else{
			cb();
		}
		csvs.end();

}

function toCreate (dataset,indx,total,cb){


		var dataset  = dataset;
		var indx     = parseInt(indx) + 1;
		var total    = total;

		if( indx < total ){

		console.log(indx,total,(indx < total), 'Duplicate:',Duplicate.length,' Ok:',Ok.length,' Not:',Nott.length );
		// console.log('--------------------------------------');

			var row = dataset[indx];

				var version = {
				cuotas: '23679374976876546',
				cuota: '23679374976876546',
				pipa: '23679374976876545',
				rejas: '23679374976876544',
				manos: '23680914336776193',
				maguey: '23680914336776194',
				territorio: '23680914336776195',
				pinta:'23685733692735491'
			}



						// --------------- cmi

						// var data = {
						// 	 supplier_id:''
						// 	,name: ''
						// 	,code:''
						// 	,neighbor:''
						// 	,zip:''
						// 	,state:''
						// 	,dimensions:''
						// 	,version:''
						// }

						// --------------- Isal

						// var data = {
						// 	 supplier_id:''
						// 	,id: ''
						// 	,code:''
						// 	,state:''
						// 	,city:''
						// 	,ref_street_1:''
						// 	,neighbor:''
						// 	,ref_street_2:''
						// 	,ac:''
						// 	,version:''
						// 	,circulation:''
						// }


				//------------------------------------------ ecobotes

						// var data = {
						// 	supplier_id:''
						// 	,name: ''
						// 	,code:''
						// 	,address:''
						// 	,city:''
						// 	,zip:''
						// 	,state:''
						// 	,dimensions:''
						// 	,view:''
						// 	,version:''
						// }

						//------------------------------------------ listado gaby

						var data =  {
								'id'   : ''
								,'idx' : ''
								,'supplier_id':''
								,'code':''
								,'light':''
								,'mapa':''
								,'street':''
								,'neighbor':''
								,'city':''
								,'zip':''
								,'state':''
								,'ref_street_1':''
								,'ref_street_2':''
								,'dimensions':''
								,'base':''
								,'height':''
								,'metraje':''
								,'material':''
								,'version':''
								,'contra':''
								,'price':''
							}


					var i = 0;
					for( var x in data){
						data[x] = typeof(row[i]) == 'string' ? row[i].trim() : row[i];
						i++;
					}

					data.version = version[data.version.toLowerCase()];


						console.log( {supplier_id:data.supplier_id,code:data.code} );
						var pre = {supplier_id:data.supplier_id,code:data.code};
						// console.log('--------------------------------------------'.grey);
						 Vwmergelocations.find({supplier_id:data.supplier_id,code:data.code}).done(function(e,row){
								if( row.length > 1 ){
										console.log('Código encontrado con duplicados');
										Duplicate.push(row);
										toCreate(dataset,indx,total,cb);
								}

								if( row.length == 1 ){
										console.log('Código encontrado');
										Ok.push(row);
										Art_Object.create({uuid_art:data.version,uuid_object:row[0].uuid, id_object:row[0].object_id,supplier_id:data.supplier_id}).done(function(){
											toCreate(dataset,indx,total,cb);
										});
								 }

								if( row.length == 0 ){
										console.log('Código no encontrado');
										// Provider.find(data.  supplier_id).done(function(e,row){
										//   row[0].codigo_empresa = pre.code;
											Nott.push( [data] );
											toCreate(dataset,indx,total,cb);
										// });
								}

								 // console.log(d);
								 console.log('--------------------------------------------'.grey);
						 });



			//-------------------------------------------------------------------------------------

		}else{

			//toWrite('Duplicados',"/Users/ferso/Sites/auditor/Duplicate.csv",Duplicate,function(){

			 toWrite('OK',"/Users/ferso/Sites/auditor/Ok.csv",Ok,function(){

			 });

			toWrite('No encontrados',"/Users/ferso/Sites/auditor/Not.csv",Nott,function(){

			});



			//});

			console.log(indx,total, (indx < total),'Duplicate:',Duplicate.length,' Ok:',Ok.length,Nott.length );
			console.log('--------------------------------------');
			console.log('finished');
			return cb({code:0,msg:'Update information'});
		}

}


function generateThumbs(thepath,images){

	var fs      = require('fs');
	var path    = require("path");
	var crypto  = require("crypto");
	var mkdirp  = require('mkdirp');
   	var im   	 = require('imagemagick');

	for(x in images){

		var npath 		= thepath + '/'+ images[x];
		var tmb_newPath	= thepath +'/tmb_'+images[x];

		im.resize({
			srcPath: npath,
			dstPath: tmb_newPath,
			width: 100,
			height: 75,
				format: 'jpg'
		}, function(err, stdout, stderr) {

				if(err){
					console.log(err)
				}

				console.log('finished');
		});

	}

}


function updateStatus(data,idx,total,cb){
	var fs     = require('fs'),
			colors = require('colors');

	var path   = '/media/backup/uploads/status/';
	var idx 	 = idx + 1;

	if( idx < total ){

		var status = data[idx];
		var stats  = fs.statSync(path + status);
		var dir    = path + status;

		if( stats.isDirectory() ){

			var sstdir = fs.readdirSync(dir);
			var images = sstdir.toString();

			//generate thumbs;
			generateThumbs(dir,sstdir);

			Status.findOne(status).done(function(e,s){

				if(e){
					updateStatus(data,idx,total,cb);
					console.log('Error :', status);
					console.log('--------------------------------------------------------------'.grey);
				}
				if( s ){

					s.snapshots = images;
					s.save(function(e,r){

						updateStatus(data,idx,total,cb);
						console.log(s);
						console.log('--------------------------------------------------------------'.grey);

					});

				}else{
					updateStatus(data,idx,total,cb);
				}

			});
		}
	}else{
		cb({code:0,msg:''});
	}
}

module.exports = {

	/**
	 * Action blueprints:
	 *    `/users/index`
	 *    `/users`
	 */
	index: function (req, res) {

		return res.view();

		// Logs.find().limit(50).sort({ id: 'desc' }).done(function(error, docs){
		// 	if(error){
		// 		console.log(error)
		// 	}else{
		// 		return res.view({logs: docs});

		// 	}
		// })
	},

	/**
	 * Action blueprints:
	 *    `/users/index`
	 *    `/users`
	 */
	table: function (req, res) {
		// console.log(req.session)
		res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = req.session.user.supplier_id;
		var skip = rows * ( page - 1 );


			var where      = {};


			if( keyword ){
					where.or = [{uuid:keyword,user_name:keyword}];
			}

			Vwlogs.count(where).done(function(e,c){
				Vwlogs.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
							var totalpages = Math.ceil( c/rows )
							return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
				});
			});

	},


	/**
	 * Action blueprints:
	 *    `/users/index`
	 *    `/users`
	 */
	update: function (req, res) {
		res.contentType('application/json');

		Duplicate = [];
		Ok        = [];
		Nott      = [];

		var start = new Date().getTime();

		var fs   = require('fs');
		var csv  = require('csv');

		var src  = '/Users/ferso/Documents/Listados/csv/LISTADO ICLIC copy.csv';

		var d = require('domain').create();
				d.on('error', function(er) {
					console.log('Error', er.message);
					res.json({code:104,msg:'Database Error',dbe:er.message});
				});

			 csv().from(src, { delimiter: ',', escape: '"' })
			.to.array( function(dataset){

			//------------------------------------------------------------------

				// console.log(data);
				toCreate(dataset,0 ,dataset.length,function(r){
					var end = new Date().getTime();
					var time = end - start;
					console.log('Execution time: ' + (time/1000));
					console.log('-----------------------------------------------'.grey);
					return res.json(r);

				});

			//------------------------------------------------------------------

			}).on('error', function(error){
				return res.send({code:100,msg:'Error to read this file'});
			}).on('end', function(o){

			});

	},

	directory : function(req, res){

			var fs     = require('fs'),
			colors = require('colors');

			var path = '/media/backup/uploads/status/';
			var data = fs.readdirSync(path);

			updateStatus(data,-1,data.length,function(response){
					res.json(response);
			});

	},

	unzip : function(req, res){

		var fs 			= require('fs')
		, AdmZip 		=  require('adm-zip');

		var path        = '/Users/ferso/Sites/auditor/results/';
		var file 		= 'wetransfer-acd613.zip';
		var ext         = '.'+file.split('.').slice(-1).pop();
		var directory   = file.replace(ext,'');

		console.log(directory,ext);

	    // reading archives
	    var zip = new AdmZip(path+file);
	    var zipEntries = zip.getEntries(); // an array of ZipEntry records

	   // zipEntries.forEach(function(zipEntry) {
	        // console.log(zipEntry.toString()); // outputs zip entries information
	        // if (zipEntry.entryName == "my_file.txt") {
	        //      console.log(zipEntry.data.toString('utf8'));
	        // }
	   // });
	    // outputs the content of some_folder/my_file.txt
	    // console.log(zip.readAsText("some_folder/my_file.txt"));
	    // extracts the specified file to the specified location
	    //zip.extractEntryTo("some_folder/my_file.txt",path+'unzip', false, true);
	    // extracts everything
	    zip.extractAllTo(path+directory,true);

	    res.send('ok');

	}

};
