/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */ 

module.exports = {
  table : function (req, res){

    var page      = req.query.page;
    var rows      = req.query.rows;
    var id        = req.query.membership_id;
    var skip      = 0;
    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
    var where     = {membership_id:id};
      // if( keyword ){
      //   var keyword = keyword.trim();
      //   where.or = [ 
      //   { like: {uuid: '%'+keyword+'%'} }, 
      //   { like: {method: '%'+keyword+'%'} }
      //   ];
      // }     
    Vw_balance.count(where).skip(skip).limit(rows).exec(function(e,c){  
      Vw_balance.find(where).sort({number:'ASC'}).skip(skip).limit(rows).exec(function(e,r){
        // console.log(e||r);
        var total = c;
        var pages = Math.ceil(c/rows)       
        return res.json({code:0,msg:'ok',data:r,pages:{current_page:page, rows:rows, count:total}});
      });     
    });
  },
  debts: function (req, res){

    var page      = req.query.page;
    var rows      = req.query.rows;
    var id        = req.query.membership_id;
    var skip      = 0;
    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
    var current   = new Date();
    var where     = {membership_id:id,date:{'<=':current},status:0};
      // if( keyword ){
      //   var keyword = keyword.trim();
      //   where.or = [ 
      //   { like: {uuid: '%'+keyword+'%'} }, 
      //   { like: {method: '%'+keyword+'%'} }
      //   ];
      // }     
    Vw_balance.count(where).skip(skip).limit(rows).exec(function(e,c){  
      Vw_balance.find(where).sort({number:'ASC'}).skip(skip).limit(rows).exec(function(e,r){
        // console.log(e||r);
        var total = c;
        var pages = Math.ceil(c/rows)       
        return res.json({code:0,msg:'ok',data:r,pages:{current_page:page, rows:rows, count:total}});
      });     
    });
  },
};

