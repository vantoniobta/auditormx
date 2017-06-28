module.exports = {

 test:function(req, res){

 	var a  =  req.body;
 	console.log(a)
    res.json({code:0,msg:'ok, nothing here :)'});

}



}
