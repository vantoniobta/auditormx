module.exports = {

  index: function (req, res) {
  	 res.view();
  },

  table:function (req, res) {

  	var e      = req.session.user.email;
    var rows   = req.query.rows;
    var page   = req.query.page;
    var este   = {"users.email":e};
    //--------------------------------------------------------
              
              Logs.count(este).limit(rows).exec(function(e,c){
                     Logs.find(este).limit(rows).exec(function(e,r){
                     var total = c;
                     var pages = Math.ceil(c/rows);
                     return res.json({code:0,msg:'ok',data:r,pages:{current_page:page, rows:rows, count:total}});
                    })
                })
    //--------------------------------------------------------

 }



}