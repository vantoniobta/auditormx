function goLocations(id){

  window.location.href = '/locations/#!/?provider='+id;
}


Core_Settings = Core.extend({  
  page:1,
  maxRowPage : 0, 
  init : function(opts){    
      this.opts = opts;  
      this.id = this.opts.id; 
      this.disable_edit = false;   
  },
   
  /*@run
  ---------------------------------*/
  settings : function(){
    
    //refer to this object
    var that = this;   
    
    //reset to start view
    this.reset();

    //start actions
    this.setup();   
    
    //tabla no editable      
    this.noedit();  

  }, 

  /*@reset
  ---------------------------------*/
  reset : function(){    
    $('#modeForm').val('add');
    $('#userid').val(0);
    $('#btDeleteProvider').hide();    
    $('#btNewProvider').hide();
    $('#formUploadContainer').hide(); 
    $('#progressNumber').hide();
    $('#progressbar').hide();
    
    $('#formUser #suppliersGroup').hide();
    $('#formUser #btDeleteUser').hide();
    $('#formUser #btNewUser').hide();

    document.getElementById('formProvider').reset();


  },
  setup : function(){
    /*--- refer to this object -- */
    var that = this;

    /*--- hide loader image -- */
    $('.process_loader, .alert').hide();

    /*--- Provider New Action -- */
    $('#btNewProvider').click(function(){
      // if(confirm('Realmente deseas salir de este formulario sin guardar?')){
        that.reset();
      // }
    });    

    /*--- Provider Delete Action -- */
    $('#btDeleteProvider').click(function(){
      if(confirm('Realmente deseas eliminar este Proveedor?')){
         that.deleteProvider();
      }
    });    

    /*--- Provider Form Action -- */
    $('#formProvider').submit(function(){
        that.sendForm();
        return false;
    });

    /*--- User Form Action -- */
    $('#formUser').submit(function(){
        that.sendFormUser();
        return false;
    });

     /*--- Provider Form Action -- */
    $('#uploadLocation').submit(function(){
        that.uploadFile();

        return false;
    });

    /*--- Provider Form Action -- */
    $('#role').change(function(){
        if( this.value == 'supplier'){
            $('#suppliersGroup').show();
            $('#supplier_id').attr('disabled',false).attr('required',false);   
            $('#updatePass').attr('checked', false);            
        }
    });   

     /*--- User New Action -- */
    $('#formUser #btNewUser').click(function(){
      // if(confirm('Realmente deseas salir de este formulario sin guardar?')){
        that.resetUser();
      // }
    });    
    
    /*--- User Delete Action -- */
    $('#formUser #btDeleteUser').click(function(){
      if(confirm('Realmente deseas eliminar este usuario?')){
         that.deleteUser();
      }
    }); 
  },
  load : function(){

    var that = this;
    $.get('/providers/get/',{id:this.id},function(r){                                                      
          if(r.error){
            alert(r.msg);
          }else{          
            //reset first     
            that.reset();

            //data from db             
            for(x in r){
              $('#'+x).val(r[x]);
            }


            $('#supplier_id').val(r.id)

            window.usersTableByProvider = $('#usersTableByProvider').Table({         
               id : 'users',
               width : '100%',         
               source:'/providers/users',
               params: { provider_id: r.id },
               rows:20,         
               //searcher:true,         
               primary:'_id',
               headers : [ 
                {   db:'full_name',  name:'Nombre',  classname:'left',  width:'25%'
                  , linkin:function(doc){
                      $.get('/users/get/',{ id: doc.id},function(r){                                                      
                          if(r.error){
                            alert(r.message);
                          }else{          
                            //data from db             
                            for(x in r){
                              $('#formUser #'+x).val(r[x]);
                            }
                            if( r.role != '1'){     

                              $('#formUser #suppliersGroup').show();
                              $('#formUser #supplier_id').attr('disabled',false).attr('required',false);   
                              $('#formUser #updatePass').attr('checked', false);
                              $('#formUser #supplier_id').val(r.supplier_id);
                            }

                            $('#formUser').append( $('<input type="hidden" id="userid" name="user[id]" value="0">') )

                            $('#formUser #password').attr('disabled',true);
                            $('#formUser #btDeleteUser').show();
                            $('#formUser #btNewUser').show();
                            $('#formUser #modeForm').val('update');

                            $('#formUser #userid').val(r.id)                              
                            // window.scrollTo(0,0);

                            $('#formUser #password').attr('disabled',true);

                            //change panel;
                            $('#mainpane-tab a:last').tab('show');

                          }
                       });
  
                      return document.location.href = 'javascript:void(null)';               
                    }
                },

                {db:'email',name:'Correo',classname:'left', width:'10%'}, 

                {db:'role_name',name:'Rol',classname:'center', width:'10%',valueFunction : function(i,o){
                    switch( o.role_name ){
                      case 'auditor':
                        var str = '<span class="label label-warning">Proveedor Auditor</span>';
                      break
                      default:
                        var str = '<span class="label label-primary">Proveedor Publicitario</span>';
                      break
                    }
                    return str; 
                }}, 

                {db:'status',name:'Estatus',classname:'center',width:'10%',valueFunction:function(i,o){                          
                      switch( o.status ){
                        case 0:
                          var str = '<span class="label">Sin Activar</span>';
                        break
                        case 1:
                          var str = '<span class="label label-success">Activo</span>';;
                        break
                        case 2:
                          var str = '<span class="label label-danger">Suspendido</span>';
                        break
                      }

                    return str; 
                }}  
               ],
                onCompleteRequest : function(){
                  $('.label-tooltip').tooltip();
                }
          });
            

            $('#formUploadContainer').show();
            $('#password').attr('disabled',true);
            $('#btDeleteProvider').show();
            $('#btNewProvider').show();
            $('#modeForm').val('update');
            $('#userid').val(r.id)
           
          }

     });

  },

  deleteProvider : function(){      
    var that = this;    
    $.post('/providers/delete',{id:$('#userid').val()},function(r){
      //that.reset();
      window.location.href = '/providers';
    });
  },

  loadRoles : function(){

      var that = this;
      $.get('/users/roles_for_provider/',function(roles){
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

  sendForm : function(){   
    var that = this;    
    $('.process_loader').show();
    var data = $('#formProvider').serialize();
    $.post('/settings/save',data,function(resp){        
        $('.process_loader').hide();
        $('.alert').addClass('alert-success').html('La información fue guardada correctamente.').showAlert();        
        if( $('#modeForm').val() == 'add' ){                  
           that.id = resp.data.id; 
           //console.log(resp)
           that.load();
        }
    });

  },

  sendFormUser : function(){   
    var that = this; 
    var data = $('#formUser').serialize();
    $.post('/users/save',data,function(resp){   

        if( resp.code == 101){
            alert(resp.msg);
        }else{     
          
          window.usersTableByProvider.theLoad();
          if( $('#formUser #modeForm').val() == 'add' ){
            alert('El usuario ha sido creado!');
          }else{          
            alert('El usuario ha sido actualizado!');
          }
            that.resetUser();
            $('#mainpane-tab a:first').tab('show');

        }
    });

  },
  resetUser : function(){    
    $('#formUser #modeForm').val('add');
    $('#formUser #userid').remove();
    $('#formUser #btDeleteUser').hide();
    $('#formUser #password').attr('disabled',true);
    $('#formUser #updatePass').attr('checked', false);
    $('#formUser #btNewUser').hide();
    $('#formUser #suppliersGroup').hide();
    $('#formUser #supplier_id').attr('disabled',true);
    document.getElementById('formUser').reset();    
  },

  deleteUser : function(){      
    var that = this;    
    $.post('/users/delete',{ id: $('#formUser #userid').val() },function(r){
      that.resetUser();
      $('#mainpane-tab a:first').tab('show');
      window.usersTableByProvider.theLoad();
    });
  },


  uploadFile:function() {

    $('#progressNumber').html('').fadeIn();
    $('#progressbar').css('width','0px').fadeIn();

    
    var xhr = new XMLHttpRequest();
    var fd = new FormData(document.getElementById('uploadLocation'));     
   
    /* event listners */
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    
    /* Be sure to change the url below to the url of your upload server side script */
    xhr.open("POST", "/locations/upload");
    xhr.send(fd);

  },


 noedit : function(){

    var that = this;
    $.get('/settings/get/',{id:this.id},function(r){                                                      
          if(r.error){
            alert(r.msg);
          }else{          
            //reset first     
            that.reset();

            //data from db             
            for(x in r){
              $('#'+x).val(r[x]);
            }


            $('#supplier_id').val(r.id)

            window.usersTableByProvider = $('#usersTableByProvider').Table({         
               id : 'users',
               width : '100%',         
               source:'/settings/users',
               params: { provider_id: r.id },
               rows:20,         
               //searcher:true,         
               primary:'_id',
               headers : [ 
                {   db:'full_name',  name:'Nombre',  classname:'left',  width:'45%'},

                {db:'email',name:'Correo',classname:'left', width:'30%'},
                {db:'status',name:'Estatus',classname:'center',width:'15%',valueFunction:function(i,o){                          
                      switch( o.status ){
                        case 0:
                          var str = '<span class="label">Sin Activar</span>';
                        break
                        case 1:
                          var str = '<span class="label label-success">Activo</span>';;
                        break
                        case 2:
                          var str = '<span class="label label-danger">Suspendido</span>';
                        break
                      }

                    return str; 
                }}  
               ],
                onCompleteRequest : function(){
                  $('.label-tooltip').tooltip();
                }
          });
            

            $('#formUploadContainer').show();
            $('#password').attr('disabled',true);
            $('#btDeleteProvider').show();
            $('#btNewProvider').show();
            $('#modeForm').val('update');
            $('#userid').val(r.id)
           
          }

     });

  },


});