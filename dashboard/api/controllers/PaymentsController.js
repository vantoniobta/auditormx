/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */ 

var sanitizer = require('sanitizer');

String.prototype.toDecimal = function(){
  return parseFloat(this.replace(/,/g,'')).toFixed(2)
}

function PaymentException(message) {
   this.message = message;
   this.name = "PaymentException";
}

addAmortizationPayment = function(id,membership,amount,res){
	var current 		= new Date();
	var payment_cost 	= 10.00;
	//or:[{date:{'<=':current}},{date:{'>=':current}}],
	Periods.findOne({status:0}).sort({'number':'ASC'}).exec(function(e,p){
		
		if(e){
			throw new PaymentException(e);  
			return res.json({code:100,msg:'Error in database process'});
		};
		if( typeof(p) != 'undefined'){
			var data 		   		 		 = {};
			var payment_amount 		 = parseFloat(amount);
			var total 						 = parseFloat(p.total);
			var difference 			   = parseFloat(p.difference);		
			var diff_payment 			 = payment_amount - difference;					
			var status 						 = diff_payment < 0 ? 0 : 1;
			var diff_amount 			= ((payment_amount - difference)) < 0 ? 0 : payment_amount - difference;
			var done 							= payment_amount >= difference ? difference : payment_amount;
			
				data.membership_id 		= membership;
				data.payment_id    		= id;
				data.period_id     		= p.id;
				data.amount    	   		= done;

				console.log({
					period:p.number,
					diff_amount:diff_amount,
					done: done,
					status:status,
					difference: done - difference
				}); 

				p.status 	   	= status;
				p.done        = status == 1 ? 0 : done;
				p.difference  = difference - done;
				p.save(function(e){
					if(e){ 
						throw new PaymentException(e);
						return res.json({code:100,msg:'Error in database process'});
					};
					Amortization.create(data).exec(function(e,r){
						if(e){ 
							throw new PaymentException(e);
							return res.json({code:100,msg:'Error in database process'});
						};
						if( diff_amount > 0 ){
							addAmortizationPayment(id,membership,diff_amount,res);
						}else{
							return res.json({code:0,msg:'ok',data:data});
						}
					});					
				});
		}else{
			return res.json({code:1,msg:'No periods current availables'});
		}
	});
}

module.exports = {
	 
	index: function (req, res) {	 
	     return res.view();
	},
	add: function (req, res){
		
		var data 			  		= req.body.payment;
			data.status 	  	= 1;
			data.amount		  	= data.amount.toDecimal();
			data.user_creator = parseInt(req.session.user.id);
			data.comment 	  	= sanitizer.sanitize(data.comment);
		Payments.create(data).exec(function(e,p){
			if(e){
				throw new PaymentException(e);
				return res.json({code:100,msg:'Error in database process'});
			}
			addAmortizationPayment(p.id,p.membership_id,p.amount,res);
		});
	},

	cancel: function (req, res){			
		// var randtoken = require('rand-token').generator();
		var suid 	  = require('rand-token').suid;

		Payments.findOne({uuid:req.body.uuid}).exec(function(e,r){			
			r.status 	  		= 0;			
			r.user_cancel  		= parseInt(req.session.user.id);
			r.comment_cancel 	= sanitizer.sanitize(req.body.comment);
			r.date_cancel 		= new Date();
			r.token_cancel		= suid(16); //randtoken.generate(16,"1234567890");

			r.save(function(e,data){
				return res.json({code:0,msg:'ok',data:data});	
			});			
		});
	    
	},
	table : function (req, res){

		var page = req.query.page;
		var rows = req.query.rows;
		var skip = 0;

		var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
	    var where = {customer_id:req.query.id};

	    if( keyword ){
	      var keyword = keyword.trim();
	      where.or = [ 
	      { like: {uuid: '%'+keyword+'%'} }, 
	      { like: {method: '%'+keyword+'%'} }
	      ];
	    }	    
		Vw_payments.count(where).skip(skip).limit(rows).exec(function(e,c){			
			Vw_payments.find({customer_id:req.query.id}).skip(skip).limit(rows).exec(function(e,r){
				// console.log(e||r);
				var total = c;
				var pages = Math.ceil(c/rows)				
				return res.json({code:0,msg:'ok',data:r,pages:{current_page:page, rows:rows, count:total}});
			});			
		});		

	}
};

