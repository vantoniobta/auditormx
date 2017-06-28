var map;
var geocoder;
var locations = [];
var markers = [];
var markersPlus = [];
var markerCluster = null;
var markerManager = null;
var mgrOptions = { borderPadding: 50, maxZoom: 21, trackMarkers: true };
var states = null;

App_Map = App.extend({  
  supplier : '1',
  admin: '',
  rowArt : 1,
  numArt : 0,
  
  init : function(){      
     this.panels();
  },
  /*@run
  ---------------------------------*/

  run : function(supplier){

    //if( typeof supplier == 'undefined'){
    //    this.runAdmin();
    //}else{
    //  this.supplier = supplier;
    //    this.runSupplier(supplier);
    //}  
  },
  runAdmin : function(){
    this.supplier = '1';
    this.admin = '1';
    this.map();
    this.deleteRow();
    this.loadSupplier();
    //this.loadSelectArt('#content_0');
    this.setForm();
    //$('#addArt').hide();

  },
  runSupplier : function(supplier){   
    var that = this;
    this.supplier = supplier;
    this.map();
    $('#infoContent').hide();
    $('.list-supplier').addClass('hide');
  },


  /*@reset
  ---------------------------------*/
  map : function(){
    var that = this;
    //states = (['ST','21.883483','-102.294586‎',8]);
    states = [
      ['Distrito Federal','19.312439','-99.129853',10],
      ['Aguas Calientes','21.883483','-102.294586‎',9],
      ['Baja California','30.55','-115.166667',7],
      ['Baja California Sur','25.98767','-111.754646',7],
      ['Campeche','18.776316','-90.275087‎',8],
      ['Chiapas','16.667769','-92.532778‎',8],
      ['Chihuahua','28.652031','-106.305428‎',7],
      ['Coahuila','27.342494','-101.943855',7],
      ['Colima','19.186678','-103.834748',10],
      ['Durango','24.956180','-104.921150',7],
      ['Guanajuato','21.058871','-101.014223',9],
      ['Guerrero','17.570721','-99.817142',8],
      ['Hidalgo','20.529933','-98.960209',9],
      ['Jalisco','20.483628','-103.816166‎',8],
      ['Estado de Mexico','19.326695','-99.701786',8],
      ['Michoacan','19.103648','-101.657352',8],
      ['Morelos','18.759412','-99.043336',10],
      ['Nayarit','21.815608','-104.755497',8],
      ['Nuevo Leon','25.532528','-99.845467',7],
      ['Oaxaca','17.088291','-96.521244',8],
      ['Puebla','18.953051','-97.789736',8],
      ['Queretaro','20.830577','-99.822206',9],
      ['Quintana Roo','19.487308','-88.259525',7],
      ['San Luis Potosi','22.532854','-100.374269',8],
      ['Sinaloa','24.996016','-107.448006',7],
      ['Sonora','29.707139','-110.699959',7],
      ['Tabasco','17.991958','-92.933033‎',8],
      ['Tamaulipas','24.277012','-98.560066',7],
      ['Tlaxcala','19.404430', '-98.157563',10],
      ['Veracruz','19.704658','-96.879158',7],
      ['Yucatan','20.735566','-88.870125',8],
      ['Zacatecas','23.180764','-102.657108',8]
    ];
    initializeMaps();


    // states : [{'mx':[1,2]},{bs:[23,53]} ]
    // for( x in states){
    //      for( a in states[x] ){
    //           if( states[x][a] == 324 ){
    //             return states[x];
    //           } 
    //      }
    // }
    
    function initializeMaps() {
      var myOptions = {
        zoom:5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(21.10, -105.11),
        mapTypeControl: false
      };
      geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
      that.setMarkers();
    }
    //console.log($('#state'));
    $('#state').on('change',function(){
  
      var numState = $(this).val();
      if (numState >= 0) {
        var addressState = states[$(this).val()][0]+', Mexico';
        geocoder.geocode( { 'address': addressState}, function(results, status) {
          
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(states[numState][3]);
          } else {
            that.newCenterMap($(this).val(),map);
          }
        });
      }else{
        map.setCenter(new google.maps.LatLng(21.10, -105.11));
        map.setZoom(5);
      }
    });
      
      $('#list-supplier').on('change',function(){
        //console.log('ooa');
        $('#state').val(-1);
        that.deleteMarker();
        that.supplier = $(this).val();
        that.setMarkers();
        map.setCenter(new google.maps.LatLng(21.10, -105.11));
        map.setZoom(5)
        //that.runSupplier($(this).val());
        //that.loadMarkerBySupplier($(this).val(),map,markers);
      }); 

  },
  getContent : function (row, marker, infowindow ){

    var pano       = null;

          var content  = '<div id="inFoWindow" style="width:430px;height:100px;">';
              content += '<strong>Código: </strong>'+row.code+'<br>'+'<strong>Dirección: </strong>'+row.street +', '+row.neighbor+'. CP. '+row.zip+'. ';
              content += row.city+', '+row.state+'<br> ';
              content += row.ref_street.length > 0 ? '<strong>Entre calles: </strong>'+ row.ref_street[0] +' y '+ row.ref_street[1]:'';
              content += '</div>';

         return content;


  },
  
  notMarkerMap : function(map){
    map.setOptions({
          zoom: 5
          , center: new google.maps.LatLng(21.10, -105.11)
          , mapTypeId: google.maps.MapTypeId.ROADMAP
   
          , keyboardShortcuts: true
          , disableDoubleClickZoom: false
          , draggable: true
          , scrollwheel: true
          , draggableCursor: 'hand'
          , draggingCursor: 'hand'
   
          , mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
              , position: google.maps.ControlPosition.TOP_RIGHT
              , mapTypeIds: [
                  google.maps.MapTypeId.ROADMAP
                  , google.maps.MapTypeId.SATELLITE
              ]
          }
   
          , navigationControlOptions: {
              position: google.maps.ControlPosition.TOP_LEFT
              , style: google.maps.NavigationControlStyle.ZOOM_PAN
          }
   
          , scaleControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_LEFT
              , style: google.maps.ScaleControlStyle.DEFAULT
          }
      });
  },

  newCenterMap : function(state,map){
    if (state > -1) {
      map.setCenter(new google.maps.LatLng(parseFloat(states[state][1]),parseFloat(states[state][2])));
      map.setZoom(states[state][3]);
    }else{
      map.setCenter(new google.maps.LatLng(23.40, -102.11));
      map.setZoom(5);
    }
  },
  //setCalendar : function(){
  //
  //    var today    = new Date(); 
  //    var dd       = today.getDate(); 
  //    var mm       = today.getMonth()+1;//January is 0! 
  //    var yyyy     = today.getFullYear(); 
  //    if(dd<10){dd = '0'+dd} 
  //    if(mm<10){mm = '0'+mm}    
  //    var theDate  = dd + "-" + mm + "-" + yyyy;
  //    $('.date').attr('data-date', theDate);
  //    $('.date').datepicker();
  //  
  //  }
    //,
  getIconMarker : function(){
    var that = this;
    var goldStar = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      fillColor: that.getColor(),
      scale: 5,
      fillOpacity: 0.8,
      strokeColor: "#000000",
      strokeWeight: 2
    };
    return goldStar;
  },  
  getColor : function(){ 
    long=6;
    var caracteres = "0123456789ABCDEF";
    var color = "";
    for (i=0; i<long; i++) color += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
    color="#"+color;
    return color;
  },
  
 
  deleteRow : function (){
    $('.delereRow').click(function(){
      console.log($(this).val());
    });
  },
  
  loadSupplier : function(){
    $('#supplier').data('lock',true);
      $.ajax({
      url : 'v1/suppliers/all',
      type: 'POST',
      data:{noMaxRow : ''},
      success: function(response){          
          $('#list-supplier').append('<option value="1">Todos los proveedores</option>');
          $(response.data).each(function(i,supplier){
            $('#list-supplier').append('<option value="'+supplier._id+'">'+supplier.name+'</option>');
          }); 
        }
      });
  },
  setMarkers : function(){
    var that = this;
    var idSuppleir = '';
    var iconMarker = '';
    that.loadAllMarker(function(response){
      locations = response.data;
      setMarkersMap();
    }); 
    
    function setMarkersMap() {
      if (locations.length > 0) {
        var infowindow = new google.maps.InfoWindow(); 
        var i;
        //var bounds = new google.maps.LatLngBounds();
        var idSuppleir = '';
        var iconMarker = '';
      
        for (i = 0; i < locations.length; i++) { 


        
          var pos = new google.maps.LatLng(parseFloat(locations[i].coords.lat), parseFloat(locations[i].coords.lng));
          //bounds.extend(pos);
          if (idSuppleir != locations[i].supplier) {
            iconMarker = that.getIconMarker();
            idSuppleir = locations[i].supplier;
          }
          var marker = new google.maps.Marker({
            position: pos,
            icon: iconMarker,
            animation: google.maps.Animation.DROP,
            map: map
          });
          //console.log(markers);
          markers.push(marker);
          
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              
              infowindow.setContent( that.getContent(locations[i], marker, infowindow) );
              infowindow.open(map, marker);
              //console.log(that.admin);
              if(that.admin === '1'){
                
                that.getForm( locations[i]._id );
                that.loadInfoLocation(locations[i]._id);
              }

              // if (that.supplier.length == '1'  || that.admin.length > 0) {
              //   //$('#searchMap').hide();
              //   $('#addArt').show();
              //   $('#formTitle').html('<i class="icon-map-marker"></i> Contratar Sitio:').show(); 
              // }
            }

          })(marker, i));
          markersPlus.push(marker);
        }
        google.maps.event.addListener(infowindow,'closeclick', function(){
            //if(that.suppplier == undefined){
            //  $('#searchMap').show();
            //  $('#addArt').hide();
            //  var content = '<label for="state" class="control-label">Agregar todos los sitios del estado de:</label>'+
            //'<div class="controls">'+
            //      '<select id="state" name="state" required="required" class="span10">'+
            //            '<option >Distrito Federal</option>'+
            //            '<option >Aguascalientes</option>'+
            //            '<option >Baja California</option>'+
            //            '<option >Baja California Sur</option>'+
            //            '<option >Campeche</option>'+
            //            '<option >Chiapas</option>'+
            //            '<option >Chihuahua</option>'+
            //            '<option >Coahuila</option>'+
            //            '<option >Colima</option>'+
            //            '<option >Durango</option>'+
            //            '<option >Guanajuato</option>'+
            //            '<option >Guerrero</option>'+
            //            '<option >Hidalgo</option>'+
            //            '<option >Jalisco</option>'+
            //            '<option >Estado de México</option>'+
            //            '<option >Michoacán</option>'+
            //            '<option >Morelos</option>'+
            //            '<option >Nayarit</option>'+
            //            '<option >Nuevo León</option>'+
            //            '<option >Oaxaca</option>'+
            //            '<option >Puebla</option>'+
            //            '<option >Querétaro</option>'+
            //            '<option >Quintana Roo</option>'+
            //            '<option >San Luis Potosí</option>'+
            //            '<option >Sinaloa</option>'+
            //            '<option >Sonora</option>'+
            //            '<option >Tabasco</option>'+
            //            '<option >Tamaulipas</option>'+
            //            '<option >Tlaxcala</option>'+
            //            '<option >Veracruz</option>'+
            //            '<option >Yucatán</option>'+
            //            '<option >Zacatecas</option>'+
            //      '</select>'+
            //'</div>';
            //  $('#infoLocation').html(content);
            //  // if (map.getZoom() > 6) {
            //  //  map.setZoom(map.getZoom()- 2);
            //  // }
            //}
        });
        that.addMarkersAllMap(map);
        markerCluster = new MarkerClusterer(map, markersPlus);
        //markerManager = new MarkerManager(map,mgrOptions);
        
        google.maps.event.addListener(map, 'zoom_changed', function() {
            //console.log(map.getZoom());
            if(map.getZoom() == 21){
              markerCluster.clearMarkers();
              if(markerManager){
                if(markerManager.isHidden()){
                  markerManager.show();
                }
              }else{
                markerManager = new MarkerManager(map,{trackMarkers: true, maxZoom: 21});
              //markerManager.getMarkerCount();
                google.maps.event.addListener(markerManager, 'loaded', function() {
                  markerManager.addMarkers(markersPlus,21,21);
                  markerManager.refresh();
                });
              }
            }else{
              if(markerManager){
                if(!markerManager.isHidden()){
                  markerManager.show();
                  markerManager.refresh();
                }else{
                  markerManager.hide();
                }
              }
              markerCluster.addMarkers(markersPlus);
              markerCluster.redraw();
            }
        });

      }else{
        that.notMarkerMap(map);
      }
    }
  },


  /* @addArt
  ------------------------------ */
  //getForm : function(id){
  //
  //  var that = this;
  //    $.ajax({
  //      type: "POST",
  //      url: "/v1/maps/form",
  //      success: function( response ){            
  //        $('#theTitle').html( 'Agregar a sitios activos' ).show();
  //        $('#infoContent').html(response);
  //        that.setCalendar();
  //        var inputId = document.createElement('input');
  //        inputId.name = "location";
  //        inputId.id = "location";
  //        inputId.type = "hidden";
  //        inputId.value = id;
  //
  //        $("#inventory").prepend(inputId);
  //        that.setForm();
  //      }
  //      
  //  });
  //    
  //   var artVersions = new App_Art();
  //   $.ajax({
  //      url : '/v1/art/all',
  //      type : 'POST',
  //      dataType : 'JSON',
  //      data: {select:''},
  //      success : function(data){
  //        artVersions.loadSelect('#content_0',data);
  //        $('.version_text').val(data.data[0].versions[0]);
  //        that.insertTextVersion();
  //      }
  //   });
  //
  //},
  
   setForm : function(){
      var that = this;
      //$('#add-art').click(function(){
      //  that.addArt();
      //});
      
      $('#searchMap').submit(function(){
          var supplier = $('#list-supplier').val();
          var state = $('#state').val();
          if (parseInt(state) != -1) {
            state = states[state][0];
          }
           $.ajax({
            type: "POST",
            url: "/v1/location/contract",
            data:{state : state, supplier : supplier},
            success: function( response ){            
              if(response.code == 0){
                if (typeof(response.data) != 'undefined') {
                  bootbox.alert('<div class="alert alert-success">'+response.msg+'<br>De los '+response.data.total+' sitios '+response.data.error+' no pudieron ser contratados </div>');
                }else{
                  bootbox.alert('<div class="alert alert-success">'+response.msg+'</div>');
                }
                
              }else{
                bootbox.alert('<div class="alert alert-error">'+response.msg+'</div>');
              }
            }
        });
          return false;
      });
  },
  //loadInfoLocation : function(id){
  //  var that = this;
  //  
  //  $.post('/v1/location/load', {id:id},function(row){     
  //
  //      $('#infoLocation').html('');
  //      if(row.data.images.length > 0){
  //        var locationImages = document.createElement('ul');
  //        locationImages.id = 'locationImages'
  //        for( var x = 0; x < row.data.images.length; x++){
  //          if(x < 3){
  //            var li = document.createElement('li');
  //            
  //            var a = document.createElement('a');
  //            a.className = 'lightview';
  //            a.href = '/uploads/'+row.data.images[x].file;
  //            a.setAttribute('data-lightview-option','skin: mac');
  //            a.setAttribute('data-lightview-group','gallery');
  //            $(li).append(a);
  //            
  //            var image = document.createElement('img');
  //            image.className = 'img-polaroid';
  //            image.src = '/uploads/'+row.data.images[x].file;
  //            $(a).append(image);
  //            
  //            $(locationImages).append(li);
  //            
  //          }
  //        }
  //        
  //        var divFix = document.createElement('div');
  //        divFix.className = 'clearfix';
  //        $('#infoLocation').prepend(locationImages);
  //        $('#infoLocation').append(divFix);
  //      }
  //      var spanName = document.createElement('span');
  //      spanName.innerHTML = '<b>Code:</b> ' + row.data.code +'<br><b>Proveedor:</b> '+row.data.supplier.name;
  //      $('#infoLocation').append(spanName);
  //      $('#infoLocation').append('<br>');
  //      var direction = document.createElement('span');
  //      direction.innerHTML = '<b>Dirección: </b>' +row.data.street +', '+row.data.neighbor+'. CP. '+row.data.zip+'. ' + row.data.city+', '+row.data.state+'<br> ' +
  //                            (row.data.ref_street.length > 0 ? '<strong>Entre calles: </strong>'+ row.data.ref_street[0] +' y '+ row.data.ref_street[1]:'');
  //      $('#infoLocation').append(direction);
  //      $('#infoLocation').append('<hr>');
  //    });
  //},
  //
  //addArt : function(){
  //  var that = this;
  //  that.numArt ++;
  //  var container = "#arts";
  //
  //  var divArt = document.createElement('div');
  //  divArt.id = "art-" + that.numArt;
  //  $(container).append(divArt);
  //
  //    var divArtContent = document.createElement('div');
  //    divArtContent.className = "control-group";
  //      
  //    //   var labelContent = document.createElement('label');
  //    //   labelContent.className = "control-label";
  //    //   labelContent.setAttribute("for", "art_content_"+that.numArt);
  //    //   labelContent.innerHTML = "Arte " + (that.numArt + 1);
  //    // $(divArtContent).append(labelContent);
  //      
  //      var divControlContent = document.createElement('div');
  //      divControlContent.className = "controls input-append";
  //      
  //        var selectControl = document.createElement('select');
  //        selectControl.name='arts['+that.numArt+'][_id]';
  //        selectControl.id = "version_"+that.numArt;
  //        selectControl.setAttribute("required","required");
  //        selectControl.className = "span10 content_version";
  //        
  //        var inputContent = document.createElement('input');
  //        inputContent.className = "version_text";
  //        inputContent.name = "arts["+that.numArt+"][version]";
  //        inputContent.id = "content_"+that.numArt;
  //        inputContent.type = "hidden";
  //        inputContent.setAttribute("required", "required");
  //        
  //        var eliminar = document.createElement('button');
  //        //eliminar.href = "#";
  //        eliminar.type = 'button';
  //        eliminar.className = "btn btn-danger"
  //        eliminar.innerHTML = "x"; 
  //        eliminar.onclick = function(){
  //          $(this).parent().remove();
  //        }
  //        
  //      $(divControlContent).append(selectControl);
  //      $(divControlContent).append(inputContent);
  //      $(divControlContent).append(eliminar);
  //    $(divArtContent).append(divControlContent);
  //  $(divArt).append(divArtContent);

      //var divDateStart = document.createElement('div');
      //divDateStart.className = "control-group";
      //
      ////   var labelDateStart = document.createElement('label');
      ////   labelDateStart.className = "control-label";
      ////   labelDateStart.setAttribute("for","art_date_start_" + that.numArt);
      ////   labelDateStart.innerHTML = "Fecha Inicio";
      //// $(divDateStart).append(labelDateStart);
      //
      //  var divControl = document.createElement('div');
      //  divControl.className = "controls controls-row";
      //
      //    var divStart = document.createElement('div');
      //    divStart.className = 'span5';
      //    var inputDivStart = document.createElement('div');
      //    inputDivStart.className = "input-append date";
      //    inputDivStart.id = "input_art_date_start["+that.numArt+"]";
      //    inputDivStart.setAttribute("data-date-format","dd-mm-yyyy");
      //
      //      var inputStart = document.createElement('input');
      //      inputStart.name = "arts["+that.numArt+"][from]";
      //      inputStart.className = "span10";
      //      inputStart.id = "date_start_"+that.numArt;
      //      inputStart.type = "text";
      //      inputStart.setAttribute("placeholder","Fecha de Inicio");
      //      inputStart.setAttribute("required","required");
      //      inputStart.setAttribute("readonly","");
      //      var spanStart = document.createElement('span');
      //      spanStart.className = "add-on";
      //      spanStart.innerHTML = '<i class="icon-th"></i>';
      //    $(inputDivStart).append(inputStart);
      //    $(inputDivStart).append(spanStart);
      //    $(divStart).append(inputDivStart);
      //
      //    var divEnd = document.createElement('div');
      //    divEnd.className = 'span5 offset2';
      //    var inputDivEnd = document.createElement('div');
      //    inputDivEnd.className = "input-append date";
      //    inputDivEnd.id = "input_art_date_end["+that.numArt+"]";
      //    inputDivEnd.setAttribute("data-date-format","dd-mm-yyyy");
      //
      //      var inputEnd = document.createElement('input');
      //      inputEnd.name = "arts["+that.numArt+"][to]";
      //      inputEnd.className = "span10";
      //      inputEnd.id = "date_end_"+that.numArt;
      //      inputEnd.type = "text";
      //      inputEnd.setAttribute("placeholder","Fecha Fin");
      //      inputEnd.setAttribute("required","required");
      //      inputEnd.setAttribute("readonly","");
      //      var spanEnd = document.createElement('span');
      //      spanEnd.className = "add-on";
      //      spanEnd.innerHTML = '<i class="icon-th"></i>';
      //    $(inputDivEnd).append(inputEnd);
      //    $(inputDivEnd).append(spanEnd);
      //    $(divEnd).append(inputDivEnd);
      //
      //  $(divControl).append(divStart);
      //  $(divControl).append(divEnd);
      //$(divDateStart).append(divControl);
    //$(divArt).append(divDateStart);
    //var divider = document.createElement('hr');
    

    //$(divArt).append(eliminar);
  //  that.setCalendar();
  //   that.insertTextVersion();
  //},
  //
  loadSelectArt : function(select){
    var that = this;
    var artVersions = new App_Art();
    $.ajax({
       url : '/v1/art/all',
       type : 'POST',
       dataType : 'JSON',
       data: {select:''},
       success : function(data){
         artVersions.loadSelect(select,data);
         $(select).siblings('input').val(data.data[0].versions[0]);
         that.insertTextVersion();
       }
    });
  },


  /* @loadAllMarker
  ------------------------------ */
  loadAllMarker : function (callback){
  var that = this;
  var locations = [];
    if (that.supplier != '1') {
        $.ajax({
          url : '/v1/maps/coords',
          type:'POST',
          data: {idSupplier : that.supplier},
          success: function(data){
            $(data.data).each(function(i,row){
              if( typeof(row.coords) != 'undefined'){
                locations.push(row);
              }
            });
          }
        }).done(function(){
          callback({data : locations});
        });
    }else{
        $.ajax({
          url : '/v1/maps/coords',
          type:'POST',
          success: function(data){
            $(data.data).each(function(i,row){
              if( typeof(row.coords) != 'undefined'){
                locations.push(row);
              }
            });
          }
        }).done(function(){
          callback({data : locations});
        }); 
    }
  },
  
  deleteMarker : function(){
    this.addMarkersAllMap(null);
    markerCluster.clearMarkers();
    markersPlus = [];
    markers = [];
  },
  addMarkersAllMap : function(map){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
});