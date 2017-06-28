/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
   attributes: {
      list : {
         type: 'string',
         required:true,
         index:1
      },
      name : {
         type: 'string',
         required:true,
         index:1
      },
      src:{
         type: 'string',
         require:true,
         index:1
      },
      extension:{
         type: 'string',
         require:true,
         index:1
      },
      mime:{
         type: 'string',
         require:true,
         index:1
      },
      status:{
         type: 'integer',
         require:true,
         index:1
      },
      progress:{
         type: 'string',
         require:true,
         index:1
      }
   }
};
