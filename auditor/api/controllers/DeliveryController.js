/**
 * DeliveryController
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
var _ = require('underscore');

module.exports = {
  /**
   * Action blueprints:
   *    `/delivery/index`
   *    `/delivery`
   */
   index: function (req, res) {
    
    // Send a JSON response
    return res.view({
      hello: 'world'
    });
  },

  save_address: function (req, res) {
      var data = req.body
      data.provider_id = req.session.user.id; 
    
      
      Delivery.create(data).done(function(error, data){
        if (error) {                      
          console.log('created errr:', data.release);      
          return res.send({code:100,msg:'Error when system trying to create',error: error});
        }else{
          console.log('Data saved');
          return res.send( {code:0,msg:'Address created'} );             
          //return res.json(states);
        }
      })

  },

  table: function (req, res) {
      var data = req.body
      //data.provider_id = req.session.user.id; 

      res.contentType('application/json');

        var rows      = req.query.rows;
        var page      = req.query.page || 1;
        var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
        var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;    
        var role      = req.session.user.role;
        var supplier  = req.session.user.supplier_id;
        var skip = rows * ( page - 1 );

        /*
        if( role == 'admin'  ){    

          var state    = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
          var provider = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;      
          var where    = {}; 

          if( state && state != '*'){
              where.state = state;
          }
          if( state && provider != '*'){
              where.supplier_id = provider;
          }


          Buses.count().done(function(e,c){
            Buses.find(where).skip().limit(rows).sort(sortfield+' '+sortby).done(function(e,data){            
                  var totalpages = Math.ceil(c / rows )
                  return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
            });
          });
        }
        */

        //if( role == 'supplier' ){
          // Buses.count({supplier_id: supplier }).done(function(e,c){
          //   Buses.find({supplier_id: supplier }).sort(sortfield+' '+sortby).paginate({page:page,limit:1}).done(function(e,r){            
          //         var totalpages = Math.ceil(c / rows )
          //         return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
          //   });
          // });
        //}
       
        Delivery.count().done(function(e,c){
          //if (!e && c > 0){
            Delivery.find().sort(sortfield+' '+sortby).paginate({page:page,limit:10}).done(function(error, docs){
              if (error) {                      
                console.log('created errr:', data.release);      
                return res.send({code:100,msg:'Error when system trying to create',error: error});
              }else{
                var totalpages = Math.ceil(c / rows )
                //console.log({current_page:page,last_page:totalpages,rows:rows})
                return res.send({
                  code:0,
                  msg:'ok',
                  data:docs,
                  pages:{current_page:page,last_page:totalpages,rows:rows}
                });
                //return res.send( {code:0,msg:'Address created'} );             
                //return res.json(states);
              }
            })
          //}
          //return res.send({code:100,msg:'Error when system trying to create',error: error});
        });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DeliveryController)
   */
  _config: {}

  
};
