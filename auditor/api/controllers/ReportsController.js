/**
 * ReportsController
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
var _ = require('underscore');
var utils = require('../../utilities');

module.exports = {


  index: function (req, res) {

  /**
   * Action blueprints:
   *    `/reports/index`
   *    `/reports`
   */

    // Send a JSON response
   res.redirect('/dashboard');
  },

  	locations_to_csv:function(req, res){
	    var query = "SELECT * FROM vwmergelocations ";

	    if (req.body.supplier_id || req.query.supplier_id){
	      query += " WHERE supplier_id ="+ req.body.supplier_id || req.query.supplier_id
	    }

	    var file_name = 'Sites';

	    utils._csv.query_to_csv(Vwmergelocations, query, file_name, function(error, data){
	      if(error) return res.json(error)
	      return res.json(data)
	    })
  	},

	typesstatus : function(req,res){

		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;

		var d = require('domain').create();
		var permisions_types = req.session.permisions.types;
		var where = {};


		if( list && list != '*' && list != 'null' ){
			where.list_id = list;
		}


		if (permisions_types.length > 0 ) {
			where.type =  permisions_types;
		}



		d.on('error', function(er) {
			console.log('Error', er.message);
			res.json({code:104,msg:'Database Error',dbe:er.message});
		});

		console.log("ReportsController::typesstatus; Where Params: ");
		console.log(where);

		Vw_type_status.find(where).sort('type').done(d.bind(function(e,doc){
			if(e){
				res.json({code:100,msg:'Database Error'});
			}else{
				res.json({code:0,msg:'ok',data:doc});
			}
		}));

	},


	providersstatus : function(req,res){

		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;

		var d = require('domain').create();

		var permisions_providers = req.session.permisions.providers;
		var permisions_types = req.session.permisions.types;

		var where = [];


		if (permisions_types.length > 0 ) {
			where.push(" type in ('"+ permisions_types.join("','") +"') ");
		}

		if (permisions_providers.length > 0 ) {
			where.push(" supplier_id in ('"+ permisions_providers.join("','") +"') ");
		}

		if( list && list != '*' && list != 'null' ){
			where.push(" list_id = '" + list +"'");
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
			" list_id, supplier_id, supplier_name provider, GROUP_CONCAT(distinct type, ',') types, " +
			"sum(case "+
			"when "+
			"status in ('1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','m','n','o','p','r','s','t','u','v','x') "+
			"then cantidad else 0 end) anomalies, "+
			"	sum(case "+
			"when  "+
			"status in ('12')  "+
			"then cantidad else 0 end) repaired, "+
			"	sum(case "+
			"when "+
			"status in ('11','14') "+
			"then cantidad else 0 end) witnesses, "+
			"	sum(cantidad) total "+
			"from vw_location_lsts "+ where +
		    " group by supplier_id, supplier_name order by supplier_name";


		Dashboard.query(str_SQL, function(err, stats) {
			if (err) {
				console.log(err);

				res.json({code:100,msg:'Error en la ocnsulta'});
			}else{
				res.json({code:0,msg:'ok',data:stats});
			}


		});
	},

	providersstatus_resp : function(req,res){

		var list      = typeof(req.query.list) == 'undefined' ? null : req.query.list;

		var d = require('domain').create();

		var permisions_providers = req.session.permisions.providers;
		var permisions_types = req.session.permisions.types;


		var where = {};

		if (permisions_providers.length > 0) {
			where.supplier_id = permisions_providers;
		}

		if( list && list != '*' && list != 'null' ){
			where.list_id = list;
		}



		d.on('error', function(er) {
			console.log('Error', er.message);
			res.json({code:104,msg:'Database Error',dbe:er.message});
		});

		console.log("ReportsController::providersstatus; Where Params: ");
		console.log(where);



		Vw_provider_status.find(where).sort('provider').done(d.bind(function(e,doc){
			if(e){
				res.json({code:100,msg:'Database Error'});
			}else{
				res.json({code:0,msg:'ok',data:doc});
			}
		}));

	},

  	 versions : function(req,res){

  	  var d = require('domain').create();
      d.on('error', function(er) {
        console.log('Error', er.message);
        res.json({code:104,msg:'Database Error',dbe:er.message});
      });

      Vwversioncounter.find().done(d.bind(function(e,doc){
        if(e){
           res.json({code:100,msg:'Database Error'});
        }else{
          res.json({code:0,msg:'ok',data:doc});
        }
       }));

  	},

  	table: function (req, res) {

  		res.contentType('application/json');

	    var rows      = req.query.rows;
	    var page      = req.query.page;
	    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
	    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
	    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'asc' : req.query.sortby;
	    var role      = parseInt(req.session.user.role);
	    var supplier  = req.session.user.supplier_id;
	    var skip = rows * ( page - 1 );



	      var state      = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
	      var provider   = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
	      var active     = typeof(req.query.active) == 'undefined' ? null : req.query.active;
	      var where      = {};


	      if( keyword ){
	          where.or = [
	          	{like:{provider_name:'%'+keyword+'%'}},
	          	{like:{uuid:'%'+keyword+'%'}},
	          	{like:{code:'%'+keyword+'%'}},
	          	{like:{ref_street_1 : '%'+keyword+'%'}},
	          	{like:{ref_street_2 : '%'+keyword+'%'}},
	          	{like:{city: '%'+keyword+'%'}},
	          	{like:{state:'%'+keyword+'%'}},
	          	{like:{zip:'%'+keyword+'%'}} ,
	          	];
	      }

	      Vwreport.count(where).done(function(e,c){
	        Vwreport.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
	              var totalpages = Math.ceil( c/rows )
	              return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
	        });
	      });


  	},

  	mobile: function (req, res) {

  		res.contentType('application/json');

	    var rows      = req.query.rows;
	    var page      = req.query.page;
	    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
	    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
	    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
	    var role      = parseInt(req.session.user.role);
	    var supplier  = req.session.user.supplier_id;
	    var skip = rows * ( page - 1 );



	      var state      = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
	      var provider   = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
	      var active     = typeof(req.query.active) == 'undefined' ? null : req.query.active;
	      var where      = {};

	      if( keyword ){
	          where.or = [
	          	{like:{provider_name:'%'+keyword+'%'}},
	          	{like:{code:'%'+keyword+'%'}},
	          	{like:{city:'%'+keyword+'%'}},
	          	{like:{state:'%'+keyword+'%'}},
	          	];
	      }

	      Vwreportmobile.count(where).done(function(e,c){
	        Vwreportmobile.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
	              var totalpages = Math.ceil( c/rows )
	              return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
	        });
	      });
	 },

	providers : function(req,res){

  	  var d = require('domain').create();
      d.on('error', function(er) {
        console.log('Error', er.message);
        res.json({code:104,msg:'Database Error',dbe:er.message});
      });

      Vwversioncounter.find().done(d.bind(function(e,doc){
        if(e){
           res.json({code:100,msg:'Database Error'});
        }else{
          res.json({code:0,msg:'ok',data:doc});
        }
       }));

  	},
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ReportsController)
   */
  _config: {}


};
