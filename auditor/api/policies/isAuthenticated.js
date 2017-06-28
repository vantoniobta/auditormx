/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 *  
 *res.notFound() // 404 response
  res.forbidden() // 403 response
  res.badRequest() // 400 response
 */
module.exports = function(req, res, next) {

  // return res.forbidden("El servicio estará disponible nuevamente el Domingo 21/09/2014 a las 22:00 HRS ",500);    
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
  	 var navigation = req.session.nav;

  	 var controller = ((req.url).split('/'))[1]; 

  	 if( typeof( navigation[controller]) != 'undefined') return next();
  	 	return res.forbidden("No tienes permisos suficientes para accesar este servicio.", 404);  	   
  }
  return res.redirect('/login');
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};
