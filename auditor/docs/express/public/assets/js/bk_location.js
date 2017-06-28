App_Location = App.extend({  

    init : function(){

    },
    /* init
    ------------------------------ */
    run : function(callback){
      var that = this;
      $.get('/suppliers/location/panel',function(doc){

          //clean the panel first 
          $('#locationContainer').html('');
          $('#locationContainer').html(doc);            
         
          that.setActions(); 

          $('#addNewPlace').click( function () {
            //document.getElementById('locationForm').reset();
            //Validation.tab('#tab1');
          })
          callback.call();
      })    
    },
    setActions : function(){

      var that = this;
      $('#placesList').hide();

      $('#showSites').click( function () {
        $('#newLocation, #newSupplier').hide();
        $('#placesList').show();
      });

      $('#showSupplier').click( function () {
        $('#placesList, #newLocation').hide();
        $('#newSupplier').show();
      });

      $('#addNewPlace').click( function () {
        $('#placesList, #newSupplier').hide();
        $('#newLocation').show();
        that.getForm(function(){
          that.setForm();
          that.setWizard();
          that.setMask();
          that.setCalendar();
        });
       
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

    /* setForm
    ------------------------------ */
    setForm : function (callback){
        var that  = this;
        $('#locationForm').submit(function(){
            if( Validation.isValid() ){        
              that.insertData();              
              $.ajax({
                type: "POST",
                url: "/v1/location/save",
                data: $('#locationForm').serialize(),
                success: function(r){
                  that.response(r); 
                  callback.call(r);
                }
              });               
            }
            return false;
        });
    },
    /* response
    ------------------------------ */
    response : function(response){
      var that    = this;
      switch(response.code){
        case 0:
          var total   = $('.breadcrumb').find('li').length;
          var current = 3;
          var percent = (current/total) * 100;
          $('#newLocation').find('.bar').css({width:percent+'%'});                    
          setTimeout(function(){
            document.getElementById('locationForm').reset();
            $('#showSites').click();    
            bootbox.alert('Información para este Sitio ha sido guardada');        
            //$('#newLocation').bootstrapWizard('first');
            $('#newLocationContainer').html('');
             that.loadPanel();
          },300);

        break;
        case 100:
          bootbox.alert(response.msg);
        break;
      }
    },    
    /* setWIzard
    ------------------------------ */
    setWizard : function (){
      $('#newLocation').bootstrapWizard({
          nextSelector:'.button-next',
          onNext: function(tab, navigation, index) { 
            return Validation.isValid();
          },
          onTabShow:function(tab, navigation, index) {              
              $('#btNext').show();   
              switch( index ){  
                case 0:     
                  Validation.tab('#tab1');             
                break;             
                case 1:                      
                  Validation.tab('#tab2'); 
                break;
                case 2:
                  $('#btNext').hide();                      
                  Validation.tab('#tab3');
                break;
                default:
                  console.log('ready to go')
                break;
              }
              var total   = navigation.find('li').length;
              var current = index;
              var percent = (current/total) * 100;
              $('#newLocation').find('.bar').css({width:percent+'%'});  
          },
          onTabClick:function(tab, navigation, index) { 
            if( typeof(window.location_status) == 'undefined' ){
              return false;
            }
          }
      });
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
    /* the Date component
    ------------------------------ */
    setCalendar : function(){          
      var today    = new Date(); 
      var dd       = today.getDate(); 
      var mm       = today.getMonth()+1;//January is 0! 
      var yyyy     = today.getFullYear(); 
      if(dd<10){dd = '0'+dd} 
      if(mm<10){mm = '0'+mm}    
      var theDate  = dd + "-" + mm + "-" + yyyy;
      $('#dp1, #dp2').attr('data-date', theDate);
      $('#dp1, #dp2').datepicker();
    
    },   
    /* @loadObject
    ----------------------------*/
    loadObject : function(id){

      var that = this;
      $.post('/v1/location/load', {id:id},function(r){     

        for( x in r.data ){
          if( typeof r.data[x] != 'object'){ 
            $('#'+x).val(r.data[x]);
            $('#d_'+x).html(r.data[x]);            
          }else{            
              for ( i in r.data[x]){
                $('#'+x+'_'+i).val(r.data[x][i]);
              }
          }
        }
 
        $("input[name=view_type][value=" + r.data.view_type + "]").prop('checked', true);
        $("input[name=type][value=" + r.data.type + "]").prop('checked', true);
        $("input[name=light][value=" + r.data.light + "]").prop('checked', true);
        $("input[name=light][value=" + r.data.light + "]").prop('checked', true);
        $('#content_0').val(r.data.content[0]);
        $('#content_1').val(r.data.content[1]);
        $('#content_2').val(r.data.content[2]);        
        $('#delivery_address').val(r.data.deliver.address);
        $('#delivery_city').val(r.data.deliver.city);
        $('#delivery_street').val(r.data.deliver.street);        
        $('#delivery_neighbor').val(r.data.deliver.neighbor);
        $('#delivery_phone').val(r.data.deliver.phone);
        $('#delivery_state').val(r.data.deliver.state);
        $('#delivery_zip').val(r.data.deliver.zip);
        
        // $('#d_base').val(r.data.measures.base);
        // $('#d_height').val(r.data.measures.height);
        // $('#d_material').val(r.data.measures.material);
        // $('#eaddress').val( r.data.deliver.address);
        // $('#ephone').val( r.data.deliver.phone);
        // $('#estreet').val( r.data.deliver.street);
        // $('#eneighbor').val( r.data.deliver.neighbor);
        // $('#ecity').val( r.data.deliver.city);
        // $('#ezip').val( r.data.deliver.zip);
        // $('#estate').val( r.data.deliver.state);
        // $('#newLocation').show();


      });
    },
    
    /* @loadPanel 
    ----------------------------*/
    loadPanel : function(){
        var that = this;
        $.post('/v1/location/all', { id:window.supplier},function(r){              
              if(r.code == 0){
                var ul   = document.createElement('ul');
                  $('#placesList').html('');
                  $('#placesList').append(ul);                  
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
                      var lightview = document.createElement('a');
                          lightview.id           = 'lv_'+row._id;
                          lightview.href         = '/assets/img/placeholder.jpg';
                          lightview.className    = 'lightview';
                          lightview.setAttribute("data-lightview-options", "skin: 'mac'");
                      $(span).append(lightview);
                     
                      var image = document.createElement('img');
                          image.id         = 'locimage_'+row._id;
                          image.src        = '/assets/img/placeholder.jpg';
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
                            var id = this.id.split('_')[1];

                            window.location_id     = id;
                            window.location_status = 'update';
                            
                            $('#newLocation').show();
                            $('#placesList').hide();

                              that.getForm(function(){
                                that.setForm();
                                that.setWizard();
                                that.setMask();
                                that.setCalendar();
                                that.loadObject(id);
                              });

                            // //that.setImage(id, '#previewImage', '#previewLightbox');

                            // $('#placesList').hide();
                            // //$('#placeDetail').show();

                            // $('#lastSites').click( function (e) {          
                            //     $('#placeDetail').hide();
                            //     that.loadPanel();
                            //     $('#previewImage').attr('src','/assets/img/placeholder.jpg');
                            //     $('#previewLightbox').attr('href','/assets/img/placeholder.jpg');
                            //     $('#placesList').show();
                            //     e.preventDefault();
                            // });
                          }

                      $(h6).append(a);
                       var inspan2 = document.createElement('span');
                           inspan2.className = 'size'; 
                           inspan2.innerHTML = '<b>Medidas: </b>' + row.measures.base +'x' +row.measures.height;
                      $(span2).append(inspan2);
                      var dfrom   = new Date(row.from);
                          dtfrom= '';
                          dtfrom += dfrom.getDate();
                          dtfrom += '/'+ dfrom.getMonth();
                          dtfrom += '/'+dfrom.getFullYear();
                      var dto   = new Date(row.to);
                          dtto  = '';
                          dtto  += dto.getDate();
                          dtto  += '/'+dto.getMonth();
                          dtto  += '/'+dto.getFullYear();
                       var inspan2_1 = document.createElement('span');
                           inspan2_1.className = 'show';
                           inspan2_1.innerHTML = '<b>Fecha de exhibición: </b>' + dtfrom +' al ' + dtto;
                      $(span2).append(inspan2_1);

                          var dto = new Date(row.created);
                          dtto  = '';
                          dtto  += dto.getDate();
                          dtto  += '/'+dto.getMonth();
                          dtto  += '/'+ dto.getFullYear();

                       var inspan2_1 = document.createElement('span');
                           inspan2_1.className = 'show';
                           inspan2_1.innerHTML = '<b>Fecha de activación: </b>' + dtto;
                      $(span2).append(inspan2_1);

                      var inspan2_2 = document.createElement('span');
                           inspan2_2.className = 'detail';
                           inspan2_2.innerHTML = '<b>Código: </b>' + row.code;
                      $(span2).append(inspan2_2);

                      var span3 = document.createElement('span');
                          span3.className = 'status';
                          span3.innerHTML = '<p>Status</p>';
                      $(li).append(span3);

                      that.setStatus(row._id,span3);                     
                     
                    /*------------------------------------------ */
                       var fix    = document.createElement('div');
                          fix.className = 'fix';
                         $(li).append(fix);
                  }
              }else{
                bootbox.alert('No se han logrado cargar las locaciones para este proveedor!');   
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

   

   /* @loadPanelForView 
    ----------------------------*/
    loadPanelForView : function(){
        var that = this;
        $.post('/v1/location/all', { id:window.supplier},function(r){              
              if(r.code == 0){
                var ul   = document.createElement('ul');
                  $('#placesList').html('');
                  $('#placesList').append(ul);                  
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
                      var lightview = document.createElement('a');
                          lightview.id           = 'lv_'+row._id;
                          lightview.href         = '/assets/img/placeholder.jpg';
                          lightview.className    = 'lightview';
                          lightview.setAttribute("data-lightview-options", "skin: 'mac'");
                      $(span).append(lightview);
                     
                      var image = document.createElement('img');
                          image.id         = 'locimage_'+row._id;
                          image.src        = '/assets/img/placeholder.jpg';
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
                            var id = this.id.split('_')[1];

                            window.location_id     = id;
                            window.location_status = 'update';
                            
                            $('#newLocation').show();
                            $('#placesList').hide();

                              that.getForm(function(){
                                that.setForm();
                                that.setWizard();
                                that.setMask();
                                that.setCalendar();
                                that.loadObject(id);
                              });

                            // //that.setImage(id, '#previewImage', '#previewLightbox');

                            // $('#placesList').hide();
                            // //$('#placeDetail').show();

                            // $('#lastSites').click( function (e) {          
                            //     $('#placeDetail').hide();
                            //     that.loadPanel();
                            //     $('#previewImage').attr('src','/assets/img/placeholder.jpg');
                            //     $('#previewLightbox').attr('href','/assets/img/placeholder.jpg');
                            //     $('#placesList').show();
                            //     e.preventDefault();
                            // });
                          }

                      $(h6).append(a);
                       var inspan2 = document.createElement('span');
                           inspan2.className = 'size'; 
                           inspan2.innerHTML = '<b>Medidas: </b>' + row.measures.base +'x' +row.measures.height;
                      $(span2).append(inspan2);
                      var dfrom   = new Date(row.from);
                          dtfrom= '';
                          dtfrom += dfrom.getDate();
                          dtfrom += '/'+ dfrom.getMonth();
                          dtfrom += '/'+dfrom.getFullYear();
                      var dto   = new Date(row.to);
                          dtto  = '';
                          dtto  += dto.getDate();
                          dtto  += '/'+dto.getMonth();
                          dtto  += '/'+dto.getFullYear();
                       var inspan2_1 = document.createElement('span');
                           inspan2_1.className = 'show';
                           inspan2_1.innerHTML = '<b>Fecha de exhibición: </b>' + dtfrom +' al ' + dtto;
                      $(span2).append(inspan2_1);

                          var dto = new Date(row.created);
                          dtto  = '';
                          dtto  += dto.getDate();
                          dtto  += '/'+dto.getMonth();
                          dtto  += '/'+ dto.getFullYear();

                       var inspan2_1 = document.createElement('span');
                           inspan2_1.className = 'show';
                           inspan2_1.innerHTML = '<b>Fecha de activación: </b>' + dtto;
                      $(span2).append(inspan2_1);

                      var inspan2_2 = document.createElement('span');
                           inspan2_2.className = 'detail';
                           inspan2_2.innerHTML = '<b>Código: </b>' + row.code;
                      $(span2).append(inspan2_2);

                      var span3 = document.createElement('span');
                          span3.className = 'status';
                          span3.innerHTML = '<p>Status</p>';
                      $(li).append(span3);

                      that.setStatus(row._id,span3);                     
                     
                    /*------------------------------------------ */
                       var fix    = document.createElement('div');
                          fix.className = 'fix';
                         $(li).append(fix);
                  }
              }else{
                bootbox.alert('No se han logrado cargar las locaciones para este proveedor!');   
              }
        });
    },
   
    /* the Date component
    ------------------------------ */
    loadPanelSupplierView : function(id){
      var that        = this;
      window.supplier = id;

       $('#newPlace').click(function(e){
          delete window.location_id ;
          delete window.location_status ;
                  
           that.getForm(function(){
            that.setForm();
            that.setWizard();
            that.setMask();
            that.setCalendar();           
          });      
      });

      $.ajax({
        type: "POST",
        data:{id:id},
        url: "/v1/location/all",
        success : function(response){

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
              title.innerHTML = e.street +' '+e.neighbor+' '+e.city+' '+e.state;
              $(h4).append(title);
            var small = document.createElement('small');
              small.innerHTML = '';
              $(div).append(small);
            var spanDate = document.createElement('span');

              var tdate = new Date(e.created);
                  month = new String( tdate.getMonth( ) );            
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
                  
                  $('#newLocation').show();
                  $('#placesList').hide();

                   that.getForm(function(){
                      that.setForm(function(){
                        that.loadPanelSupplierView(window.supplier);
                      });
                      that.setWizard();
                      that.setMask();
                      that.setCalendar();
                      that.loadObject(id);
                    });

                // var id   = this.id.split('_')[1];
                // window.supplier = id;
                // $('#SupplierActions').show();
                // $('#placesList').hide();
                // $('#suppliersList li.active').removeClass('active');
                // $(this).addClass('active');
                // $('#newPlace, #deletePlace').show();                
                // that.loadObject(id);


                // window.fields = []; 
                // document.getElementById('locationForm').reset();
                // Validation.tab('#tab1');
                // $('#supplier').val(id);                 

                // //  $('#cancelNewPlace').click(function(e){  
                // //      e.preventDefault();                   
                // //      $('#newLocation').hide();
                // //      $('#newSupplier').show();
                // //      $('#sideCont').height('auto');

                // //   });

              }
          })
          
        }
      })

    }

});