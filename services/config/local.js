/**
 * Local Config
 *
 */

/***************************************************************************
*                                                                          *
* More info: https://github.com/ferso/tenant                               *
*                                                                          *
***************************************************************************/

module.exports = {
	name : 'Services',
	port : 8887,
    smtp:{
      user:'activate@iclicauditor.com',
      pass:'auditor321+',
      host:'iclicmail.iclicauditor.com',
      port:587,
      domains:["iclicauditor.com"]
    },
    cdn : {
        username      :'pinochoproject',
        apikey        :'48a104f4f5f21aef36e22c86ecba0e22',
        region        :'DFW',
        url           :'https://6d9f96b734b43c9606d6-6ba33f05d97df9fcbf96589e089a5cac.ssl.cf1.rackcdn.com',
        container     :'auditortest'
    }
};
