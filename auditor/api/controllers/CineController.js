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

module.exports = {

	/**
	 * Action blueprints:
	 *    `/users/index`
	 *    `/users`
	 */
	index: function (req, res) {
		return res.view();
	},

	/**
	 * Action blueprints:
	 *    `/users/index`
	 *    `/users`
	 */
	index2: function (req, res) {
		return res.view();
	},

	/**
	 * Action blueprints:
	 *    `/users/index`
	 *    `/users`
	 */
	table: function (req, res) {

		// console.log(req.session)
		// res.contentType('application/json');

		var rows      = req.query.rows;
		var page      = req.query.page;
		var keyword   = typeof(req.query.keyword) === 'undefined' ? null : req.query.keyword;
		var sortfield = typeof(req.query.sortfield) === 'undefined' ? 'id' : req.query.sortfield;
		var sortby    = typeof(req.query.sortby) === 'undefined' ? 'desc' : req.query.sortby;
		var role      = parseInt(req.session.user.role,10);
		var supplier  = req.session.user.supplier_id;
		var skip = rows * ( page - 1 );

		var where     = {};

		if( keyword ){
			where.or = [{uuid:keyword,user_name:keyword}];
		}

		Cine.count(where).done(function(err, count){

			Cine.find(where)
			.sort(sortfield+' '+sortby)
			.paginate({page:page,limit:rows})
			.done(function(err,data){
				var totalpages = Math.ceil( count/rows );
				return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
			});

		});

	},

	save : function (req, res){

		for( x in req.body.cine ){

			if( typeof(req.body.cine[x]) == 'object' || typeof(req.body.cine[x]) == 'function' ){
				delete req.body.cine[x];
			}
		}

        Cine.create(req.body.cine).done(function(err, cine){
          // Error handling
          if (err) {
            return res.json({code:100,msg:"Campaing cant be created"});
          // The User was created successfully!
          }else {
            return res.json({code:0,msg:"Cine created:",data:cine});
          }
        });


	}

};
