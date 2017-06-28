var jsonCheck = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
};

module.exports = {
  index: function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };
    
    // res.send('ok');
    var api_token_g = 'BlmT5vSl9CsU3Q590PC8vMV9AKzgNtl6';
    var api_token = req.body.api_token;
    var session_token = req.body.token;
    console.log(session_token);

    var fs          = require('fs');
    var uid         = require('rand-token').uid;
    var body_send   = req.body;
    var images      = req.body.images;
    var img_size = Object.size(images);

    if( (typeof session_token) != undefined ){
    	Tokens.tenant('auditor-master').findOne({token:session_token}).exec(function(e,r){
	    	if( jsonCheck(r) == false ){
	    		console.log(r);
	    	}else{
	    		res.json({code:300,msg:"Data Not found"});
	    	}

	    });

    }else{
    	res.json({code:500,msg:"Invalid User Token"});
    }

    
    

    // if(api_token_g == api_token && (typeof api_token) != undefined){
    //   var folder = uid(8);
    //   var dir = './uploads/'+folder;

    //   if (!fs.existsSync(dir)){
    //     fs.mkdirSync(dir);
    //   }

    //   var uploaded_files = {};

    //   for(var name in images) {
    //     console.log(name);
    //     var upload_img = images[name];
    //     // console.log(upload_img);
    //     var file_path = dir+"/"+folder+"-"+name+".jpg";
    //     // console.log("------------"+file_path);

    //     fs.writeFile(file_path, upload_img, 'binary', function(err) {
    //       console.log(file_path);
    //     });
    //   }

    // }else{
    //   res.json({code:200,msg:"Invalid Api Token"});
    // }
  },
};
