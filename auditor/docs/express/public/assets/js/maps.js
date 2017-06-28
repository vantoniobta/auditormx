var map;
var locations = [];
var markers = [];
var markersPlus = [];
var markerCluster = null;
App_Map = App.extend({  
  supplier : '1',
  admin: '',
  rowArt : 1,
  
  init : function(){  
    

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
    this.admin='1';
    this.map();
    this.setCalendar();
    this.addLocation();
    this.deleteRow();
    this.loadSupplier();
    $('#addArt').hide();

  },
  runSupplier : function(supplier){   
    var that = this;
    this.supplier = supplier;
    this.map();
    $('#addArt').hide();
    $('.list-supplier').addClass('hide');
  },


  /*@reset
  ---------------------------------*/
  map : function(){
    var that = this;
    //states = (['ST','21.883483','-102.294586‎',8]);
    states = [
      ['DF','19.312439','-99.129853',10],
      ['AS','21.883483','-102.294586‎',9],
      ['BC','30.55','-115.166667',7],
      ['BS','25.98767','-111.754646',7],
      ['CC','18.776316','-90.275087‎',8],
      ['CS','16.667769','-92.532778‎',8],
      ['CH','28.652031','-106.305428‎',7],
      ['CL','27.342494','-101.943855',7],
      ['CM','19.186678','-103.834748',10],
      ['DG','24.956180','-104.921150',7],
      ['GT','21.058871','-101.014223',9],
      ['GR','17.570721','-99.817142',8],
      ['HG','20.529933','-98.960209',9],
      ['JC','20.483628','-103.816166‎',8],
      ['MC','19.326695','-99.701786',8],
      ['MN','19.103648','-101.657352',8],
      ['MS','18.759412','-99.043336',10],
      ['NT','21.815608','-104.755497',8],
      ['NL','25.532528','-99.845467',7],
      ['OC','17.088291','-96.521244',8],
      ['PL','18.953051','-97.789736',8],
      ['QT','20.830577','-99.822206',9],
      ['QR','19.487308','-88.259525',7],
      ['SP','22.532854','-100.374269',8],
      ['SL','24.996016','-107.448006',7],
      ['SR','29.707139','-110.699959',7],
      ['TC','17.991958','-92.933033‎',8],
      ['TS','24.277012','-98.560066',7],
      ['TL','19.404430', '-98.157563',10],
      ['VZ','19.704658','-96.879158',7],
      ['YN','20.735566','-88.870125',8],
      ['ZS','23.180764','-102.657108',8]
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
        center: new google.maps.LatLng(23.40, -102.11),
        mapTypeControl: false
      };
      map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
      that.setMarkers();
    }
    
    $('#state').on('click',function(){
        that.newCenterMap($(this).val(),map);
      });
      
      $('#list-supplier').on('change',function(){
        //console.log('ooa');
        $('#state').val(-1);
        that.deleteMarker();
        that.supplier = $(this).val();
        that.setMarkers();
        map.setCenter(new google.maps.LatLng(23.40, -102.11));
        map.setZoom(5)
        //that.runSupplier($(this).val());
        //that.loadMarkerBySupplier($(this).val(),map,markers);
      }); 

  },
  getContent : function (row, marker, infowindow ){

    var pano       = null;
    google.maps.event.addListener(infowindow, 'domready', function () {
        if (pano != null) {
            pano.unbind("position");
            pano.setVisible(false);
        }
        pano = new google.maps.StreetViewPanorama(document.getElementById("streetViewContainer"), {
            navigationControl: true,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.ANDROID },
            enableCloseButton: false,
            addressControl: false,
            linksControl: false
        });
        pano.bindTo("position", marker);
        pano.setVisible(true);

    });
          var content  = '<div id="inFoWindow" style="width:450px;height:400px;">';
              content += '<strong>Código: </strong>'+row.code+'<br>'+'<strong>Dirección: </strong>'+row.street +', '+row.neighbor+'. CP. '+row.zip+'. ';
              content += row.city+', '+row.state+'<br> ';
              content += row.ref_street.length > 0 ? '<strong>Entre calles: </strong>'+ row.ref_street[0] +' y '+ row.ref_street[1]:'';
              content += '<br> <br><div id="streetViewContainer"  style="clear:both; width:450px; height:300px; "></div>';

          if (row.images) {
            for (i in row.images) {
              content += '<img  width="30" height="30" src="uploads/'+row.images[i].file+'" >';
            }
          }
          content += '</div>';

         return content;


  },
  openViewStreet : function(marker,infowindow){

  },
  notMarkerMap : function(map){
    map.setOptions({
          zoom: 5
          , center: new google.maps.LatLng(23.40, -102.11)
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
  setCalendar : function(){

      var today    = new Date(); 
      var dd       = today.getDate(); 
      var mm       = today.getMonth()+1;//January is 0! 
      var yyyy     = today.getFullYear(); 
      if(dd<10){dd = '0'+dd} 
      if(mm<10){mm = '0'+mm}    
      var theDate  = dd + "-" + mm + "-" + yyyy;
      $('.date').attr('data-date', theDate);
      $('.date').datepicker();
    
    }
    ,
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
  addLocation : function(){
    var that = this;
    var container = document.getElementById('rows');
    
    var rowContainer = document.createElement('div');
          rowContainer.className   = 'rowContent';
           $(container).append(rowContainer);
      // From----------
      var inputSupplier = document.createElement('input');
          inputSupplier.type = 'hidden';
          inputSupplier.name = 'inventory[supplier]';
          $(container).append(inputSupplier);
      var inputLocation = document.createElement('input');
          inputLocation.type = 'hidden';
          inputLocation.name = 'inventory[location]';
          $(rowContainer).append(inputSupplier);
      
      var label     = document.createElement('label');
          label.innerHTML = 'De:';
          $(rowContainer).append(label);
      var divDate= document.createElement('div');
          divDate.className   = 'input-append date';
          divDate.setAttribute('data-date-format', 'dd-mm-yyyy');
          $(rowContainer).append(divDate);                      
      var inputFrom = document.createElement('input');
          inputFrom.className = 'span2 datepicker';
          inputFrom.type      = 'text';
          inputFrom.name      = 'inventory[from]';
          inputFrom.setAttribute('required', 'required');
          inputFrom.setAttribute('readonly', 'readonly');
          $(divDate).append(inputFrom);
      var spanCaret = document.createElement('span');
          spanCaret.className    = 'add-on';
          $(divDate).append(spanCaret);
      var theCaret = document.createElement('i');
          theCaret.className    = 'icon-caret-down';
          $(spanCaret).append(theCaret);
      // To----------
      var labelTo     = document.createElement('label');
          labelTo.innerHTML = 'De:';
          $(rowContainer).append(labelTo);
      var divDate2= document.createElement('div');
          divDate2.className   = 'input-append date';
          divDate2.setAttribute('data-date-format', 'dd-mm-yyyy');
          $(rowContainer).append(divDate2);                      
      var inputTo = document.createElement('input');
          inputTo.className = 'span2 datepicker';
          inputTo.type      = 'text';
          inputTo.name      = 'campaign[to]]';
          inputTo.setAttribute('required', 'required');
          inputTo.setAttribute('readonly', 'readonly');
          $(divDate2).append(inputTo);
      var spanCaret2          = document.createElement('span');
          spanCaret2.className= 'add-on';
          $(divDate2).append(spanCaret2);
      var theCaret2           = document.createElement('i');
          theCaret2.className = 'icon-caret-down';
          $(spanCaret2).append(theCaret2);
          that.setCalendar();
          
         // e.preventDefault();
  },
  addArt : function(){

    var that = this;

    $('#addRow').click( function (e) {
      // Container----------
      var container = document.getElementById('rows');
    
      var rowContainer = document.createElement('div');
          rowContainer.className   = 'rowContent';
          rowContainer.id = 'rowArt-'+that.rowArt;
           $(container).append(rowContainer);
      var hr = document.createElement('hr');
          $(rowContainer).append(hr);
      // From----------
      var label     = document.createElement('label');
          label.innerHTML = 'De:';
          $(rowContainer).append(label);
      var divDate= document.createElement('div');
          divDate.className   = 'input-append date';
          divDate.setAttribute('data-date-format', 'dd-mm-yyyy');
          $(rowContainer).append(divDate);                      
      var inputFrom = document.createElement('input');
          inputFrom.className = 'span2 datepicker';
          inputFrom.type      = 'text';
          inputFrom.name      = 'campaign[from][]';
          inputFrom.setAttribute('required', 'required');
          inputFrom.setAttribute('readonly', 'readonly');
          $(divDate).append(inputFrom);
      var spanCaret = document.createElement('span');
          spanCaret.className    = 'add-on';
          $(divDate).append(spanCaret);
      var theCaret = document.createElement('i');
          theCaret.className    = 'icon-caret-down';
          $(spanCaret).append(theCaret);
      // To----------
      var labelTo     = document.createElement('label');
          labelTo.innerHTML = 'De:';
          $(rowContainer).append(labelTo);
      var divDate2= document.createElement('div');
          divDate2.className   = 'input-append date';
          divDate2.setAttribute('data-date-format', 'dd-mm-yyyy');
          $(rowContainer).append(divDate2);                      
      var inputTo = document.createElement('input');
          inputTo.className = 'span2 datepicker';
          inputTo.type      = 'text';
          inputTo.name      = 'campaign[from][]';
          inputTo.setAttribute('required', 'required');
          inputTo.setAttribute('readonly', 'readonly');
          $(divDate2).append(inputTo);
      var spanCaret2          = document.createElement('span');
          spanCaret2.className= 'add-on';
          $(divDate2).append(spanCaret2);
      var theCaret2           = document.createElement('i');
          theCaret2.className = 'icon-caret-down';
          $(spanCaret2).append(theCaret2);
          that.setCalendar();
      // Art Input----------
      var labelArt           = document.createElement('label');
          labelArt.innerHTML = 'Arte:';
          $(rowContainer).append(labelArt);
      var textarea         = document.createElement('textarea');
          textarea.name    = 'campaign[art][]';
          textarea.setAttribute('rows', '3');
          textarea.setAttribute('required', 'required');
          $(rowContainer).append(textarea);
      var delRow           = document.createElement('a');
          delRow.className = 'btn btn-danger btn-mini deleteRow';
          delRow.id        = 'deleteRow-'+that.rowArt;
          delRow.innerHTML = 'Borrar Sección';
          delRow.href      = '#';
          $(rowContainer).append(delRow);
          
          that.rowArt = that.rowArt + 1;
    
      e.preventDefault();
    });
    
    $("#deleteRow").click(function(event) {
      event.preventDefault();
      // $(this).parents('.li').remove();
      alert('scgdfg');
    });
    
    that.setCalendar();

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
      type: 'GET',
      success: function(response){          
          $('#list-supplier').append('<option value="1">Todos los proveedores</option>');
          $(response.data).each(function(i,supplier){
            $('#list-supplier').append('<option value="'+supplier._id+'">'+supplier.name+'</option>');
          }); 
        }
      })
  },
  setMarkers : function(){
    var that = this;
    var idSuppleir = '';
    var iconMarker = '';
    that.loadAllMarker(function(response){
      locations = response.data;
      setMarkersMap();
    })
    
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
              if (that.supplier.length == '1'  || that.admin.length > 0) {
                $('#searchMap').hide();
                $('#addArt').show();
                that.addArt();
                $('#formTitle').html('<i class="icon-map-marker"></i> Contratar Sitio:').show();
              }
            }
          })(marker, i));
          markersPlus.push(marker);
        }
        google.maps.event.addListener(infowindow,'closeclick', function(){
            if(that.suppplier == undefined){
              $('#searchMap').show();
              $('#addArt').hide();
              // if (map.getZoom() > 6) {
              //  map.setZoom(map.getZoom()- 2);
              // }
            }
        });
        that.addMarkersAllMap(map);
        markerCluster = new MarkerClusterer(map, markersPlus );
        }else{
          that.notMarkerMap(map);
        }
    }
  },
  
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