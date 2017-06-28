Core_Settings = Core.extend({

  
  run :function(){

    //load parents
    this.init();

  	//load sounds parent
  	this.sounds();

    // this level
    var that = this;
  },
  index : function(){

    // this level
    var that = this;

  	// load object
  	this.run();

    //register products form
    this.registerForm('settingsForm',function(e,data){
        that.save(data);        
        return false;
    });

    //this load
    this.load();
  },
  load : function(){
    var that = this;
    this.get('/settings/get/',function(e,data){
      $.each(data,function(i,o){     
          console.log(i);     
          $('#input-'+i).val(o);
        })
        that.disableForms('productForm','input, textarea, button, select',false);
    });
  },
  save : function(data,cb){
    var that = this;
    this.disableForms('settingsForm','input, textarea, button, select',true);
    this.post('/settings/save',data,function(e,data){
     if(!e){
      window.asound.play();
      bootbox.alert('Los datos fueron guardados correctamente en el sistema y se reflejaran hasta inicio sesión!');    
        that.disableForms('settingsForm','input, textarea, button, select',false);        
        if( typeof(cb) == 'function' ) cb();

     }
    }); 
  }

});