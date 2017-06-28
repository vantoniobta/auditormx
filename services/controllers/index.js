const fs 				= require('fs');
const request 	= require('request');

module.exports = {
 index: function (req, res) {
    // Email.test(tenant.config,'erickfernando@gmail.com',function(e,r){
    //     console.log(e||r);
    // });
    res.json({code:0,msg:'ok'})
  },
};
