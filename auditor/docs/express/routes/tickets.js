
/*
 * GET dashboard
 */

exports.tickets = function(req, res){
  res.render('tickets', { title: 'Tickets' })
};