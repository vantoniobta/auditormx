/**
 * MailListController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var notifications = require('../../utilities/').notifications
var _ = require('underscore')



module.exports = {    
  /**
   * Action blueprints:
   *    `/profile/index`
   *    `/profile`
   */
  index: function (req, res) {
    
    // Send a JSON response
    res.view();
  },

  send: function (req, res) {
    var role = req.body.role;
    var subject = req.body.subject;
    var text = req.body.text;
    
    var send_mails = function(role, subject, text){
      User.find( {role: role} ).done(function(error, docs){
        if (error) return []
        if (docs){
          var mails =  _.unique( _.pluck(docs, 'email') ) ;

          var msg_data = {
              subject: "IClic Auditor: " + subject
            , text : { 
                  subject: subject
                , message: text
              }
          }
          var attachment = null

          _.map(mails, function(mail){
            msg_data.mail = mail
            notifications.mail( msg_data, 'mailist.ejs', attachment )
          })
        
          return res.json({ error:0, msg:'enviado correctamente' })
        }


      })
    }

    send_mails(role, subject, text)
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProfileController)
   */
  _config: {}

  
};
