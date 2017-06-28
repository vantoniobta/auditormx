App_Inventory = App.extend({  
    
    /* init
    ------------------------------ */
    run : function(){
       var that = this;
       this.setup();
       
        if (typeof(window.supplier) != 'undefined') {
            this.loadPanelSupplier();
            $('.list-supplier').hide();
        }else{
            var maps = new App_Map();
            maps.loadSupplier();
            window.idLocation = null;
            
            $('#artsActions').hide();
            $('#placesList').hide();
            
            $('#list-supplier').on('change', function(){
               var id = $(this).val();
               $('#findLocation').val('');
               that.loadPanel(id); 
            });
            
            $('#artsActions a').click(function(){
                $('#artsActions a').each(function(i,o){
                   var desactive = $(o).attr('href');
                    $(desactive).removeClass('active').hide();
                });
                var active = $(this).attr('href');
                if (active == '#artsHistory') {
                  //code
                  $('#mainFooterAdmin').show();
                    //that.Location.showMap();
                }else{
                  $('#mainFooterAdmin').hide();
                }
                $(active).addClass('active').show();
                return false;
          
            });
            
            this.loadPanel('');
        }
       
    },
    
    
    /*@setup
    -----------------------------*/
    setup : function(){
      this.panels();
    },
    /*@setCalendar
    -----------------------------*/
    setCalendar : function(){
      var today    = new Date(); 
      var dd       = today.getDate(); 
      var mm       = today.getMonth()+1;//January is 0! 
      var yyyy     = today.getFullYear(); 
      if(dd<10){dd = '0'+dd} 
      if(mm<10){mm = '0'+mm}    
      var theDate  = dd + "-" + mm + "-" + yyyy;
      $('.date').attr('data-date', theDate);
      // $('.date').each(function(i,o){
      //     $('#'+o.id +' input').val(theDate);
      // });
      $('.date').datepicker();     
    },
    /*@loadPanel
    -----------------------------*/
    loadPanel : function(id){
      var that = this;
      //console.log('load panel')
      $('#locationsList').panel({
        rows: 10,
        rheight : '100px',
        navigation : '#mainFooter',
        searcher : '#findLocation',
        source : '/v1/location/release',
        params : {supplier : id},
        onCreateRow : function(container){
          var e = this;
          var span = document.createElement('span');
              span.className = 'pic';
              container.append(span);

          var img = document.createElement('img');
            $(img).attr('width','50').attr('src','assets/img/glyphicons_067_cleaning.png');
            $(span).append(img);

          var div = document.createElement('div');          
            container.append(div);

          var h4 = document.createElement('h4');
             $(div).append(h4);

          var title = document.createElement('a');
            title.id = 'inventoryInfo-' + e._id;
            title.innerHTML = e.code;
            $(h4).append(title);

          var desc = document.createElement('div');
            desc.className = 'desc';
            $(div).append(desc);

          var small = document.createElement('small');
            small.innerHTML = '<b>Proveedor:</b> ' + e.supplier.name;
            $(div).append(small);
        },
        onClickRow : function(item){
            var id = item.id.split('_')[1];
            that.loadPanelRight(id);
            that.getForm(id);
            window.idLocation = id;
            //console.log(id);
        }
      });

    },
    loadPanelSupplier : function(id){
      var that = this;
      $('#locationsList').panel({
        source: 'v1/location/release',
        params: {supplier : window.supplier},
        searcher : '#findLocation',
        rows : 10,
        rheight : '100px',
        navigation : '#mainFooter',
        onCreateRow : function(container){
          var e = this;
          var span = document.createElement('span');
              span.className = 'pic';
              container.append(span);

          var img = document.createElement('img');
            $(img).attr('width','50').attr('src','assets/img/glyphicons_067_cleaning.png');
            $(span).append(img);

          var div = document.createElement('div');          
            container.append(div);

          var h4 = document.createElement('h4');
             $(div).append(h4);

          var title = document.createElement('a');
            title.id = 'inventoryInfo-' + e._id;
            title.innerHTML = e.code;
            $(h4).append(title);

          var desc = document.createElement('div');
            desc.className = 'desc';
            $(div).append(desc);

          var small = document.createElement('small');
            small.innerHTML = '<b>Proveedor:</b> ' + e.supplier.name;
            $(div).append(small);
        },
        onClickRow : function(item){
            var id = item.id.split('_')[1];
            that.loadPanelRight(id);
        }
      });
    },
  
    loadObject : function(id){

        var that = this;
         $('#artsActions').show();
        //$('#suppliersList li').removeClass('active');
        //$(obj).addClass('active');
  
        $.ajax({
          type: "POST",
          url: "/v1/inventory/all",
          data : {location : id},
          success: function( response ){            
            //$('#theTitle').html( 'Agregar a Sitios Activos' ).show();
            $('#newLocationContainer').html(response);
            //that.setCalendar(); 
          }
        });
        
        that.getForm(id);

    },
    
    loadPanelRight : function (id){
        var that = this;
        //console.log(id);
        $('.artsHistory').html('');
        $('.artsHistory').panel({
        rows: 10,            
        rheight : '100px',
        classPagination : 'pagination-mini',
        navigation : '#mainFooterAdmin',
        params : {location : id},
        source : '/v1/inventory/location',
        onCompleteRequest : function(container){
            if (this.response.data.length > 0) {
                $('#theTitle').html('<b>Código: </b>'+ this.response.data[0].location.code);
            }else{
                $('#theTitle').html('Sitio');
            }
        },
        onCreateRow : function(container){    
          var row = this;
          var span = document.createElement('span');
               span.className   = 'leftDesc';
           container.append(span);
           if (row.images.length > 0) {
             for (x in row.images) {
                var imageRow = row.images[x];
                var lightview = document.createElement('a');
                lightview.id           = 'lv_'+row._id;
                lightview.href         = row.images.length > 0 ? '/uploads/'+row.images[x].file : '/assets/img/placeholder.jpg';
                lightview.className    = 'lightview';
                lightview.setAttribute("data-lightview-group",'gallery');
                lightview.setAttribute("data-lightview-options", "skin: 'mac'");
                $(span).append(lightview);
             }
           }else{
           var lightview = document.createElement('a');
               lightview.id           = 'lv_'+row._id;
               lightview.href         = row.images.length > 0 ? '/uploads/'+row.images[0].file : '/assets/img/placeholder.jpg';
               lightview.className    = 'lightview';
               lightview.setAttribute("data-lightview-options", "skin: 'mac'");
           $(span).append(lightview);
           }
           var image = document.createElement('img');
               image.id         = 'locimage_'+row._id;
               //console.log(row.images.length > 0 ? row.images[0].file : ' no');
               image.src        = row.images.length > 0 ? '/uploads/'+row.images[0].file : '/assets/img/placeholder.jpg';
               image.width      = '110';
               image.height     = '90';
               image.className  = 'img-polaroid';
           $(lightview).append(image);
           var labelStatus;
           var textLabel;
           switch (row.status) {
            case 0 :
                labelStatus = 'label ';
                textLabel = 'pendiente';
                break;
            case 1 :
                labelStatus = 'label label-success';
                textLabel = 'completado';
                break;
           }
           var inspan = document.createElement('span');
           
               inspan.className = labelStatus;
               inspan.innerHTML = textLabel;
           $(span).append(inspan);

           ///////////////////////////////////////////////////
            
           var span2 = document.createElement('span');
               span2.className = 'desc';
           container.append(span2);      
           var h6    = document.createElement('h6');
           $(span2).append(h6);                          
           var a      = document.createElement('a');
               a.href = 'javascript:void(0)';
               a.role = 'button';
               a.id   = 'loc_'+row._id;
               a.dataToggle = 'modal';
               a.innerHTML  = "<b>Tema:</b> " + row.art.name;
               a.onclick = function(){

                 return false;                 
               }
            
            var aDelete      = document.createElement('a');
               aDelete.href = 'javascript:void(0)';
               aDelete.className = 'deleteArt';
               aDelete.id   = 'loc_'+row._id;
               aDelete.innerHTML  = '<i class="icon-remove-circle"></i>';
               aDelete.onclick = function(){
                    var id = $(this).attr('id');
                        id = id.split('_')[1];
                    that.deleteInventory(id);  
                    return false;                 
               }
            $(span2).prepend(aDelete);

           $(h6).append(a);
           
            var inspan2 = document.createElement('span');
                inspan2.className = 'size'; 
                inspan2.innerHTML = '<b>Versión:</b> '+ row.content;
            $(span2).append(inspan2);
            
           
            var tdate = new Date(row.from);
                month = new String( tdate.getMonth( ) +1 );            
                month = month.length == 1 ? '0'+ month : month;
            inspan2 = document.createElement('span');
                inspan2.className = 'size'; 
                inspan2.innerHTML = '<b>Desde:</b> '+ tdate.getDate() + '/' + month + '/' + tdate.getFullYear() ;
            $(span2).append(inspan2);
                
            
            tdate = new Date(row.to);
                month = new String( tdate.getMonth( ) +1 );            
                month = month.length == 1 ? '0'+ month : month;
            inspan2 = document.createElement('span');
                inspan2.className = 'size'; 
                inspan2.innerHTML = '<b>Hasta:</b>' + tdate.getDate() + '/' + month + '/' + tdate.getFullYear() ;
            $(span2).append(inspan2);
     

            var inspan2_2 = document.createElement('span');
                inspan2_2.className = 'detail';
                inspan2_2.innerHTML = '<b>Proveedor: </b>' + row.supplier.name;
            $(span2).append(inspan2_2);
            
             /*------------------------------------------ */
            var fix    = document.createElement('div');
               fix.className = 'fix';
              container.append(fix);
            
            var jump = document.createElement('br');
            container.append(jump);
        }
      });
        
    },
    
    getForm : function(id){

      var that = this;
        $.ajax({
          type: "POST",
          url: "/v1/inventory/form",
          success: function( response ){            
            //$('#theTitle').html( 'Agregar a sitios activos' ).show();
            $('#artform').html(response).show();
            $('#artsActions').show();
            $('#placesList').hide();
            //that.setCalendar();
            var inputId = document.createElement('input');
            inputId.name = "location";
            inputId.id = "location";
            inputId.type = "hidden";
            inputId.value = id;
  
            $("#addArt").prepend(inputId);
            that.setForm();
          }
          
      });

    },
      /* @addArt
    ------------------------------ */
    setForm : function(){
  
        var that = this;
        console.log('hola form');
        //var inputId = document.createElement('input');
        //inputId.name = "location";
        //inputId.id = "location";
        //inputId.type = "hidden";
        //inputId.value = id;
        //
        //$("#addArt").prepend(inputId);
        //      //that.setForm();
            
        
        var artVersions = new App_Art();
        $.ajax({
           url : '/v1/art/all',
           type : 'POST',
           dataType : 'JSON',
           data: {select:''},
           success : function(data){
             artVersions.loadSelect('#content_0',data);
             $('.version_text').val(data.data[0].versions[0]);
             that.insertTextVersion();
           }
        });
        
        $('#addArt').submit(function(){

            $.ajax({
                type: "POST",
                url: "/v1/inventory/save",
                data:$('#addArt').serialize(),
                success: function( response ){            
                    if(response.code == 0){
                        if (typeof(response.data) != 'undefined') {
                          bootbox.alert('<div class="alert alert-success">'+response.msg+'<br>De los '+response.data.total+' sitios '+response.data.error+' no pudieron ser agregados </div>');
                        }else{
                          bootbox.alert('<div class="alert alert-success">'+response.msg+'</div>');
                        }
                        that.loadPanelRight(window.idLocation);
                 
                    }else{
                      bootbox.alert('<div class="alert alert-error">'+response.msg+'</div>');
                    }
                }
            });
            return false;
      });
  
    },
    
    insertTextVersion : function(){
        $('.content_version').change(function(){
            var select = $(this);
             $('#'+select.attr('id') + ' option:selected').each(function(){
             select.siblings('input').val($(this).text());
            });
         });
    },
    
    deleteInventory : function(id){
        var that = this;
        bootbox.confirm('¿Seguro que quieres eliminar esta arte de este sitio?','Cancelar','Si', function(result){
           if(result){
            $.ajax({
               url : '/v1/inventory/delete',
               data : {id : id},
               type : 'POST',
               dataType : 'JSON',
               success : function(response){
                if (response.code === 0) {
                    that.loadPanelRight(window.idLocation);
                    bootbox.alert(response.msg);
                }else{
                    bootbox.alert(response.msg);
                }
               }
            });
           }else{
            console.log('no');
           }
        });
    }
   
});