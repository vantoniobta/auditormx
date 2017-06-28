App_Supplier = App.extend({  
  pageP:1,
  search : 'name',
  maxRowPage : 0,
  Location : '',
  showMap: false,
  init : function(){  
    
    this.panels();
  },
  /*@run
  ---------------------------------*/
  run : function(){
    
    //refer to this object
    var that = this;   
    
    //reset to start view
    this.reset();

    //start actions
    this.setup();   
    
    //load panel
    this.loadPanel();
    
    $('#search').on('change', function(){
      that.search = $(this).val();
      console.log(that.search);
    });
  },  
  /*@reset
  ---------------------------------*/
  reset : function(){

     $('#theTitle').html( 'Nuevo Proveedor' ); 
      window.theForm = {
        status: 'create',
        _id:null
      }
      window.supplier = null;
      $('#placesList').hide();    
  },
  setup : function(){
    //refer to this object
    var that = this;

    //add new supplier
    $('#addNew').click(function(){
        that.getForm(function(){
         that.reset();
         that.setForm();
          //View all actions
          $('#supplierActions').hide();
          $('#placesList').hide();


        });
    }); 

    $('#supplierActions a').click(function(){
      $('#supplierActions a').each(function(i,o){
         var desactive = $(o).attr('href');
          $(desactive).removeClass('active').hide();
      });
      var active = $(this).attr('href');
      if (active == '#placesList') {
        //code
        $('#mainFooterAdmin').show();
          //that.Location.showMap();
      }else{
        $('#mainFooterAdmin').hide();
      }
      $(active).addClass('active').show();
      return false;

    });

    this.getForm(function(){         
      that.setForm();

    });  

  },

  /*@loadSupplierForm
  ---------------------------------*/
  getForm : function(callback){        
      var that = this;
      $.ajax({
        type: "GET",
        url: "/suppliers/form",
        success:function(response){
            $('#supplierform').html(response).show();           
            callback.call();  
        }

      });
  },
  /*@setForm
  ---------------------------------*/
  setForm : function(){
      var that = this;
      $('#newSupplier').submit(function(){                
        that.insertData();
        $.ajax({
          type: "POST",
          url: "/v1/suppliers/save",
          data: $(this).serialize(),
          success:function(response){
             that.isLogged(response,function(){
              if( response.code == '0' ){
                that.getForm(function(){    
                  bootbox.alert('Proveedor ha sido guardado');
                  that.setForm();
                  that.loadPanel();
                });  
                
              }              
              if( response.code === 100 ){
                console.error(response.msg);
                bootbox.alert(response.msg);
              }
             });
            }            
          });
        return false;
      })     
  },
 
    
    /*@loadPanel
    -----------------------------*/
    loadPanel : function(){
        var that = this;
        $('#mainFooterAdmin').hide();
        $('#supplierListContainer').panel({
            rows: window.rowsmax,            
            rheight : '100px',
            navigation : '#mainFooter',
            searcher:'#findSuppliers',
            condition : '#search',
            source : '/v1/suppliers/all',
            onCreateRow : function(container){    
              var e = this;
              var span = document.createElement('span');
                  span.className = 'pic';
                  container.append(span);

              var img = document.createElement('img');
                $(img).attr('width','50').attr('src','assets/img/glyphicons_067_cleaning.png');
                $(span).append(img);
                jQuery.ajax({
                  url: '/v1/supplier/load/logo',
                  type: 'POST',
                  dataType: 'json',
                  data : {idSupplier : e._id},
                  success: function(data) {
                    if(data.code == 0){
                      img.src = data.url;
                    }
                  } 
                });

              var div = document.createElement('div');          
                container.append(div);

              var h4 = document.createElement('h4');
                 $(div).append(h4);

              var title = document.createElement('a');
                title.id = 'suppInfo-' + e._id;
                title.innerHTML = e.name;
                $(h4).append(title);

              var desc = document.createElement('div');
                desc.className = 'desc';
                $(div).append(desc);

              var rfc = document.createElement('span');
                rfc.innerHTML = '<b>RFC:</b> '+ e.rfc;
                $(desc).append(rfc);

              var email = document.createElement('span');
                email.innerHTML = '<b>Email de Contacto:</b> <a href="mailto:'+e.email+'">'+ e.email +'</a>';
                $(desc).append(email);

              var small = document.createElement('small');
                small.innerHTML = '';
                $(div).append(small);

              var spanDate = document.createElement('span');

              var tdate = new Date(e.created);
                  month = new String( tdate.getMonth( ) +1 );            
                  month = month.length == 1 ? '0'+ month : month;

                spanDate.className = 'date';
                spanDate.innerHTML = tdate.getDate() +'-'+month+'-'+tdate.getFullYear() ;
                $(small).append(spanDate);

              var spanLabels = document.createElement('span');
                spanLabels.className = 'labels';
                $(small).append(spanLabels);

              var status = document.createElement('span');  
                status.className = 'label label-success';
                status.innerHTML = 'activo';
                $(spanLabels).append(status);             
            },
            onClickRow : function(item){
                //this id
                var id = item.id.split('_')[1];
                  //this get form
                  that.getForm(function(){
                  that.setForm();
                  that.loadObject(id,function(){
                      //set delete supplier function
                      $('#delete_supplier').show();
                      $('#delete_supplier').click(function(){
                          that.delete();          
                      });  
                  });
                });
            }
          });
    },

    /*@loadObject    
    ---------------------------------- */
    loadObject : function(id,callback){  

      //local object     
      var that = this;   

      $.ajax({
        type: "POST",
        url: "/v1/supplier/load",
        data:{_id:id},
        success:function(response){
          that.isLogged(response,function(){
              //------------------------------------
                window.supplier       = id;
                window.theForm._id    = id;
                window.theForm.status = 'update';
                
                $('#assessor_name').val(response.user.name);
                $('#assessor_email').val(response.user.email);
                $('#assessor_phone').val(response.user.phone);
                if( typeof(response.user._id) != 'undefined' ){                          
                    var iduser = document.createElement('input');
                        iduser.type  = 'hidden';
                        iduser.name  = 'supplier[assessor_id]';
                        iduser.id    = 'assessor_id';
                        iduser.value = response.user._id
                        $('#newSupplier').append(iduser);
                }          
                for( x in response.data ){           
                  $('#'+x ).val( response.data[x]);             
                  $('#theTitle').html( response.data.name );
                }

                // //Applocation
                that.Location = new App_Supplier_Location();
                that.Location.loadPanelInTab();
                    //that.showMap();

                //View all actions
                $('#supplierActions').show();

                //callback response 
                callback.call(response);
                
          });
        }
    }); 
  },
  /*@delete
  ---------------------------------------*/
  delete : function(id, email){
    var that = this;
      bootbox.confirm('Se eliminaran todos los sitios y usuarios relacionados a este objeto., estas seguro de eliminar este proveedor? ' , function(result) {
      $.post('/v1/supplier/delete',{id:window.supplier},function(r){
            that.isLogged(r,function(e){
              if (r.code == 0) {
                that.loadPanel();
                that.reset();
                that.getForm(function(){
                  that.reset();
                  that.setForm();
                   //View all actions
                   $('#supplierActions').hide();
                   $('#placesList').hide();
                });
              }else{
                bootbox.alert('<div class="alert">'+r.msg+'</div>');
              }
            });
          });
      });  
  },
  /*@insertData
  ---------------------------------------*/
  insertData : function(){
      $('input[name="_id"]').remove();
      var id = document.createElement('input');
        id.name  = '_id';
        id.type  = 'hidden';
        id.value = window.theForm._id
        $('#newSupplier').append(id);
        $('input[name="status"]').remove();
        var status   = document.createElement('input');
        status.name  = 'status';
        status.type  = 'hidden';
        status.value = window.theForm.status
        $('#newSupplier').append(status);
        // $('#formTitle').html( response.data.name );
  }

});