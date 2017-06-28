
Validation = new function(){

  this.purge = function () {
    var arr = window.fields;
    var i,
      len=arr.length,
      out=[],
      obj={};
     for (i=0;i<len;i++) {
      obj[arr[i]]=0;
     }
     for (i in obj) {
       out.push(i);
     }
     window.fields = out;
  }
  this.tab = function(t){ 
    window.thetab = t;
    //fields
    window.fields = []; 
    //clear all error validtions
    $('#newLocation .success').removeClass('success');
    $('#newLocation .error').removeClass('error');
    //Text inputs
    this.textIsValid(t);
    this.radioIsValid(t);
    this.selectValid(t);
    this.init();
  }

  this.init = function(){
      if( window.fields.length == 0){
        return true;
      }else{ 
        return false;
      }
  }
  this.isValid = function(){  

      window.fields = [];
      this.textValidator();
      this.radioValidator();
      this.selectValidator();

      $('.error').addClass('success');   
      $('.error').removeClass('error').addClass('success');           

      if( this.init() ){        
        return true;
      }else{        
        var nf = window.fields.length;
        for(i=0; i < nf; i++){
          $('.success').removeClass('success');
          $( window.fields[i] ).closest(".control-group").addClass('error');         
        }
        return false;
      }
  }

  this.textValidator = function(){
    var t     = window.thetab;
    var that  = this;
    var f     = $( t + " input[type='text']");               
    for(i=0; i < f.length; i++ ){   
      if( $(f[i]).attr('required') ){                        
        if( f[i].value.length == 0 ){ 
          window.fields.push(f[i]);
        }
      }   
    }      
  }

   this.radioValidator = function(){
    var t     = window.thetab;
     var that = this;
      var f    = $( t + " input[type='radio']");               
      var r    = [];
      for(i=0; i < f.length; i++ ){ 
        if( r.indexOf(f[i].name) == '-1' ){
          r.push(f[i].name);
        }
      }
      for(i=0; i < r.length; i++ ){         
        var value = $('input[@name="'+r[i]+'"]:checked').val();
        if( typeof(value) == 'undefined' ){
          window.fields.push( $('input[name="'+r[i]+'"]') );
        }            
      } 
  }

  this.selectValidator = function(){
    var t     = window.thetab;
    var that = this;
    var f    = $( t + " select");               
    var s    = [];
    for(i=0; i < f.length; i++ ){       
      if( $(f[i]).val() == 0 ){
        window.fields.push( $(f[i]) );     
      }     
    }
  }

  this.textIsValid = function(t){                
    var that  = this;
    var f     = $( t + " input[type='text']");               
    for(i=0; i < f.length; i++ ){   
        if( $(f[i]).attr('required') ){
        
          $(f[i]).blur(function(e){  
              e.preventDefault();
              that.isValid();
              // if( this.value.length == 0 ){                    
              //   if( typeof(this) != 'undefined'){
              //      window.fields.push( this );
              //      $(this).closest(".control-group").addClass('error');
              //   }      
              // }else{ 
              //   var index = window.fields.indexOf( this );
              //   window.fields.splice(index,1);
              //   $(this).closest(".control-group").removeClass('error').addClass('success');
              // }
          });
         
      }   
    }      
  }

  this.radioIsValid = function(t){                
    var that = this;
    var f    = $( t + " input[type='radio']");               
    var r    = [];
    for(i=0; i < f.length; i++ ){ 
      if( r.indexOf(f[i].name) == '-1' ){
        r.push(f[i].name);
      }
    }

    for(i=0; i < r.length; i++ ){ 
      $('input[name="'+r[i]+'"]').click(function(e){
        //e.preventDefault();
        var index = window.fields.indexOf( $('input[name="'+this.name+'"]') );
        window.fields.splice(index,1);
        $(this).closest(".control-group").removeClass('error').addClass('success');
      });

      var value = $('input[@name="'+r[i]+'"]:checked').val();
      if( typeof(value) == 'undefined' ){
        window.fields.push( $('input[name="'+r[i]+'"]') );
      }            
    } 
  }

  this.selectValid = function(t){

  var that = this;
  var f    = $( t + " select");           
  var s    = [];
  for(i=0; i < f.length; i++ ){ 
    $(f[i]).prepend('<option value="0">Selecciona un opción </option>') ;
    $(f[i]).val(0);
     window.fields.push( $(f[i]) );     
    $(this).closest(".control-group").removeClass('success').addClass('error');      
    $(f[i]).change(function(e){
        e.preventDefault();
         var index = window.fields.indexOf( $(this) );
         window.fields.splice(index,1);
        $(this).closest(".control-group").removeClass('error').addClass('success');
    });
  }


  }
}