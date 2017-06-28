/**
 * UController
 *
 * @description :: Server-side logic for managing US
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request   = require('request');
var bcrypt 		= require('bcrypt');
var crypto 		= require('crypto');

module.exports = {
  index: function (req, res) {
    var response = {};
    //req.session.authenticated
    if(req.method == 'POST'){
      var email = req.body.user_email;
      var pass  = req.body.user_password;
      Users.findOne({
          email:email,
          status:1
          }).exec(function(e,user){
          if(user){
            bcrypt.compare(pass, user.password, function(err, result) {
                if(result){
                req.session.user             = user;
                req.session.authenticated    = true;
                req.session.lang             = user.lang;
                	//register logs login
                  Register.action('login',user);
                	//redirect to dashboar
                  return res.redirect( '/dashboard');
                }else{
                  console.log('invalid pass');
                  response.email     = email;
                  response.status      = 500;
                  response.message   = 'invalid password';
                  return res.view({layout:'elogin',data:response});
                }
             });
          }else{
            console.log('cant find user pass');
            response.email     = email;
            response.status      = 500;
            response.message   = 'invalid users';
            return res.view({layout:'elogin',data:response});
          }
      });
    }else{
      req.session.authenticated    = false;
      return res.view({ok:'listo!',layout:'elogin'});
    }
  },

	 before: function (req, res) {

		var response = {};
	  	//req.session.authenticated
	  	if(req.method == 'POST'){

	  		var email = req.body.user_email;
	  		var pass  = req.body.user_password;

	  		Users.find({
			    	email:email,
			    	status:1
            }).exec(function(e,users){

          if( users.length > 1 ){

            //verifico el password en todas cuentas con el mismo email
            var accounts = [];
            for ( var x in users ){
              if( bcrypt.compareSync(pass, users[x].password ) ){
                accounts.push(users[x]);
              }
            }

            if(accounts.length > 1){
                req.session.accounts = accounts;
                req.session.authenticated  = true;
                return res.redirect( '/login/session');
            }

             if(accounts.length == 1){

               var user = accounts[0];
                bcrypt.compare(pass, user.password, function(err, result) {
                  if(result){
                  req.session.user             = user;
                  req.session.authenticated    = true;
                  req.session.lang             = 'en';
                    return res.redirect( '/dashboard');
                  }else{
                    console.log('invalid pass');
                    response.email     = email;
                    response.status      = 500;
                    response.message   = 'invalid password';
                    return res.view({layout:'elogin',data:response});
                  }
               });

            }

            if(accounts.length == 0){
              console.log("LoginController - no se encuentra el usuario - "+ req.body.user_email );
              response.email     = email;
              response.status    = 500;
              response.message   = 'invalid users'
              res.view({layout:'elogin',data:response});
            }
          }

         if( users.length == 1 ){
            var user = users[0];
            bcrypt.compare(pass, user.password, function(err, result) {
              if(result){
              req.session.user             = user;
              req.session.authenticated    = true;
              req.session.lang             = 'en';
                return res.redirect( '/dashboard');
              }else{
                console.log('invalid pass');
                response.email     = email;
                response.status      = 500;
                response.message   = 'invalid password';
                return res.view({layout:'elogin',data:response});
              }
           });
         }
          //---------------------------------------------------------
		    	if( users.length == 0 ){
				  	console.log("LoginController - no se encuentra el usuario - "+ req.body.user_email );
		    		response.email     = email;
		    		response.status    = 500;
		    		response.message   = 'invalid users'
		    		res.view({layout:'elogin',data:response});
		    	}

          //---------------------------------------------------------
			});

	  	}else{
        req.session.authenticated    = false;
	  		return res.view({ok:'listo!',layout:'elogin'});
	  	}

  	},
  	activate: function (req, res) {
      var key = typeof(req.query.key) == 'undefined' ? null : req.query.key;
      if(req.method == 'POST'){
          console.log(req.body);
          console.log({key:req.body.user.key});
          Users.findOne({key:req.body.user.key}).exec(function(e,u){
             // sails.log.debug(u);
             if(e) return res.view({layout:"elogin",key:req.body.key,error:e});

              var data        = req.body.user;
              data.name       = data.name;
              data.password   = data.password;
              data.key        = data.key;
             //---------------------------------------------------------------
             request.post('http://ws.iclicauditor.com/users/validate',{form:data},function(e,b,r){
              console.log(e||r);
             if(e) return res.view({code:100,msg:'Error! the key invalid!',layout:'elogin'});
              var r = JSON.parse(r);
              if( r.code == 0 ){
              //--------------------------------------------
                    if(u){
                      u.status   = 1;
                      u.lang     = 'en';
                      u.name     = req.body.user.name;
                      u.password = bcrypt.hashSync(req.body.user.password, 10 );
                      u.save(function(e,user){
                        req.session.user = user;
                        req.session.lang = user.lang;
                        req.session.authenticated = true;
                        res.redirect('/dashboard');
                      });
                   }else{
                   res.view({code:102,msg:'Error! the password invalid',layout:"elogin",key:null,nouser:true});
                   }
             //--------------------------------------------
              }else{
                res.view({code:101,msg:'Error! the name invalid',layout:"elogin",key:null,nouser:true});
              }

             })
             //---------------------------------------------------------------
          });

       }else{
          return res.view({layout:"elogin",key:key});
       }

  	},

    key:function(req,res){
      return res.view({layout:"elogin"});
    },

  	recovery: function (req, res) {
    	return res.view({layout:"elogin"});
  	},
    session: function (req, res) {

      var tenants = [];
      for(var x in req.session.accounts){

          tenants.push(req.session.accounts[x])
      }

      return res.view({layout:"elogin",tenants:tenants});
    },

    initsession: function (req, res) {

        var user = JSON.parse(req.body.account);
        req.session.user = user;
        return res.redirect( '/dashboard');
    }


};

