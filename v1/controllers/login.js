const uid      = require('rand-token').uid


// Check for Empty Documents in Mongo Consults
var checkResponse = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false
  }
  return true
};


module.exports = {

  index: function (req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    // Get POST data and define Api Token
    const api_token_g = 'BlmT5vSl9CsU3Q590PC8vMV9AKzgNtl6'
    const app_token   = String(req.body.token)
    const api_token   = String(req.body.api_token)
    var req_type      = String(req.body.req_type)
    // console.log(req.body)


    // Check that account key and user token are defined
    if( app_token == 'undefined' || api_token == 'undefined'){
      res.json({ code:100 ,msg:'No data Received'})
    }else{

      // Check the Api Token send is equal to the one in system
      if(api_token_g == api_token){

        // Find the Account
        Accounts.tenant('auditor-master').findOne({'apps.token':app_token}).exec(function(e,r){

          if( checkResponse(r) == false ){
            const account_id     = String(r._id)

            for(var x in r.apps){
              if(app_token == r.apps[x].token){
                var current = x;
                r.apps[x].status = 1;

                r.save(function(e,r){
                  if (!e) {
                    res.json({code:0,msg:'ok',data:r.apps[current]});
                    console.log('------------ APP LOGGED IN ----------');
                    console.log(r.apps[current]);
                    console.log('-------------------------------------');
                  }else{
                    res.json({code:400,msg:'Database Error',error:e});
                  }
                });
              }
            }

          }else{
            res.json({ code: 300, msg: 'Data Not found' })
          }
        })

      }else{
        res.json({ code: 200 ,msg: 'Invalid Api Token' })
      }

      // End of error handlings
    }
	},


  tokens : function(res,res){
    var token = uid(32)
    return res.json({token:token})
  },

};
