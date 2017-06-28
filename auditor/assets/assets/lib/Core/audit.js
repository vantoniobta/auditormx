Core_Audit = Core.extend({  
  run : function(id){

    //id
    this.id = id;
    
    //refer to this object
    var that = this;   
    
    this.upload_audit();
    
    
  },  
  /*@reset
  ---------------------------------*/
  reset : function(){    
   
  },
  setup : function(){
    /*--- refer to this object -- */
   
    
  },
  upload_audit: function(){
    $('#upload-audit-form').upload({
        input: $(this).attr('id'),
        source:'/audit/upload',      
        onComplete: function(res){
          console.log(res)
        }
    });  
  }

});