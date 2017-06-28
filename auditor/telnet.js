	var net  = require('net');
	var host = '10.6.14.116';
	var user = 'administrator';
	var pass = 'quescom';
	var port = 23;


	var conn = net.createConnection({host:host,port:port});//

		conn.on("connection", function(socket) {
			console.log('ok')
			socket.on('data', function(c) {
				console.log(data.toString());
				//data.write(user);
				//data.write(pass);
			    //console.log( data.toString()  );
			    // // Close the client socket completely
			    // client.destroy();

			});

		})



	// Add a 'close' event handler for the client socket
	conn.on('end', function() {
	    console.log('Connection closed');
	});
