const fs 				= require('fs');
const request 	= require('request');

module.exports = {
 index: function (req, res) {
 		var formData = {
		  width: 200,
		  file: fs.createReadStream('/Users/ferso/Desktop/Screen Shot 2016-05-27 at 7.54.15 PM.png'),  
		};
		request.post({url:'http://localhost:8890', formData: formData}, function optionalCallback(err, response, body) {
		  if (err) {
		    return console.error('upload failed:', err);
		  }
		  res.json(JSON.parse(body));
		});     
  }




};
