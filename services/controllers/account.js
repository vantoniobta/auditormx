const fs 		= require('fs');
const request   = require('request');
const randtoken = require('rand-token');
const bcrypt     = require('bcrypt');
const crypto    = require('crypto');

module.exports = {
 index: function (req, res) {
    res.json({code:0,msg:'ok'});
  },
  add: function (req, res) {
    var name  = req.body.name;
    var user  = req.body.user;
    var token = randtoken.generate(32);
    var key   = bcrypt.hashSync(token, 10);
    Accounts.tenant('auditor-master').create({name:name,token:token,key:key}).exec(function(e,r){
        if(e) return res.json({code:100,msg:'Something was wrong to trying add account'});
        var accountid = r[0]._id.toString();
        Users.tenant('auditor-master').findOne(user).exec(function(e,u){
            var tenant     = r[0];
                tenant._id = accountid;
            u.tenant.push(tenant);
            u.save(function(e,r){
               Users.tenant('auditor-'+tenant._id).create(u).exec(function(e,r){
                    Accounts.tenant('auditor-master').findOne(accountid).exec(function(e,a){
                        delete u.tenant;
                        u._id = u._id.toString();
                        u.id  = u._id;
                        a.users = [u];
                        a.save(function(e,a){
                            res.json({code:0,msg:'ok',tenant:tenant});
                        });
                    });
                });
            });
        });
    });
  },
};
