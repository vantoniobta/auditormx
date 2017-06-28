/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request   = require('request');

module.exports = {

  index: function (req, res){
    return res.view();
  },
  add: function (req, res){
     request.post('http://ws.iclicauditor.com/account/add',{form:req.body},function(e,b,r){
      if(e) return res.view({code:100,msg:'Something was Wrong with signup server!',layout:'elogin'});
        var r = JSON.parse(r);
        if( r.code == 0 ){
         req.session.user.tenant.push(r.tenant);
         return res.json(r);
        }else{
          return res.json({code:101,msg:r.msg});
        }
    });
  }




};

