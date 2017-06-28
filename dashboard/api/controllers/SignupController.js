/**
 * UController
 *
 * @description :: Server-side logic for managing US
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var   randtoken  = require('rand-token');
var   bcrypt     = require('bcrypt');
var   crypto     = require('crypto');
var request   = require('request');

module.exports = {
	 index: function (req, res) {
      if(req.method == 'POST'){
        request.post('http://ws.iclicauditor.com/users/signup',{form:req.body},function(e,b,r){
          console.log(e||r);
          if(e) return res.view({code:100,msg:'Something was Wrong with signup server!',layout:'elogin'});
            var r = JSON.parse(r);
            if( r.code == 0 ){
              delete r.user.tenant[0].token;
              delete r.user.tenant[0].key;
              req.session.user           = r.user;
              req.session.authenticated  = true;
              req.session.lang           = r.user.lang;
              return res.redirect('/dashboard');
            }else{
              return res.view({code:101,msg:'listo!',layout:'elogin'});
            }
        });
      }else{
        return res.view({code:0,msg:'ready!',layout:'elogin'});
      }
  	},

   // activate: function (req, res) {
   //    req.session.key   =  req.query.key
   //    console.log(req.query.key)
   //      request.post('http://localhost:8887/email/url',{form:req.query},function(e,b,r){
   //      console.log(e||r);
   //     if(e) return res.view({code:100,msg:'Something was Wrong with signup server!',layout:'elogin'});
   //      var r = JSON.parse(r);
   //          if( r.code== 0 ){
   //              return res.redirect('/signup/new');
   //             }else{
   //               return res.view({layout:"elogin"});
   //               }
   //      });
   //    //verificar si existe el key por url
   //    // req.session.key = req.query.key
   //    // var valdiatekey = typeof req.query.key == 'undefined' ? false : true;
   //    // return res.view({layout:"elogin",valdiatekey:valdiatekey});
  	// },
   //  new:function(req,res){
   //  return res.view({layout:"elogin"});
   //  },

   //  verificate:function(req,res){
   //    console.log(req.body)
   //    if(req.method == 'POST'){
   //      var a   = req.body;
   //      var tc  = req.body.key
   //        a.key =req.session.key;
   //        var key       = req.body.user_key;
   //        var name      = req.body.user_name;
   //        var password  = req.body.user_password;

   //              request.post('http://localhost:8887/email/op2',{form:req.body},function(e,b,r){
   //                console.log(e||r);
   //                if(e) return res.view({code:100,msg:'Something was Wrong with signup server!',layout:'elogin'});
   //                 var r = JSON.parse(r);
   //                 console.log(r)
   //                  if( r.code == 0 ){ //question+
   //                   // req.session.user             = r.user;
   //                   // req.session.authenticated    = true;
   //                   // req.session.lang             = r.user.lang;
   //                      return res.redirect( '/dashboard');
   //                    console.log("datos enviados al services")
   //                  }else{
   //                        return res.redirect('/signup/activate');
   //                        console.log("datos NO enviados al services")
   //                  }
   //            });

   //        }
   //  },

    // find:function(req,res){
    //     if(req.method == 'POST'){
    //         var b= req.body;
    //         b.key=req.session.key;
    //           request.post('http://localhost:8887/email/reg',{form:req.body},function(e,b,r){
    //            console.log(e||r);
    //              var r = JSON.parse(r);
    //              if (r.code==0) {
    //               //-------------------validar login--------------------
    //               var pass     =  req.body.password;
    //               var key      =  req.session.key;
    //               var ps  = bcrypt.hashSync(pass, 10);
    //               console.log(ps)
    //               console.log(key)
    //               // var ten    = "57754a625afe3d840af47a4e";
    //               Users.findOne({
    //                 key:key
    //                 }).exec(function(e,user){
    //                 if(user){
    //                   console.log("ok")

    //                   // bcrypt.compare(ps, user.password, function(err, result) {
    //                   //     if(result){
    //                   //     req.session.user             = user;
    //                   //     req.session.authenticated    = true;
    //                   //     req.session.lang             = user.lang;
    //                   //       return res.redirect( '/dashboard');
    //                   //     }else{
    //                   //       console.log('invalid pass');
    //                   //       // response.key     = key;
    //                   //       // response.status      = 500;
    //                   //       // response.message   = 'invalid password';
    //                  return res.redirect( '/dashboard');
    //                   //     }
    //                   //  });
    //                 }else{
    //                   console.log("no")
    //                   // console.log('invalid pass');
    //                   // response.email     = email;
    //                   // response.status      = 500;
    //                   // response.message   = 'invalid users';
    //                   // return res.view({layout:'elogin',data:response});
    //                 }
    //             });
    //               //-------------------validar login--------------------

    //              // console.log(b.key)
    //                  // req.session.user             = r.user;
    //                  // req.session.authenticated    = true;
    //                  // req.session.lang             = r.user.lang;
    //                    //return res.redirect('/dashboard');
    //                  }else{
    //                    return res.redirect('/signup/activate');
    //              }
    //           });

    //     }
    // },

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

      console.log(req.body)

        var user = JSON.parse(req.body.account);
        req.session.user = user;
        return res.redirect( '/dashboard');
    }


};

