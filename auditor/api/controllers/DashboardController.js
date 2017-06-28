/**
 * DashboardController
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

 function dateToMysql(str){

	if( str != 'undefined'){
	var date    = new Date(str);
	var day     = String(date.getDate()).length == '1' ? '0'+ date.getDate() : date.getDate();
	var month   = String(parseInt(date.getMonth()+1)).length == '1' ? '0'+ parseInt(date.getMonth()+1) : parseInt(date.getMonth()+1);
	var hour    = String(date.getHours()).length == '1' ? '0'+ date.getHours() : date.getHours();
	var mins    = String(date.getMinutes()).length == '1' ? '0'+ date.getMinutes() : date.getMinutes();
	var secs    = String(date.getSeconds()).length == '1' ? '0'+ date.getSeconds() : date.getSeconds();
	return thedate = date.getFullYear()+'-'+month+'-'+day+' '+hour+':'+mins+':'+secs;
	}else{
		return '';
	}
 }

function currentDateMysql(){


	var date    = new Date();
	var day     = String(date.getDate()).length == '1' ? '0'+ date.getDate() : date.getDate();
	var month   = String(parseInt(date.getMonth()+1)).length == '1' ? '0'+ parseInt(date.getMonth()+1) : parseInt(date.getMonth()+1);
	var hour    = String(date.getHours()).length == '1' ? '0'+ date.getHours() : date.getHours();
	var mins    = String(date.getMinutes()).length == '1' ? '0'+ date.getMinutes() : date.getMinutes();
	var secs    = String(date.getSeconds()).length == '1' ? '0'+ date.getSeconds() : date.getSeconds();
	return thedate = date.getFullYear()+'-'+month+'-'+day+' '+hour+':'+mins+':'+secs;
}

function formatSizeUnits(bytes){
				if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
				else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
				else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
				else if (bytes>1)           {bytes=bytes+' bytes';}
				else if (bytes==1)          {bytes=bytes+' byte';}
				else                        {bytes='0 byte';}
				return bytes;
}

generate = function(data){
	 var waiting = 0;
		for(i in data){

			var mongo   = require('sails-mongo');
					dataset = data[i];
				// console.log( dataset );
				// console.log('---------------------------------------------------');

					MStatus.find().done(function(err, status) {
					 console.log(err||status);
					 console.log('---------------------------------------------------');
					 waiting --;
					 complete();
					});
		}

		function complete() {
			if (!waiting) {
				console.log('Create Total');
				console.log('---------------------------------------------------');
			}
		}

}

laststatus = function(rows,page,where,sortfield,sortby,cb){

	console.log("DashboardController::laststatus Where Params ");
	console.log(where);


	if( typeof(where.list_id) == 'undefined' ){
		console.log("Consultando Vwstatus");
		Vwstatus.count(where).done(function(e,c){
			Vwstatus.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
					var totalpages = Math.ceil(c / rows )
						return cb({code:0,msg:'ok',data:r, count:c, pages:{current_page:page,last_page:totalpages,rows:rows}});
			});
		});

	}else{
		console.log("Consultando Vwfullstatus: ");
		 Vwfullstatus.count(where).done(function(e,c){
			Vwfullstatus.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
					var totalpages = Math.ceil(c / rows )
						return cb({code:0,msg:'ok',data:r, count:c, pages:{current_page:page,last_page:totalpages,rows:rows}});
			});
		});
	}
}

module.exports = {

	/**
	 * Action blueprints:
	 *    `/dashboard/index`
	 *    `/dashboard`
	 */
	 index: function (req, res) {
		console.log("Permisos de Session")
		console.log(req.session.permisions);
		res.view();

	},

	/**
	 * Action blueprints:
	 *    `/locations/index`
	 *    `/locations`
	 */
	stats : function(req,res){
		res.contentType('application/json');

		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;
		var provider      = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
		var permisions_types = req.session.permisions.types;

		var d = require('domain').create();
		d.on('error', function(er) {
			console.log('Error', er.message);
			res.json({code:104,msg:'Database Error',dbe:er.message});
		});


		var where = [];


		if (permisions_types.length > 0 ) {
			where.push(" type in ('"+ permisions_types.join("','") +"') ");
		}

		if( list && list != '*' && list != 'null' ){
			where.push(" list_id = '" + list +"'");
		}

		if( provider && provider != '*' && provider != 'null' ){
			where.push(" supplier_id = '" + provider +"'");
		}

		var str_where  = where.join(" AND ").trim();

		if (str_where){
			where = "where "+ str_where;
		}
		else{
			where = '';
		}

		var str_SQL = " "+
						"select "+
						"sum(case "+
						"when "+
						"status in ('1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','m','n','o','p','r','s','t','u','v','x') "+
						"then cantidad else 0 end) anomalias_count, "+
						"	sum(case "+
						"when  "+
						"status in ('12')  "+
						"then cantidad else 0 end) fixed_count, "+
						"	sum(case "+
						"when "+
						"status in ('11','14') "+
						"then cantidad else 0 end) testigos_count, "+
						"	sum(cantidad) locations_count "+
						"from vw_location_lsts "+ where
						" order by sum(cantidad)desc";


		Dashboard.query(str_SQL, function(err, stats) {
			if (err) {
				console.log(err);

				res.json({code:100,msg:'Error en la ocnsulta'});
			}else{
				res.json({code:0,msg:'ok',data:stats});
			}


		});
		/*
		Dashboard.  accounts = _.map(accounts, function(account) {find(where).done(d.bind(function(e,doc){
			if(e){    return new Accounts._model(account);
				 r  });es.json({code:100,msg:'Database Error'});
			}else{
				re  fn(null, accounts);s.json({code:0,msg:'ok',data:doc[0]});
			}     });
		 }));
        */

	},


	last_status : function(req,res){

		res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role);
		var supplier  = typeof(req.query.provider ) == 'undefined'  ? req.session.user.supplier_id : req.query.provider;
		var list   	  = typeof(req.query.list) == 'undefined' ? null : req.query.list;
		var skip      = rows * ( page - 1 );
		var where     = {};

		var permisions_providers = req.session.permisions.providers;
		var permisions_types = req.session.permisions.types;





		if (permisions_providers.length > 0) {
			where.supplier_id = permisions_providers;
		}

		if (permisions_types.length > 0 ) {
			where.type =  permisions_types;
		}



		 if( keyword ){
				var keyword = keyword.trim();
				where.or = [{ like: {code: '%'+keyword+'%'} },{ like: {license_plate: '%'+keyword+'%'} }];
		 }

		if( list ){
			console.log("Si la variable lista si existe y vale"+ list);
			where.list_id = list;
		}
		else {
			console.log("No existe la variable List");
		}



		console.log("DashboardController::las_status; Role:"+ role + " List_id:"+ list +" Where Params: ");
		console.log(where);

		// if is administrator
		if( typeof(req.query.provider ) != 'undefined'  && ([1,2,3].indexOf(role) > -1) ){
				where.supplier_id = supplier;

				laststatus(rows,page,where,sortfield,sortby,function(response){
						return res.send(response);
				});

		}


		// if is administrator
		if( typeof(req.query.provider ) == 'undefined' && [1,2,3].indexOf(role) > -1   ){

				laststatus(rows,page,where,sortfield,sortby,function(response){
						return res.send(response);
				});
		}

		// if is aprovider
		if( [1,2,3].indexOf(role) == -1 ){
			where.supplier_id = supplier;

			laststatus(rows,page,where,sortfield,sortby,function(response){
					return res.send(response);
			});
		}

	},

	thumb : function(req,res){

			// res.contentType('image/jpeg');

			var file = req.query.file;

			if( file.length > 9 ){

			var fs   = require('fs');
			var im   = require('imagemagick');
			var http = require('http');

			var request = http.get(file, function(response) {

					var data = '';

					response.setEncoding('binary');

					response.on('data', function(chunk){
							data += chunk;
					});

					response.on('end', function () {

							im.resize({
									srcData: data,
									width: 100,
									height: 75,
									format: 'jpg'
							}, function(err, stdout, stderr) {
									if (err) throw err;
									res.contentType("image/jpeg");
								res.end(stdout, 'binary');
							});
					});

			});

		}else{
			res.send('no data');
		}

	}

};
