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

    var user = req.session.user;

    console.log( user.supplier_id );

    Provider.findOne({ id: user.supplier_id }).done(function(error, data){
      if (data){
        //var data = { id: data.id }
        res.view({ id: data.id });
      }
    })

  },

  /**
   * Action blueprints:
   *    `/users/create`  
   */
  save : function(req,res){
    var log = util.logs(Logs)
    var mode = req.body.modeForm;
    var data = req.body.provider;

    //data update by 
    data.update_by = req.session.user.id;

    switch(mode){
      case 'update':
       Provider.update({id:data.id},data,function(e,u){
        log.create('profile_changed', req.session.user.id ) 
        res.send(e||u);
       });
      break;
      case 'add':      
        if (data.id) delete data.id
          
        Provider.create(data).done(function(err, provider){
          // Error handling
          if (err) {           
            return res.json({code:100,msg:"Provider cant be created"});
          // The User was created successfully!
          }else {
            console.log([mode, data])
            log.create('Provider Created', req.session.user.id ) 
            return res.json({code:0,msg:"Provider created:",data:provider});
          }
        });
      break;
    }
  },

  /**
   * Action blueprints:
   *    `/users/get`  
   */
  get: function (req, res) {
    var id = req.query.id;    
    res.contentType('application/json');  
    Provider.find(id).done(function(err,doc){
        if( doc.length > 0){
        res.json(doc[0]); 
      }else{
        res.json({'error':100,'msg':'Cant find this provider id'}); 
      }
    });
  },

  
  users: function(req, res){
    var rows = req.query.rows;
    var page = req.query.page ;
    var skip = rows * ( page - 1 );

    User.find( { supplier_id: req.query.provider_id } )
        .skip(skip).limit(rows).sort({ id: 'desc' })
        .done(function(error, docs){
          var counter = docs.length
          var totalpages = Math.ceil(counter / rows )
            return res.json({ code: 0, msg: 'ok', data: docs, pages: {current_page: page, last_page: totalpages, rows: rows}});
        })
  }


};
