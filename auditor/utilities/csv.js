/*
	* USE *

	In controller method
	=======================
	  var log = require('../../utilities').logs(Logs)
	  log.create('login', req.session.user.id )
*/

var _csv = {};
var csv = require('csv');
var fs = require('fs');

_csv.query_to_csv2 = function( Model, query, file_name, callback ){
  Model.query(query, function(error, docs){
    if(docs && docs.length > 0){
      var heads = Object.keys(docs[0])
      var csv_string = heads.join(', ') + '\n'

      for( var i in docs){
        var row = []; 
        for (var j in heads) row.push( docs[i][ heads[j] ] )
        csv_string += String(row) + '\n'
      }

      csv_string = String(csv_string).replace(/\n$/, '')

      return callback(null,  { file_name: file_name , csv_string: csv_string })
    }else{
    	return callback({msg: 'Tu query no devuelve datos'}, null)
    }

  })
}

_csv.query_to_csv = function( Model, query, file_name, callback ){
  Model.query(query, function(error, docs){
    if(docs && docs.length > 0){
      var data = [];
      var heads = Object.keys(docs[0])

      data[0] = heads;
   

      //var csv_string = heads.join(', ') + '\n'

      for( var i in docs){
        var row = []; 
        for (var j in heads) row.push( docs[i][ heads[j] ] )
        data.push(row)
      }

      var d = new Date,
    	dformat = [d.getMonth()+1,
               d.getDate(),
               d.getFullYear()].join('-')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
      	//return callback(data)
      var uri = './assets/uploads/files/reports/' + file_name + ' ' + dformat + ".csv";

      csv().from.array(data)
      .to.stream(fs.createWriteStream(uri))
      .on('close',function(count){
      	return callback(null, { uri: uri, data:data});
			})
    }else{
    	return callback({msg: 'Tu query no devuelve datos'}, null)
    }

  })
}



module.exports = _csv;
