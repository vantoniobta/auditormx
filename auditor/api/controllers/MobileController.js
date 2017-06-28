/**
 * MobileController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

 function array(excel, db){
  var tmp=[];
  for(var i=0; i<db.length; i++){
    for(var j=0; j<excel.length; j++){
      if(excel[j].key===db[i].key)
        tmp[j]=excel[j];
    }
  }
  return tmp
 }

var excelToMysql = function(str){
      var d = str.split('/');
      return dateValidation( d[2]+'-'+d[1]+'-'+d[0] );

  }

  function dateValidation(date_val){
        var matches = /(\d{2})[-\/](\d{2})[-\/](\d{4})/.exec(date_val);

        if (matches == null){
            return  '';
         }else{
          return date_vall
         }
  }

Function.prototype.bindAll = function() {
    var _function = this;
    var args      = Array.prototype.slice.call(arguments);
    return function() {
      for( var x in args ){
        [].push.call(arguments, args[x]);
      }
      return _function.apply(this,arguments);
    }
}


 function toCreate (csv,indx,total,supplier,cb){

    var csv     = csv;
    var indx     = parseInt(indx) + 1;
    var total    = total;
    var supplier = supplier;

    if( indx < total ){

    //console.log(indx,total, (indx < total) );
    // console.log('--------------------------------------');

      var row = csv[indx];

      // console.log(row);

        var data =  {
          'type':''
          ,'license_plate':''
          ,'code':''
          ,'line':''
          ,'route':''
          ,'sector':''
          ,'station':''
          ,'tren':''
          ,'vagon':''
          ,'place':''
          ,'city':''
          ,'state':''
          ,'structure':''
          ,'base':''
          ,'height':''
          ,'dimensions':''
          ,'format':''
          ,'price':'0'
          ,'tax':''
          ,'release':''
          ,'comments':''
        }

          var i = 0;
          for( var x in data){
             data[x] = typeof(row[i]) == 'string' ? row[i].trim() : row[i];
            i++;
          }

         // console.log(data);

         //data validations -----------------------
         data.supplier_id = supplier;
         data.dimensions  = data.base+'x'+data.height;
         data.tax         = (data.price * 100) / 16;

           if(  data.release  == '' ){
            delete data.release;
          }else{
             var release = excelToMysql(data.release);

             if( release == ''){
                delete data.release;
             }else{
              data.release = release;
             }
          }

          if( row[2].length > 0 ){

            //code line:row[3],route:row[4]
            var where = {supplier_id:supplier,license_plate:data.license_plate,code:data.code,line:data.line};

                console.log(where);
                console.log('--------------------------------------');

                Mobile.find(where).done(function(e,r,indx,toCreate){
                  //------------------------------------------------------------------

                  var action = r.length == 0 ? 'create' : 'update';
                  // console.log(action,r);
                  console.log('--------------------------------------');
                  // toCreate(csv,indx,total,supplier,cb);
                  if( r.length == 0 ){

                    // Mobile Create -----------------------
                    Mobile.create(data).done(function(err,doc,indx,toCreate) {
                       toCreate(csv,indx,total,supplier,cb);
                    }.bindAll(indx,toCreate));

                    }else{

                    // Mobile Update -----------------------
                    Mobile.update(where,data,function(err, doc, indx,toCreate) {
                     toCreate(csv,indx,total,supplier,cb);
                    }.bindAll(indx,toCreate));

                  }

                  //-----------------------------------------------------------------------------

                }.bindAll(indx,toCreate))

            }else{

              toCreate(csv,indx,total,supplier,cb);
            }

          //-------------------------------------------------------------------------------------

    }else{
      console.log(indx,total, (indx < total) , 'finished' );
      console.log('--------------------------------------');
      return cb({code:0,msg:'Location created'});
    }

}

module.exports = {



  /**
   * Action blueprints:
   *    `/buses/index`
   *    `/buses`
   */
  index: function (req, res) {
    // Send a JSON response
    res.view();
  },

   /**
   * Action blueprints:
   *    `/buses/view`
   *    `/buses`
   */
  view: function (req, res) {

    if( req.param('id') ){
      var id = req.param('id');
      Mobile.findOne(id).done(function(e,doc){
          return res.view({id:doc.id,uuid:doc.uuid});
      });

    }else{
      res.redirect('/locations');
    }

  },

  status: function (req, res) {

    res.contentType('application/json');

    var id   = req.query.id;


    res.contentType('application/json');

    var rows      = req.query.rows;
    var page      = req.query.page;
    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
    var role      = parseInt(req.session.user.role);
    var supplier  = req.session.user.supplier_id;
    var skip = rows * ( page - 1 );

      var where      = { uuid_object: id };
      var wherecount = {}


      if( keyword ){
          where.or = [{uuid:keyword}];
      }

      Vwstatus.count(where).done(function(e,c){
        Vwstatus.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
              var totalpages = Math.ceil(c / rows )
              return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
        });
      });

  },

  laststatus: function (req, res) {
    res.contentType('application/json');

    var fs      = require("fs");
    var path    = require("path");
    var mkdirp  = require('mkdirp');
    var isUtf8  = require('is-utf8');
    var id      = req.query.id;

    Status.findOne({uuid_object:id}).sort('id DESC').done(function(e,r){

      if( e ){
        return res.send({code:100,msg:'No Status exist for this item '});
      }

      if(r){
        return res.send({code:0,msg:'ok',dir:r.id, data: r.snapshots.split(',') });       
      }

      return res.send({code:0,msg:'ok',dir:0, data:''});
      // if( typeof(r) != 'undefined' ) {
      //   var dir   = path.resolve( __dirname +'/../../assets/uploads/status/'+ r.id );

      //    mkdirp(dir, function(err) {

      //     var wpath = '/uploads/status/'+r.id;
      //         fs.exists(dir, function(exists) {

      //           if( exists ){

      //             fs.readdir(dir, function (err, files) {
      //               if (!err) {
      //                 for( x in files){
      //                     files[x] = wpath+'/'+files[x];
      //                     console.log('------------------------------------------------');
      //                 }
      //                 return res.send({code:0,msg:'ok',data:files});
      //               }else{
      //                 return res.send({code:101,msg:'Error to read this directory'});
      //               }
      //             });

      //           }else{
      //             return res.send({code:102,msg:'directory does not exists ',data:wpath});
      //           }

      //         });


      //    })

      // }else{
      //  return res.send({code:100,msg:'Error to read last status'});
      // }
    });

  },

  upload : function(req, res){
      // return res.send({});
      var log = require('../../utilities').logs(Logs)
      var fs   = require('fs');
      var csv  = require('csv');
      var tmp  = req.files.csvfile.ws.path
      var opts = '';

       // supplier id
      var supplier  = req.session.user.supplier_id;

      csv().from(tmp, { delimiter: ',', escape: '"' })
      .to.array( function(data){

        toCreate(data,0 ,data.length,supplier,function(){
          log.create('csv_upload', req.session.user.id )
          return res.send({code:0,msg:'Mobile created'});
        });

      }).on('error', function(error){
        return res.send({code:100,msg:'Error to upload this file',data:wpath});
      }).on('end', function(o){

      });

  },

  get: function (req, res) {
    var id = req.query.id;
    res.contentType('application/json');
    Mobile.find(id).done(function(err,doc){
        if( doc.length > 0){
        res.json(doc[0]);
      }else{
        res.json({'error':0,'msg':'Cant find this provider id'});
      }
    });
  },

  table: function (req, res) {

    res.contentType('application/json');

    var rows      = req.query.rows;
    var page      = req.query.page;
    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
    var sortfield = typeof(req.query.sortfield) == 'undefined' ? 'id' : req.query.sortfield;
    var sortby    = typeof(req.query.sortby) == 'undefined' ? 'desc' : req.query.sortby;
    var role      = parseInt(req.session.user.role);
    var supplier  = req.session.user.supplier_id;
    var skip = rows * ( page - 1 );


    if( [1,2].indexOf(role) > -1   ){

      var state      = typeof(req.query.state)    == 'undefined' ? null : req.query.state;
      var provider   = typeof(req.query.provider) == 'undefined' ? null : req.query.provider;
      var active     = typeof(req.query.active) == 'undefined' ? null : req.query.active;
      var where      = {};
      var wherecount = {}

      if( state && state != '*'){
          where.state = state;
      }
      if( provider && provider != '*'){
          where.supplier_id = provider;
      }

       if( active && active != '*'){
          where.active = active;
      }

      if( keyword ){
          var keyword  = keyword.trim();
          // where.or = [{uuid:keyword},{license_plate:keyword},{code:keyword}];
          where.or = [ { like:{uuid: '%'+keyword +'%'} }, { like: {code: '%'+keyword+'%'} },{ like: {license_plate: '%'+keyword+'%'} }];
      }

      Vwmobile.count(where).done(function(e,c){
        Vwmobile.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,data){
              var totalpages = Math.ceil( c/rows )
              return res.json({code:0,msg:'ok',data:data,pages:{current_page:page,last_page:totalpages,rows:rows}});
        });
      });
    }

    if( [1,2].indexOf(role) == -1 ){

      var where = {supplier_id: supplier };

      if( keyword ){
          var keyword  = keyword.trim();
          // where.or = [{uuid:keyword},{license_plate:keyword},{code:keyword}];
          where.or = [ { like:{uuid: '%'+keyword +'%'} }, { like: {code: '%'+keyword+'%'} },{ like: {license_plate: '%'+keyword+'%'} }];
      }

      Vwmobile.count(where).done(function(e,c){
        Vwmobile.find(where).sort(sortfield+' '+sortby).paginate({page:page,limit:rows}).done(function(e,r){
              var totalpages = Math.ceil(c / rows )
              return res.send({code:0,msg:'ok',data:r,pages:{current_page:page,last_page:totalpages,rows:rows}});
        });
      });
    }

  },

  statetable : function(req,res){
     Mobile.query('SELECT state FROM mobile GROUP BY state',function(e,r){
         return res.send(r); //console.log(r)
     });
  },

   	report :function(req,res){

		 var fs      = require('fs');
		 var path    = require("path");
		 var crypto  = require("crypto");
		 var mkdirp  = require('mkdirp');
	   var im   	 = require('imagemagick');
		 var user    = req.session.user.id;
		 var id      = req.body.report.id;
		 var type    = req.body.report.type;
		 var message = req.body.report.message;
		 var stamp   = new Date().getTime();

			//-------------------------------------------------------------------------------------------------------
			var data = {
					uuid_object : id,
					user_id : user,
					message : message,
					type:type,
					status:type,
					stamp : stamp,
			}

			Status.create(data).done(function(err,s){

				var dir 	 = path.resolve( __dirname +'/../../assets/uploads/status/'+ s.id );
				var thenames = [];
				mkdirp(dir, function(err) {

					if(!err){
					//-------------------------------------------------------------------------------------------------------
						if( Object.prototype.toString.call( req.files.images_upload ) === '[object Array]' ) {

							var max = req.files.images_upload.length;
							var atmp = [];
							for( x in req.files.images_upload ){

								var tmp 	 = req.files.images_upload[x].path;
								var rname  = req.files.images_upload[x].originalFilename;
								var ext    = rname.split('.').slice(-1)[0];
								var name   = crypto.randomBytes(16).toString('hex')+'.'+ext;

								//HSmith123

								var newPath     = dir +'/'+ name;
								var tmb_newPath = dir +'/tmb_'+ name;
								var data  		  = fs.readFileSync(tmp);

										fs.writeFileSync(newPath,data);
										fs.unlinkSync(tmp);

										console.log(data);
										console.log( '------------------------------------------------------------------------------------' );

										im.resize({
												srcData: data,
												dstPath: tmb_newPath,
												width: 100,
												height: 75,
												format: 'jpg'
										}, function(err, stdout, stderr) {

												if(err){
													console.log(err)
												}

												console.log('finished');
										});


								thenames.push(name);
								// fs.writeFileSync(newPath,data);
								// fs.unlinkSync(tmp);

								// console.log(name);
								// console.log( '------------------------------------------------------------------------------------' );

							}

							Status.findOne(s.id).done(function(e,r){
									r.snapshots = thenames.toString();
									r.save(function(){
										res.send({code:0,msg:'Los archivos subieron correctamente!'});
									})

							});

						}else{
							var tmp 	= req.files.images_upload.path;
							var rname  = req.files.images_upload.originalFilename;
							var ext    = rname.split('.').slice(-1)[0];
							var name   = crypto.randomBytes(16).toString('hex')+'.'+ext;


								//-------------------------------------------------------------------------------------------------------

									fs.readFile(tmp, function (err, data,name,rname,dir) {

										var newPath = dir +'/'+ name;

										 fs.writeFile(newPath, data, function (err) {
															// console.log(rname, newPath ,(err||'saved'));
														fs.unlinkSync(tmp);

														Status.findOne(s.id).done(function(e,r){
												r.snapshots = name;
												r.save(function(){
													res.send({code:0,msg:'Los archivos subieron correctamente!'});
												})

										});

														console.log((err||'saved'));
														console.log( '------------------------------------------------------------------------------------' );

															 res.send({code:0,msg:'Los archivos subieron correctamente!'});
													});

									}.bindAll(name,rname,dir));
								//-------------------------------------------------------------------------------------------------------


						}
							 //-------------------------------------------------------------------------------------------------------
					}else{
						res.send({code:100,msg:'error al crear el directorio'});
					}
				});
				//-------------------------------------------------------------------------------------------------------
			});
		//-------------------------------------------------------------------------------------------------------
	},
    statusdelete: function (req, res) {

    if( req.param('uuid') ){

      var status_uuid = req.param('uuid');
      var ssuser_id = req.session.user.id

      var qrs = " SELECT uuid \
                  FROM status \
                  WHERE uuid='" + status_uuid + "'";


      Status.query(qrs, function(error, docs){
        if(error){
          return res.json({'code':200,'msg':'Problemas en la Base de Datos, intente de nuevo más tarde'})
        }else if (docs.length > 0 ){

          Status.destroy({uuid: docs[0].uuid }, function(error){
            if(!error) return res.json({'code':0,'msg':'Estatus eliminando'});
            else return res.json({'code':0,'msg':'Estatus no eliminado'});
          })
        }else{
          return res.json({'code':200,'msg':'No tienes los permisos para eliminar este estatus'})
        }
      })
    }else{
      return res.json({'code':200,'msg':'No existe el status indicado'})
    }

  }

};
