String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,"");
}

App_Supplier_Location = App.extend({  
    pageSP:1,
    maxRowPage:0,
    init : function(){
      this.panels();
      //if( window.supplier ){
      //   this.runAsAuxiliar();
      //  //return true;
      //}else{
      //  this.run();
      //}
    },
    /* init
    ------------------------------ */
    run : function(){
   //console.log('hola');
      //setup to supplier if this exist
      //window.supplier = typeof(id) != 'undefined' ? id : null;

      //normal mode from supplier view
      //console.log('hola run');
      var that = this;
      delete window.location_id;
      delete window.location_status;
      //set name to panel view
      $('#theTitle').html('Agregar nuevo sitio');
      $('#formTitle').show();
      //call to form view
      that.getForm(function(){
        that.setForm();  
        that.setMask();
        Validation.tab('#tab1');         
      });
      
      that.loadPanel();
      that.setup();
     
    },  

     /* code location
    ------------------------------ */
    setMask : function(){
      $('#code').alfanumeric('-');
      $('#zip,#delivery_zip').digits(); 
      $('#measures_base,#measures_height').digits('.');
      $('#phone,#delivery_phone').digits('()-');      
      $('#price').currency(2, '.', ','); 
    },
    /*@setup :  all actions on init
    ----------------------------*/
    setup : function(){
      //refer to this object
      var that = this;
      //call event      
      $('#newPlace').click(function(e){                
        //status
        delete window.location_id;
        delete window.location_status;
        //set name to panel view
        $('#theTitle').html('Agregar nuevo sitio');
        $('#formTitle').show();
        //call to form view
        that.getForm(function(){
          that.setForm();  
          that.setMask();
          Validation.tab('#tab1');         
        });       
      });
      
      $('#newPlaces').click(function(){
         $('#myModal').modal('toggle');
         $('#uploadFile').submit(function(){
            //document.getElementById('uploadFile').reset();
            $('#myModal').modal('hide');
         });
         
         $('#myModal').on('hidden', function(){
            document.getElementById('uploadFile').reset();
            $('#myModal span').remove();
         });
         
         window.finishform = function(str){
            if(str.code === 0){           
               bootbox.alert("<div class='alert alert-success'>"+str.msg+"</div>");
            }
            else{
              bootbox.alert("<div class='alert alert-error'>"+str.msg+"</div>");
            }
         } 
      });
      
    },

    /* getForm
    ------------------------------ */
    getForm : function(callback){
      //console.log('hola get Form');
      $.get('/locations/form',function(r){
            $('#newLocationContainer').html(r);
            callback.call();
      });
    },     

    /* setForm
    ------------------------------ */
    setForm : function (){
        //refer to this object
        //console.log('hola save Form');
        var that = this;
        $('#locationForm').submit(function(){
            if( Validation.isValid() ){        
              that.insertData();
              //console.log(window.location_id);
              //console.log($('#locationForm').serialize())
              $.ajax({
                type: "POST",
                url: "/v1/location/save",
                data: $('#locationForm').serialize(),
                success: function(r){
                  that.response(r);                  
                }
              });               
            }
            return false;
        });

      $('#delete-supplier').click(function(){
        $.ajax({
          url : '/v1/location/delete',
          type : 'POST',
          data : {idLocation : window.location_id},
          dataType : 'JSON',
          success : function(data){
            if(data.code === 0){
              bootbox.alert(data.msg);
            }else{
              bootbox.alert('<div class="alert alert-error">'+ data.msg + '</div>');
            }
          }
        });
      });
    },
    /*@insertData
    ---------------------------------------*/
    insertData : function(){
      $('#supplier').val( window.supplier);
      if( typeof(window.location_id) != 'undefined'){
        $('#locationForm input[name="_id"]').remove();
        var id = document.createElement('input');
          id.name  = '_id';
          id.type  = 'hidden';
          id.value =  window.location_id;
          $('#locationForm').append(id);

          $('#locationForm input[name="status"]').remove();
          var status   = document.createElement('input');
          status.name  = 'status';
          status.type  = 'hidden';
          status.value = window.location_status
          $('#locationForm').append(status);
        }        
    },
    /* response
    ------------------------------ */
    response : function(response){
      //refer to this object
      var that = this;
      switch(response.code){
        case 0:
          var total   = $('.breadcrumb').find('li').length;
          var current = 3;
          var percent = (current/total) * 100;
          $('#newLocation').find('.bar').css({width:percent+'%'});                    
          setTimeout(function(){            
            bootbox.alert('Información para este Sitio ha sido guardada');                  
             that.loadPanel();
             $('#newPlace').click();
          },300);

        break;
        case 100:
          bootbox.alert(response.msg);
        break;
      }
    },    
    /* @loadObject
    ----------------------------*/
    loadObject : function(id,callback){

      var that = this;
      window.location_id = id;
      window.location_status = 'update';
      $.post('/v1/location/load', {id:id},function(r){     

        for( x in r.data ){
          //console.log( typeof(r.data[x]) );
          //console.log( r.data[x] );
          //console.log('------------------------');
          switch( typeof r.data[x] ){
            case 'string':
              $('#'+x).val(r.data[x]);
            break;
            case 'object':
              for ( i in r.data[x] ){
                $('#'+x+'_'+i).val(r.data[x][i]);
              }
            break;
            case 'array':
            
            break;
          }

        }
        //   if( != 'string'){ 
           
        //     $('#d_'+x).html(r.data[x]);            
        //   }else{            
              
        //   }
        var light = r.data.light.replace(' ','-');
        $("input[name=view_type][value=" + r.data.view_type + "]").prop('checked', true);
        $("input[name=type][value=" + r.data.type + "]").prop('checked', true);
        $("input[name=light][value=" + light + "]").prop('checked', true);

        if(r.data.images.length > 0){
          for( var x = 0; x < r.data.images.length; x++){
            if(x < 3){
              $('#locationImages li:eq('+x+') a').attr('href','/uploads/'+r.data.images[x].file);
              $('#locationImages li:eq('+x+') a img').attr('src','/uploads/'+r.data.images[x].file);
            }
          }
        }
        
        callback.call();
      });

    },

  /*@loadPanelInTab
  -----------------------------*/
  loadPanelInTab: function(){
   var that = this;
   $('#placesList').hide();
   console.log('hola panel intab');
   $('#placesList').panel({
        rows: 10,            
        rheight : '100px',
        classPagination : 'pagination-mini',
        navigation : '#mainFooterAdmin',
        params : {idSupplier : window.supplier},
        source : '/v1/location/all',
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
           var inspan = document.createElement('span');
               inspan.className = 'label ' + ( row.active == 1 ? 'label-success' : ( row.status == 1 ? 'label-warning' : 'label-important'));
               inspan.innerHTML = row.active == 1 ? 'activo' : (row.status == 1 ? 'pendiente' : 'incompleto');
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
               a.innerHTML  = row.street +' Col. '+ row.neighbor +', '+ row.city
               a.onclick = function(){

                 return false;                 
               }

           $(h6).append(a);
            var inspan2 = document.createElement('span');
                inspan2.className = 'size'; 
                inspan2.innerHTML = '<b>Medidas: </b>' + row.measures.base +'x' +row.measures.height;
           $(span2).append(inspan2);
           var inspan2 = document.createElement('span');
                inspan2.className = 'size'; 
                inspan2.innerHTML = '<b>Material: </b>' + row.measures.material;
           $(span2).append(inspan2);
     

           var inspan2_2 = document.createElement('span');
                inspan2_2.className = 'detail';
                inspan2_2.innerHTML = '<b>Código: </b>' + row.code;
           $(span2).append(inspan2_2);
           var coords;
           var link = document.createElement('a');
               link.setAttribute('href','#');
               link.innerHTML = 'Ver Mapa' ;
          if (row.coords != undefined) {
             coords = "coord"+row.code+","+row.coords.lat+","+row.coords.lng;
             link.className = 'badge badge-success';
             link.id = coords;
             link.onclick = function(){
               var mapCoords = this.id.split(',');
               that.showMap(mapCoords);
             }
          }else{
             link.className = 'badge';
          }
          //console.log(row._id+typeof(coords)+'--'+coords);
           var inspan2 = document.createElement('span');
            inspan2.className = 'size'; 
            $(inspan2).append(link);
           $(span2).append(inspan2);
             /*------------------------------------------ */
            var fix    = document.createElement('div');
               fix.className = 'fix';
              container.append(fix);
            
            var jump = document.createElement('br');
            container.append(jump);
        }
      });

  },
   /*@setStatus
    ------------------------------------------*/  
    setStatus : function(id,span3){
       $.post('/v1/location/status',{_id:id},function(r){ 

          var status = typeof(r.status[0]) != 'undefined' ? r.status[0].status : '';
          var path   = typeof(r.status[0]) != 'undefined' ? r.status[0].images : '';
              path   = typeof(path[0]) != 'undefined'? path[0].file : '';


          var inspan3_1 = document.createElement('span'); 
              inspan3_1.className = 'badge ' + ( status == 'Bien' ? 'badge-success':'');
              inspan3_1.innerHTML = '-';
          $(span3).append(inspan3_1);                       
          var inspan3_2 = document.createElement('span');
              inspan3_2.className = 'badge ' + ( status == 'Medio' ? 'badge-warning':'') ;
              inspan3_2.innerHTML = '-';
          $(span3).append(inspan3_2);                      
          var inspan3_3 = document.createElement('span');
              inspan3_3.className = 'badge ' + ( status == 'Mal' ? 'badge-important' :'');
              inspan3_3.innerHTML = '-';
          $(span3).append(inspan3_3);

           if( path != '' ){
            $('#locimage_'+id).attr('src','/uploads/2013/'+path);
            $('#lv_'+id).attr('href','/uploads/2013/'+path);
            //$('#loc_'+id).attr('href','/uploads/2013/'+path);
            
          }

       });

    },

      /*@loadPanel
    -----------------------------*/
    loadPanel : function(){
      //console.log('load panel');
      var that = this;

      $('#suppliersListLocations').panel({
        rows: 10,            
        rheight : '100px',
        navigation : '#mainFooter',
        source : '/v1/location/all',
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
              title.id = 'suppInfo-' + e._id;
              title.innerHTML = e.code;
              $(h4).append(title);

            var desc = document.createElement('div');
              desc.className = 'desc';
              $(div).append(desc);

            var type = document.createElement('span');
              type.innerHTML = '<b>Tipo:</b> '+ e.type;
              $(desc).append(type);

            var price = document.createElement('span');
              price.innerHTML = '<b>Precio:</b> ' + e.price;
              $(desc).append(price);

            var direction = document.createElement('span');
              direction.innerHTML = '<b>Dirección: </b> ' + e.street + ', ' + e.state;
              $(desc).append(direction);

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
            var classLabel = 'label-warning';
            var textLabel = 'incompleto';
            if (e.status == 1) {
               classLabel = '';
               textLabel = 'inactivo';
               if (e.active == 1) {
                  classLabel = 'label-success';
                  textLabel = 'activo';
               }
            }
              status.className = 'label '+classLabel;
              status.innerHTML = textLabel;
              $(spanLabels).append(status);           
        },
        onClickRow : function(item){
         
            var id = item.id.split('_')[1];
            
              that.getForm(function(){
              that.setForm();
              that.loadObject(id,function(){
            
                  $('#delete_supplier').show();
                  $('#delete_supplier').click(function(){
                      that.delete();          
                  });  
              });
            });
        }
      });
    },
    
   showMap : function(mapCoord){

      console.log('hello');
      Lightview.show({
        url: "<div style='width:500px;height:450px;float:left;' class='map'><\/div>",
        type: 'html',
        title: "",
        caption: "",
        options: {
          skin: 'mac',
          afterUpdate: function(content) {
            var map = new google.maps.Map($(content).find('.map')[0], {
              zoom: 17,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              navigationControl: true,
              mapTypeControl: true,
              scaleControl: true,
              streetViewControl: true

            });

            var pos = new google.maps.LatLng(parseFloat(mapCoord[1]),parseFloat(mapCoord[2]));
              map.setCenter(pos);
              var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: pos
              });
          }
        }
      });
    
  },

   
});