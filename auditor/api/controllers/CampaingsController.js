/**
 * CampaingsController
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

var utils   = require('../../utilities');
var _       = require("underscore");
var private = {};

private.safeFilename = function(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}

private.fileExtension = function(fileName) {
  return fileName.split('.').slice(-1);
}

private.createArtLocations = function (art, list_id, callback){
  List_location.find( {list_id : list_id} ).done(function(err,docs){
    if(err) return callback(err, null, [])

    if( docs.length > 0){
      _.map(docs, function(doc){
        Art_location.create( { art_id: art.id, location_id: doc.location_id}).done( function(e, data){
		if(e){ console.log(e) }
		if(data){ console.log(data)}
	} )
      })
      // envia la lista de los location_ids
      return callback(null, art.name, _.pluck(docs, 'location_id'))
    }else{
      err = {'error':0,'msg':'Cant find this provider id'}
      return callback(err, null, [])
      //res.json();
    }
  });
}

private.sendNotifications = function(art_id, user_mail){
  if (error)
    return res.json(error);
    //return console.log(error)

  var get_data = function(c1, c2){

    var query = " SELECT provider.id, provider.email, location.street   \
                FROM provider, location \
                WHERE \
                  location.id IN ( \
                    SELECT location_id FROM art_location WHERE art_id = " + art_id + " \
                  )\
                  AND location.supplier_id = provider.id ";

    Provider.query(query, function(e,docs){
      //if (e)
      if(docs){
        c2(docs);
        c1(docs);
      }
    });
  }

  var send_to_creator = function(mail){
    var msg_data = {
          subject: "IClic Auditor: Alta de Cuenta"
        , text : {
            subject: "Alta de Cuenta"
          , main_message:
              "Ha creado exitosamente un nuevo arte llamado" + data.name + " \
               para la campaña: " + data.campaing_id
          , second_message :""

        }
      , mail: user.email
      };

    utils.notifications.mail( msg_data, 'campaing.ejs', null )
  }

  var send_to_provider = function(docs){
    providers = {}
    _.map(docs, function(doc){
      if ( doc.id in providers ){
        providers[doc.id].addresses += '<li>' + doc.street + '</li>'
      }else{
        providers[doc.id] = {
            'provider_mail' : doc.email
          , 'addresses': '<li>' + doc.street + '</li>'
        }
      }
    })

    _.map(providers, function(item){
      var msg_data = {
          subject: "IClic Auditor: Sitios agregados al Arte " + art_name
        , text : {
              subject: "Sitios agregados al Arte " + art_name
            , main_message:
                "Usted ha agregado exitosamente las siguientes \
                 direcciones al Arte '" + art_name  + "': "
            , second_message :
                "<ul>" + item.addresses + "</ul>"

          }
        , mail: item.email
      }

      utils.notifications.mail( msg_data, 'campaing.ejs', null )
    })
  }


  var send_to_rest = function(docs){
    var addresses = _.pluck( docs, 'street');
    User.find( { role: ['admin', 'printer', 'auditor'] } ).done(function(err, docs){
      if (docs){

        var address_items = _.reduce( addresses, function(memo, item){
            return memo + '<li>' + item + '</li>';
          }, ''
        );

        _.map(docs, function(doc){

          var msg_data = {
              subject: "IClic Auditor: Sitios agregados al Arte " + art_name
            , text : {
                  subject: "Sitios agregados al Arte " + art_name
                , main_message:
                    "Usted ha agregado exitosamente las siguientes \
                     direcciones al Arte " + art_name  + ": "
                , second_message :
                    "<ul>" + doc.addresses + "</ul>"

              }
            , mail: doc.email
          }

          utils.notifications.mail( msg_data, 'campaing.ejs', null )

        })

      }
    })
  }

  send_to_creator(user_mail)
  get_data(send_to_provider, send_to_rest)
}

private.get


module.exports = {

  /**
   * Action blueprints:
   *    `/campaings/index`
   *    `/campaings`
   */
  index: function (req, res) {

    // Send a JSON response
    res.view();
  },

   /**
   * Action blueprints:
   *    `/campaings/view`
   *    `/campaings`
   */
  view: function (req, res) {

    if( req.param('id') ){
      var id = req.param('id');
      return res.view({id:id});
    }else{
      return res.view({id:0});
    }

  },
  /**
   * Action blueprints:
   *    `/campaings/get`
   */
  get: function (req, res) {
    var id = req.query.id;
    res.contentType('application/json');
    Campaing.find(id).done(function(err,doc){
        if( doc.length > 0){
        res.json(doc[0]);
      }else{
        res.json({'error':0,'msg':'Cant find this provider id'});
      }
    });
  },
  /**
   * Action blueprints:
   *    `/campaings/delete`
   */
  delete: function (req, res) {
   var id = req.body.id;
   res.contentType('application/json');
   Campaing.destroy({id:id},function(e){
      return res.json({'code':0,'msg':'Campaing deleted'});
   });
  },
  /**
   * Action blueprints:
   *    `/campaings/create`
   */
  save : function(req,res){

    var mode = req.body.modeForm;
    var data = req.body.campaing;


    switch(mode){
      case 'update':
       Campaing.update({id:data.id},data,function(e,u){
        res.send(e||u);
       });
      break;
      case 'add':

        delete data.id
        data.status     = 1;
        data.account_id = 1;

        Campaing.create(data).done(function(err, campaing){
          // Error handling
          if (err) {
            return res.json({code:100,msg:"Campaing cant be created"});
          // The User was created successfully!
          }else {
            return res.json({code:0,msg:"Campaing created:",data:campaing});
          }
        });
      break;
    }
  },
  /**
   * Action blueprints:
   *    `/campaings/table`
   */
  all : function(req, res){
    res.contentType('application/json');

    Campaing.find().done(function(e,docs){
       if (e) {
            res.json({code:100,msg:'Error en la ocnsulta'});
         }else{
          res.json({code:0,msg:'ok',data:docs});
         }
    });
  },
  /**
   * Action blueprints:
   *    `/users/table`
   */
  table : function(req, res){
    res.contentType('application/json');
    var rows = req.query.rows;
    var page = req.query.page ;
    var skip = rows * ( page - 1 );
    Campaing.find().skip(skip).limit(rows).sort({id:'desc' }).done(function(e,docs){
      if (e) {
        return res.send({code:100,msg:'Error en la consulta'});
      }else{
        Campaing.count(function(error,counter){
          var totalpages = Math.ceil(counter / rows )
          return res.send({code:0,msg:'ok',data:docs,pages:{current_page:page,last_page:totalpages,rows:rows}});
        })
      }
    });
  },

  save_art : function(req, res){

    res.contentType('application/json');

    var user   = req.session.user;
    var inputs = req.body.art;
    var data   = {
        name: inputs.name
      , campaing_id: inputs.campaing_id
      , status: 1
      , created_by: user.id
      , update_by: user.id
    };

    Art.create(data).done(function(e,a){
      if(e){
        return res.json(500,{code:100,msg:'Server Error, try'});
      }else if(a){

        return res.json({code:0,msg:'Art was added'});
      }
    });
  },

  save_version: function(req, res){
    req.body = JSON.parse(JSON.stringify(req.body));
    var data = {};
    var campaing_art = req.body['campaing-art'].split('-');
    var campaing_id= campaing_art[0]

    data = {
        art_id: campaing_art[1]
      , dimensions: req.body.dimensions
    }

      var UPLOAD_PATH = './assets/uploads/files/campaings'

      var file = req.files[ data.dimensions.replace(/\./g,'-') + '_image' ],
          id = "campaing-" + campaing_id,
          fileName = data.dimensions + "." + private.fileExtension(private.safeFilename(file.name)),
          dirPath = UPLOAD_PATH + '/' + id + '/' + "art-" + data.art_id,
          filePath = dirPath + '/' + fileName;

      data.route =  filePath.replace('./assets', '')

      Version.create(data).done(function(e, doc){
        if (e){
          console.log(e)
          res.json(e)
        }else if(doc){

          utils.upload.photo(file, id, fileName, dirPath, function(error, data){
            if(error) return res.json(error)
            else return res.json( {status:'ok', data: doc} )
          })

        }
      })

  },

  uploadlocations : function(req, res){
    res.contentType('application/json');
    res.send({codekey: "value" });
  },

  /**
   * Action blueprints:
   *    `/users/table`
   */
  recents : function(req, res){

    res.contentType('application/json');
    Campaing.find({},{name:1}).sort({ createdAt: 'desc' }).limit(4).done(function(e,docs){
       if (e) {
            res.json({code:100,msg:'Error en la ocnsulta'});
         }else{
          res.json({code:0,msg:'ok',data:docs});
         }
    });

  },

  arts_table: function (req, res) {

    res.contentType('application/json');
    var rows      = req.query.rows;
    var page      = req.query.page;
    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
    var skip = rows * ( page - 1 );

      var state      = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
      var provider   = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
      var active     = typeof(req.query.active) == 'undefined' ? null : req.query.active;

      var campaing_id = req.query.campaing_id
      var where = { campaing_id: req.query.campaing_id };
      var wherecount = {}

      Vwart.count(where).done(function(e,c){
        Vwart.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
          var totalpages = Math.ceil( c/rows )
          data.campaing_id = campaing_id
          return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
        });
      });
  },

  arts_by_campaing: function(req, res){
    Art.find( { campaing_id: req.body.campaing_id  } ).done(function(error, docs){
      if (error) return res.json(error)
      else if (docs){
        return res.json( { code:0, msg:'ok', data:docs }  );
      }
    })
  },

  send_notifications: function(req, res){
    var art_id = req.body.art_id
      , art_name = req.body.art_name
      , user = req.session.user;

    var get_data = function(c1, c2){

      var query = " SELECT provider.id, provider.email, location.street   \
                  FROM provider, location \
                  WHERE \
                    location.id IN ( \
                      SELECT location_id FROM art_location WHERE art_id = " + art_id + " \
                    )\
                    AND location.supplier_id = provider.id ";

      Provider.query(query, function(e,docs){
        if (e) return
        if(docs){
          c2(docs);
          c1(docs);
        }
      });
    }

    var send_to_creator = function(mail){
      var msg_data = {
            subject: "IClic Auditor: Alta de Cuenta"
          , text : {
              subject: "Alta de Cuenta"
            , main_message:
                "Ha creado exitosamente un nuevo arte llamado '" + art_name + "'"
            , second_message :""

          }
        , mail: user.email
        };

      utils.notifications.mail( msg_data, 'campaing.ejs', null )
    }

    var send_to_provider = function(docs){
      providers = {}
      _.map(docs, function(doc){
        if ( doc.id in providers ){
          providers[doc.id].addresses += '<li>' + doc.street + '</li>'
        }else{
          providers[doc.id] = {
              'provider_mail' : doc.email
            , 'addresses': '<li>' + doc.street + '</li>'
          }
        }
      })

      _.map(providers, function(item){
        var msg_data = {
            subject: "IClic Auditor: Sitios agregados al Arte " + art_name
          , text : {
                subject: "Sitios agregados al Arte " + art_name
              , main_message:
                  "Usted ha agregado exitosamente las siguientes \
                   direcciones al Arte '" + art_name  + "': "
              , second_message :
                  "<ul>" + item.addresses + "</ul>"

            }
          , mail: item.email
        }

        utils.notifications.mail( msg_data, 'campaing.ejs', null )
      })
    }


    var send_to_rest = function(docs){
      var addresses = _.pluck( docs, 'street');
      User.find( { role: ['admin', 'printer', 'auditor'] } ).done(function(err, docs){
        if (docs){

          var address_items = _.reduce( addresses, function(memo, item){
              return memo + '<li>' + item + '</li>';
            }, ''
          );

          _.map(docs, function(doc){

            var msg_data = {
                subject: "IClic Auditor: Sitios agregados al Arte " + art_name
              , text : {
                    subject: "Sitios agregados al Arte " + art_name
                  , main_message:
                      "Usted ha agregado exitosamente las siguientes \
                       direcciones al Arte " + art_name  + ": "
                  , second_message :
                      "<ul>" + doc.addresses + "</ul>"

                }
              , mail: doc.email
            }

            utils.notifications.mail( msg_data, 'campaing.ejs', null )

          })

        }
      })
    }

    Art.update({ id: art_id }, {status:2}, function(error,u){
        //res.send(e||u);
      if (!error){
        send_to_creator(user.email)
        get_data(send_to_provider, send_to_rest)
        res.json({ status : 'ok'})
      }else{
        res.json(error)

      }
    })
  },

  art: function(req, res){
    if( req.param('id') ){
      var art_id = req.param('id');
      var campaing_id = req.param('campaing_id');

      var n_art_id = art_id.split('-')[1]
      var type = req.body['type'] || ""

      var query = 'SELECT location.dimensions, COUNT(*) AS quantity, location.type \
                   FROM art_location, location \
                   WHERE art_location.art_id = ' + n_art_id + ' \
                   AND location.dimensions IS NOT NULL '

        if( req.body['type']) {
          query += 'AND location.type = "' + type + '" '
        }
          query +='GROUP BY location.dimensions';

      Art.query(query, function(error, docs) {
        if(error){
          return res.json(error)
        }else if(docs){
          if(docs.length > 0){
            //cambiar puntos por '-' para que al imprimirse en la vista se puedan manipular con jquery
            var all_types = _.pluck(docs, 'type')
            console.log(all_types)
            for(i in docs){ docs[i].label = docs[i].dimensions.replace(/\./g,'-') }
            return res.view( { id: art_id, campaing_id: campaing_id, versions: docs, type: type, all_types: all_types } );
          }
        }
      })

    }
  },

  version_list: function(req, res){
    var query = { art_id: req.body.art_id }

    Version.find(query).done(function(error, docs){
      if(error) res.json(error)
      if(docs){
        var result = {}
        _.map(docs, function(doc){
          var id = doc.dimensions
          if( !(id in result) ) result[id] = []
          result[id].push(doc)
        })

        res.json(result)
      }
    })
  },

  sites_by_art_dimension: function(req, res){
    var art_id = req.query.art_id;
    var dimensions = req.query.dimension;

    var rows = req.query.rows;
    var page = req.query.page || 1;
    var skip = rows * ( page - 1 );
    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
    //var supplier  = req.session.user.supplier_id;

    var query = 'SELECT  location.material, location.street \
                       , location.zip, location.city, location.state \
                 FROM art_location, location \
                 WHERE location.dimensions = "' + dimensions + '"\
                 AND art_location.art_id = ' + art_id + '\
                 ORDER BY location.' + sortfield + ' ' + sortby + '\
                 LIMIT ' + rows + ' OFFSET ' + skip


    Location.query(query, function(error, docs) {
      if(error) return res.json(error)
      if(docs){
        var totalpages = Math.ceil( docs.length/rows )
        var data = {code:0,msg:'ok',data:docs,pages:{current_page:page,last_page:totalpages,rows:rows}}
        return res.json(data);
      }
    })


  }
}
