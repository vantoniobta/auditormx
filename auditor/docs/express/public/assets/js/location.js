App_Location = App.extend({  
    pageL : 1,
    init : function(){
      
    },
    /* init
    ------------------------------ */
    run : function(id){
      
      //setup to supplier if this exist
      window.supplier = typeof(id) != 'undefined' ? id : null;

      //normal mode from supplier view
      if( window.supplier ){
         this.runAsAuxiliar();
        return true;
      }

      //run if this call comes from the rout /locations
      this.runAsController();
      
    },  

    runAsAuxiliar : function(){
      //refer to this object
      var that = this;

      //start actions
      this.setup();

      //load panel
      this.loadPanel();
    },

    runAsController :function(){

      alert('ok');

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
      $.get('/locations/form',function(r){
            $('#newLocationContainer').html(r);
            callback.call();
      });
    },     

    /* setForm
    ------------------------------ */
    setForm : function (){
        //refer to this object
        console.log('hola');
        var that = this;
        $('#locationForm').submit(function(){
            if( Validation.isValid() ){        
              that.insertData();              
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
        // }
 
        $("input[name=view_type][value=" + r.data.view_type + "]").prop('checked', true);
        $("input[name=type][value=" + r.data.type + "]").prop('checked', true);
        $("input[name=light][value=" + r.data.light + "]").prop('checked', true);
        
        callback.call();
      });

    },
    /* @loadPanel, define wich view panel type it shows
    ------------------------------------------------*/
    // loadPanel : function(){
    //   //refer to this object
    //   var that = this;
    //   if(window.supplier){
    //     this.loadPanelView();
    //   }else{
    //     this.loadPanelSide();
    //   }
    // },
    /* @loadPanelView 
    ----------------------------*/
    loadPanelView : function(){      
      //refer to this object
      var that = this;
      
      $.ajax({
        type: "POST",
        data:{id:window.supplier,page:that.pageL},
        url: "/v1/location/all",
        success : function(response){
          that.pagination(0);
         $('a[rel=tooltip]').tooltip();
         $('#suppliersList').html('');

         $(response.data).each(function(i,e){

            var li = document.createElement('li');
              li.id = 'itemPanel_'+e._id;
            $('#suppliersList').append(li);
            var span = document.createElement('span');
              span.className = 'pic';
              $(li).append(span);
            var img = document.createElement('img');
              $(img).attr('width','50').attr('src','assets/img/glyphicons_067_cleaning.png');
              $(span).append(img);
            var div = document.createElement('div');
              div.className = 'desc';
              $(li).append(div);
            var h4 = document.createElement('h4');
              $(div).append(h4);
            var title = document.createElement('a');
              title.id = 'suppInfo-' + e._id;
              title.innerHTML = e.code +'.'+e.street+' '+e.neighbor+' '+e.city;
              $(h4).append(title);
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
            var status         = document.createElement('span');
              status.className = 'label '+ ( e.active == 1 ? 'label-success' : '' );
              status.innerHTML = e.active == 1 ? 'activo' : 'pendiente';
              $(spanLabels).append(status);

              li.onclick = function(){

                 var id = this.id.split('_')[1];

                  window.location_id     = id; 
                  window.location_status = 'update';

                  $('#theTitle').html('Editar Información del sitio');
                  $('#formTitle').show();

                  that.getForm(function(){
                    that.setForm();
                    that.loadObject(id,function(){                      
                        that.setMask();
                        Validation.tab('#tab1');  
                    });                     
                  });
              }
          })
          
        }
      })

  },
  /*@loadPanelInTab
  -----------------------------*/
  loadPanelInTab: function(page){
      var that = this;
      $.post('/v1/location/all', { id:window.supplier,page:page},function(r){  
        Supplier.pagination(1);
        $('#placesList').hide();            
        if(r.code == 0){
          var ul   = document.createElement('ul');
            $('#placesList').html('');
            $('#placesList').append(ul);   
            $('#placesList').append('<div class="fix"><div id="pagSP"></div></div>');               
            //set data
            for( x in r.data ){
                var row = r.data[x];
               
                var li    = document.createElement('li');
                    li.id = 'locitem_'+row._id
                $(ul).append(li);

                //////////////
                var span = document.createElement('span');
                    span.className   = 'leftDesc';
                $(li).append(span);
                if (row.images.length > 0) {
                  for (x in row.images) {
                     var imageRow = row.images[x];
                     var lightview = document.createElement('a');
                     lightview.id           = 'lv_'+row._id;
                     lightview.href         = row.images.length > 0 ? 'uploads/'+row.images[x].file : '/assets/img/placeholder.jpg';
                     lightview.className    = 'lightview';
                     lightview.rel = 'gallery[myset]';
                     lightview.setAttribute("data-lightview-options", "skin: 'mac'");
                     $(span).append(lightview);
                  }
                }else{
                var lightview = document.createElement('a');
                    lightview.id           = 'lv_'+row._id;
                    lightview.href         = row.images.length > 0 ? 'uploads/'+row.images[0].file : '/assets/img/placeholder.jpg';
                    lightview.className    = 'lightview';
                    lightview.setAttribute("data-lightview-options", "skin: 'mac'");
                $(span).append(lightview);
                }
                var image = document.createElement('img');
                    image.id         = 'locimage_'+row._id;
                    //console.log(row.images.length > 0 ? row.images[0].file : ' no');
                    image.src        = row.images.length > 0 ? 'uploads/'+row.images[0].file : '/assets/img/placeholder.jpg';
                    image.width      = '110';
                    image.height     = '90';
                    image.className  = 'img-polaroid';
                $(lightview).append(image);                  
                var inspan = document.createElement('span');
                    inspan.className = 'label ' + ( row.active == 1 ? 'label-success' : 'label-warning');
                    inspan.innerHTML = row.active == 1 ? 'activo' : 'pendiente';
                $(span).append(inspan);

                ///////////////////////////////////////////////////

                var span2 = document.createElement('span');
                    span2.className = 'desc';
                $(li).append(span2);      
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
                var link;
               if (row.coords != undefined) {
                  coords = "coord"+row.code+","+row.coords.lat+","+row.coords.lng;
                  link = '<a class="badge badge-success showMap" href="#"  id="'+coords+'">Ver Mapa </a>' ;
               }else{
                  link = '<a class="badge" href="#" >Ver Mapa </a>' ;
               }
               //console.log(row._id+typeof(coords)+'--'+coords);
                var inspan2 = document.createElement('span');
                 inspan2.className = 'size'; 
                 inspan2.innerHTML = link;
                $(span2).append(inspan2);

              /*------------------------------------------ */
                 var fix    = document.createElement('div');
                    fix.className = 'fix';
                   $(li).append(fix);
            }
        }else{
          bootbox.alert('No se han logrado cargar las locaciones para este proveedor!');   
        }
    }).done(function(){
      that.showMap();   
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
      var that = this;
      $.ajax({
        type: "POST",
        url: "/v1/location/all",
        data:{page:that.pageL}
        }).done(function( response ) {
          that.pagination(2);
        that.isLogged(response,function(){

         $('a[rel=tooltip]').tooltip();
         $('#suppliersList').html('');
         $(response.data).each(function(i,e){
            var li = document.createElement('li');
              li.id = 'itemPanel_'+e._id;
            $('#suppliersList').append(li);
            var span = document.createElement('span');
              span.className = 'pic';
              $(li).append(span);
            var img = document.createElement('img');
              $(img).attr('width','50').attr('src','assets/img/glyphicons_067_cleaning.png');
              $(span).append(img);
            var div = document.createElement('div');
              // div.className = 'desc';
              $(li).append(div);
            var h4 = document.createElement('h4');
              $(div).append(h4);
            var title = document.createElement('a');
              title.id = 'suppInfo-' + e._id;
              title.innerHTML = e.code;
              $(h4).append(title);
            var desc = document.createElement('div');
              desc.className = 'desc';
              $(div).append(desc);
            var rfc = document.createElement('span');
              rfc.innerHTML = '<b>Tipo:</b> '+ e.type;
              $(desc).append(rfc);
            var email = document.createElement('span');
              email.innerHTML = '<b>Precio:</b>'+ e.price;
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

              li.onclick = function(){
                $('#placesList').hide(); 
                var id = this.id.split('_')[1];
                $('#formTitle').show().html(e.code);
                //carga el objecto location seleccionado
                that.getForm(function(){
                  that.loadObject(id,function(){
                    //set delete supplier function
                    $('#delete_supplier').show();
                    $('#delete_supplier').click(function(){
                        that.delete();            
                  });
                });

              });
              }
            })  
         })
      });
    },
    
   showMap : function(){
    $('.showMap').click(function(e){
       e.preventDefault();
       var coords =$(this).attr('id');
       var mapCoord = coords.split(',');
       //console.log(mapCoord);
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

             //new google.maps.Geocoder().geocode({ address: 'Stanford University, CA' }, function(results, status) {
               //if (status == google.maps.GeocoderStatus.OK) {
               var pos = new google.maps.LatLng(parseFloat(mapCoord[1]),parseFloat(mapCoord[2]));
                 map.setCenter(pos);
                 var marker = new google.maps.Marker({
                   map: map,
                   animation: google.maps.Animation.DROP,
                   position: pos
                 });
               //}
             //});
           }
         }
       });
    });
    
  },

  pagination : function(state){
    var that=this;
      $('#pagL').html('');
      $.ajax({
          type: "GET",
          url: "/v1/location/count",
      }).done(function(response){
        var str='<div class="pagination pagination-centered"><ul>';

        var count=response.count;
        var inic=0,fin=0;
        switch(response.code){
          case 0:
          if(count>10){
            str+='<li id="liLBegin"><a id="pL_B" href="#pagL" value="'+(1)+'"> First </a></li>';
            str+='<li id="liLBack"><a id="pL_Back" href="#pagL"> Prev </a></li>';
            
            if((parseInt(that.pageL)+9)<=count){
              inic=parseInt(that.pageL);
              fin=parseInt(that.pageL)+9;
            } 
            else {
              inic=count-10;
              fin=count;
            }
            for(var i=inic;i<=fin;i++){
              str += '<li id="liL_'+(i)+'"><a id="pL_'+(i)+'" href="#pageL" value="'+(i)+'">'+(i)+'</a></li>';
            }
            
            str+='<li id="liLNext"><a id="pL_Next" href="#pageL"> Next </a></li>';
            str+='<li id="liLEnd"><a id="pL_E" href="#pageL" value="'+(count)+'" name="Ultima pagina"> Last </a></li>';
          }
          else{
            inic=1;
            fin=count;
            str+='<li id="liLBack"><a id="pL_Back" href="#pageL"> Prev </a></li>';
            for(var i=1;i<=count;i++){
              str += '<li id="liL_'+(i)+'"><a id="pL_'+(i)+'" href="#pageL" value="'+(i)+'">'+(i)+'</a></li>';
            }
            str+='<li id="liLNext"><a id="pL_Next" href="#pageL"> Next </a></li>';
          }
          break;
        }
        str += '</ul></div>';
        $('#pagL').append(str);
        $('#liL_'+that.pageL).attr('class','active');
        for(i=inic;i<=fin;i++){
          $('#pL_'+(i)).click(function(){
            that.pageL=parseInt($(this).attr('value'));
            that.loadPage(state);
          });
        }
        $('#liLBack').click(function(){
          if(that.pageL>1){
            that.pageL-=1;
            that.loadPage(state);
          }
        });
        $('#liLNext').click(function(){
          if(that.pageL<count){
            that.pageL+=1;
            that.loadPage(state);
          }
        });
        $('#liLBegin').click(function(){
          that.pageL=1;
          that.loadPage(state);
        });
        $('#liLEnd').click(function(){
          that.pageL=count;
          that.loadPage(state);
        });
      });
  },

  loadPage : function(state)
  {
    var that=this;

    switch(state)
            {
              case 0:
                that.loadPanelView();
                break;
              case 1:
                that.loadPanelInTab();
                break;
              case 2:
                that.loadPanel();
            }
  }
   
});