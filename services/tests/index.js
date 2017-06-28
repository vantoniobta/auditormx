var request = require('supertest');
var should  = require("should");
var test 	= require('tape');

// Abstract
var app  = require('tenant').run();

describe("Testing API UP", function() {

	this.slow(30000);

    it("HTTP Healthy", function(next) {
	  	request( tenant.app )
	    .get('/')
	    .expect(200)
	    .end(function (err, res) {
	      res.status.should.equal(200);
	      next();
	    });       
    });  

    it("Model > create() ", function(next) {
        Accounts.tenant('auditor').create({
            name:'Ferso',
            full_name :'Ferso Create',
            created: new Date(),
            // password: 'casa',
            status : 1
        }).exec(function(e,r){
            if(!e){
                next(e);
                // User.tenant('auditor').remove({id:r.id}).exec(next);
            }else{
                next(e);
            }              
        })
    });
   
    it("Model > count()", function(next) {
    	User.tenant('auditor').count().exec(next)
    });

    it("Model > find().skip(1).limit(2)", function(next) {
    	var limit = 2;
    	var skip  = 1;
    	User.tenant('auditor').find().skip(skip).limit(limit).exec(function(e,r){    		
    		r.length.should.equal(limit);
    		next();
    	});
    });

    it("Model > findOne({name:'F/'}) ", function(next) {
    	User.tenant('auditor').findOne({name:'/F/'}).exec(function(e,r){           
            // console.log(e,r);
            next();
        });
    });

  //   it("Model > update({id:1})", function(next) {    	    
  //   	 User.tenant('auditor').update({id:1},{$set:{name:'Fernando Soto ' + ( new Date().getTime() ),status:2}}).exec(function(e,r){
  //   		next();
		// });
  //   });

  //   // it("Model > findOneInDocument()", function(next) {           
  //   //      Accounts.tenant('auditor').findOneInDocument('users',{'users.name':'Ferso','users.status':1,'users.active':2}).exec(function(e,r){          
  //   //          next();
  //   //     });
  //   // });

  //    it("Model > findOne().save()", function(next) {
  //   	User.tenant('auditor').findOne({id:1}).exec(function(e,r){
  //   		r.name     = 'Test Finalize';
  //   		r.phone    = null;
  //   		r.created  = new Date();
  //   		r.save(function(e,r){
  //   			next();
  //   		})
  //   	});
  //   });
  

});


