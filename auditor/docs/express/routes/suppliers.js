
/*
 * GET dashboard
 */

exports.suppliers = function(req, res){
  res.render('suppliers', { title: 'Suppliers' })
};