/**
 * AuditController
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

var fs   = require('fs');
var csv  = require('csv');


var Report = require('../../utilities').Report;
module.exports = {

  /**
   * Action blueprints:
   *    `/locations/index`
   *    `/locations`
   */
  index: function (req, res) {

    // Send a JSON response
    // console.log(req.session.user.id)
    res.view();
  },


  /* upload
  ------------------------------------------------------------ */
  upload : function(req, res){
    var log = require('../../utilities').logs(Logs)

    var csvfile  = req.files.csvfile.path
      , audit_report = new Report(req.files.images, Audit, './assets/uploads/files/audits' );

    var heads = ['code', 'status', 'comments', 'side', 'createAt', 'files']
    
    var response = { success:[], fail:[] }
    csv().from(fs.createReadStream(csvfile), { delimiter: ','})
      .on('record', function(row, index) {
        // if( typeof response == 'undefined') 
        //   response = { success:[], fail:[]}

        if (index > 0) {
           if ( audit_report.existSendFile( row[row.length - 1] )){
            var data = {}
            for (var i in heads) { 
              data[heads[i]] = row[i] 
            }

            audit_report.saveInDB(data, function(error, doc){
              if(error){
                response.fail.push({
                    data: row
                  , msg: 'No se incluyeron todos los archivos de este reporte'
                })
              }
            })
            
           }else{
            response.fail.push({
                data: row
              , msg: 'No se incluyeron todos los archivos de este reporte'
            })
            
           }
           log.create('csv_upload', req.session.user.id ) 
         }
      })
      .on('end', function(count) {
        return res.json( {status:'ok', data: response } );
      })

      
  }

};