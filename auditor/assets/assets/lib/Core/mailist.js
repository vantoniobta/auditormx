Core_Mailist = Core.extend({  
  page:1,
  maxRowPage : 0, 
  init : function(){

  },
  /*@run
  ---------------------------------*/
  run : function(id){

    //id
    this.id = id;
    
    //refer to this object
    var that = this;   
    
    //setup 
    this.loadRoles();

    
    //load data
    this.send();

    //load datatable
    //this.setDataTable();

    //set html area
    $('textarea').htmlarea();
  },  
  /*@reset
  ---------------------------------*/
  reset : function(){ 
    document.getElementById('deliveryTable').reset();   
  },

  setup : function(){

   

  },

   loadRoles : function(){

      var that = this;
      $.get('/users/roles/',function(roles){
          var select = document.getElementById('role');
          for( x in roles ){ 
              var doc = roles[x];              
              var opt = document.createElement("option");
               opt.textContent = doc.name;
               opt.value = doc.id;
               select.appendChild(opt);    
          }        
      });
    },

  send : function(){
    $('#send-mails').submit(function(e){
      e.preventDefault();

      var that = this
      var form = $(this);
      var data = {
          role: $('#role').val()
        , subject: $('#subject').val()
        , text: $('#text').val().replace(/\n/gi,'<br/>')
      }
      
      $.post('mailist/send', data, function(data){
          
          if( data.error == 0 ){
            document.getElementById('send-mails').reset();
            alert('Se ha enviado un email correctamente a los Usuarios relacionados al perfil: ' + $('#role option:selected').text() );
          }else{
            alert('Un problema ha ocurrido al intentar enviar el mail list, intenta de nuevo por favor!');
          }
      })
      
    })

  }


});