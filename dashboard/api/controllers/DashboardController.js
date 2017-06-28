/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function (req, res){
    req.session.lang = "es";
    req.setLocale(req.session.lang);
    req.session.tenant = null
    res.view({tenant:null});
  },

  debts : function(req,res){
  		res.json({code:0,msg:'ok',pages:{ current_page:1,rows:10,count:0}});
  }
};
