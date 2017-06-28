const request    = require('request');
var   randtoken  = require('rand-token');
var   bcrypt     = require('bcrypt');
var   crypto     = require('crypto');
var   token      = randtoken.generate(32);

module.exports = {

	index:function(req, res) {
		res.json({code:0,msg:'ok, nothing here :)'});
	},
  update:function(req, res){
    var body = req.body.user;
    console.log(body)
    // Users.findOne({email:body.email}).exec(function(e,r){
      // console.log(Users.tenant('auditor-master').find().limit(1));
        Users.tenant('auditor-master').findOne({email:body.email}).exec(function(e,r){
          if (!e) {
            if (r.hasOwnProperty('email')) {
              if (r._id == body.id) {
                     var data  = {};
                     if( body.hasOwnProperty('name') ){
                          data.name  = body.name;
                          r.name     = body.name;
                       }

                      if( body.hasOwnProperty('email') ){
                          data.email  = body.email;
                          r.email     = body.email;
                        }
                         if( body.hasOwnProperty('lang') ){
                          data.lang  = body.lang;
                          r.lang     = body.lang;
                        }

                       if( body.hasOwnProperty('password') && body.password != '' && body.password.length > 3 ){
                          data.password  = bcrypt.hashSync(body.password, 10);
                          r.password     = data.password;
                         }
                            // res.json({code:0,msg:'ok'});
                           //  -----------------------------save-------------------------------
                               r.save(function(e,r){
                                    if (!e) {
                                           res.json({code:0,msg:'ok'});
                                  }else{
                                      res.json({code:102,msg:'not update in auditor-master!!', error:e});
                                  }

                                });

                           //  -----------------------------find-------------------------------
              }else{
                res.json({code:101,msg:'ya existe el email registrado con otro usuario', error:e});
              }
            }else{

                       //si no existe email registrar nuevo
                        var data  = {};

                        if( body.hasOwnProperty('name') ){
                        data.name  = body.name;
                        r.name     = body.name;
                        }

                        if( body.hasOwnProperty('email') ){
                        data.email  = body.email;
                        r.email     = body.email;
                        }

                         if( body.hasOwnProperty('lang') ){
                          data.lang  = body.lang;
                          r.lang     = body.lang;
                        }

                        if( body.hasOwnProperty('password') && body.password != '' && body.password.length > 3 ){
                        data.password  = bcrypt.hashSync(body.password, 10);
                        r.password     = data.password;                        
                        }

                      // -----------------------------save-------------------------------
                            r.save(function(e,r){
                                if (!e) {    
                                   Users.tenant('auditor-master').update({id:body.id},{$set:data}).exec(function(e,r){
                                        if (!e) {
                                            res.json({code:0,msg:'ok',data:r});
                                        }else{
                                          res.json({code:102,msg:'not update in master!!', error:e});
                                        }
                                      });
                                        
                                      }
                                      // else{
                                      //     res.json({code:102,msg:'not update in auditor-master!!', error:e});
                                      // }

                                    });
                      // -----------------------------find-------------------------------
            }
          }

        })

   },

}
