var fs     = require('fs'),
	colors = require('colors');

var path   = '/media/backup/uploads/status/';
var dir = fs.readdirSync(path);

for ( x in dir ){
	var status = dir[x];
	var stats = fs.statSync(path + status);

	if( stats.isDirectory() ){			
		var sstdir = fs.readdirSync(path + status);
		console.log( status, sstdir.toString() );
	}	 
	console.log('--------------------------------------------------------------'.grey)

}

//'http://iclicauditor.com/'+status+'/'+