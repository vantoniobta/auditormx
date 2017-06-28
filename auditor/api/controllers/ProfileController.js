/**
 * SettingsController
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

_ = require('underscore');

var util = require('../../utilities')
var notifications = util.notifications;

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/settings/index` 
   *    `/settings`
   */
   index: function (req, res) {
    User.findOne(req.session.user.id).done(function(e,user){
      // Send a JSON response
      if(!e){
        delete user['password'];

        var data = { 
            user: user 
          , states : {}
        }
        
        res.view(data);
      }

    });
   
  },

 /**
 * Action blueprints:
 *    `/users/create`  
 */
  save : function(req,res){
    var log = require('../../utilities').logs(Logs)
    var mode = req.body.modeForm;
    var data = req.body.user;
   
    switch(mode){
      case 'update':
        if( typeof(data.password) == 'undefined'){
           User.update({id:data.id},data,function(error,user){
                  if (error) res.send(error);
                  if (user){
                    if (thePassword != undefined){
                      var msg_data = {
                          subject: "IClic Auditor: Cambio de Password"
                        , text : { 
                              subject: "Cambio de Password"
                            , main_message: 
                                "Ha cambiado exitosamente su password: "
                            , second_message :
                                "<li> Nueva password: <b>" + thePassword + "</b> </li>"
                          }
                        , mail: data.email 
                      }                      
                      notifications.mail( msg_data, 'index.ejs', null )
                    }
                    log.create('profile_changed', req.session.user.id ) 
                    res.send(user);
                  }
               });          
        }else{
          var bcrypt = require('bcrypt');
          var thePassword = data.password 
          bcrypt.hash(thePassword, 10, function(err, hash) {         
              data.password = hash;
                User.update({id:data.id},data,function(error,user){
                  if (error) res.send(error);
                  if (user){
                    if (thePassword != undefined){
                      var msg_data = {
                          subject: "IClic Auditor: Cambio de Password"
                        , text : { 
                              subject: "Cambio de Password"
                            , main_message: 
                                "Ha cambiado exitosamente su password: "
                            , second_message :
                                "<li> Nueva password: <b>" + thePassword + "</b> </li>"

                          }
                        , mail: data.email 
                      }
                      // notifications.mail(data, template, attachment )
                      notifications.mail( msg_data, 'index.ejs', null )
                    }
                    log.create('profile_changed', req.session.user.id ) 
                    res.send(user);
                  }
               });          
          });
        }    
      break;      
    }
  },

  get_settings: function(req,res){
    Settings.findOne().done(function(error, data){
      if (data) return data
    })
  }
  
};
