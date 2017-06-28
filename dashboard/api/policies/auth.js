/**
 * suth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *  
 if (req.session.authenticated)  {
      return next();  
    }else{
      return res.redirect('/login');  
    }
 */
module.exports = function(req, res, next) {
  
 if (req.session.authenticated)  {
      return next();  
    }else{
      return res.redirect('/login');  
    }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
