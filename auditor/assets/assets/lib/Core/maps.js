var map;
var locations = [];
var markers = [];
var markersPlus = [];
var markerCluster = null;
var markerManager = null;
var mgrOptions = { borderPadding: 50, maxZoom: 21, trackMarkers: true };

Core_Map = Core.extend({  

  init : function(){      
     this.panels();
  },
  /*@run
  ---------------------------------*/

  // run : function(supplier){

  //   //if( typeof supplier == 'undefined'){
  //   //    this.runAdmin();
  //   //}else{
  //   //  this.supplier = supplier;
  //   //    this.runSupplier(supplier);
  //   //}  
  // },
  run : function(){
    // this.supplier = '1';
    // this.admin = '1';
    this.map();
    // this.deleteRow();
    // this.loadSupplier();
    // $('#addArt').hide();

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

    //map_canvas
    $('#map_canvas').height( ($(window).height() - 250 ) + 'px' );
    
    /* -- initialize maps --- */
    this.initializeMaps();

    states = [
      ['all','23.40','-102.11',5],
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
      ['Zacatecas','23.180764','-102.657108',5]
    ];


     $('#state').on('change',function(){
  
        var state = this.value;
        var lat   = parseFloat(states[state][1]);
        var lng   = parseFloat(states[state][2]);  
        var zoom  = parseFloat(states[state][3]);  
        theLocation.map.setCenter(new google.maps.LatLng(lat,lng));
        theLocation.map.setZoom(zoom);

    });
    
  },

  initializeMaps :  function () {

    theLocation                 = {}
    theLocation.pics            = null;
    theLocation.map             = null;
    theLocation.markerClusterer = null;
    theLocation.markers         = [];
    theLocation.infoWindow      = null;
    
    var options = {
      zoom:5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: new google.maps.LatLng(23.40, -102.11),      
    };

    theLocation.map        = new google.maps.Map(document.getElementById("map_canvas"),options);    
    theLocation.infowindow = new google.maps.InfoWindow({maxWidth:400}); 

    this.loadLocations();

  },

  loadLocations : function(){
    var that = this;
    $.get('/maps/locations',function(data){        
        that.locations = data;
        that.showMarkers();
    });

  },

   showMarkers : function () {

      that = this;

      //clear
      if( theLocation.markerClusterer ){
        theLocation.markerClusterer.clearMarkers();
      }

      if ( this.locations.length > 0) {

        for ( x in this.locations ){

           var location     = this.locations[x];
            var title       = location.street;           
            var position    = new google.maps.LatLng(location.lat,location.lng);            
            var imageUrl    = 'http://iclicauditor.com/assets/img/pin.png';
            var markerImage = new google.maps.MarkerImage(imageUrl,new google.maps.Size(24, 32));
            var marker      = new google.maps.Marker({
              'position': position,
               title: location.code
            });
              
              var fn = that.markerClickFunction(location,position,marker);
              google.maps.event.addListener(marker, 'click', fn);                
              theLocation.markers.push(marker);                  
        }

       
        //put locations in the map
        theLocation.markerClusterer = new MarkerClusterer(theLocation.map, theLocation.markers); 

      }
    
  },

  markerClickFunction : function(location, position,marker) {
    return function(e) {

      e.cancelBubble = true;
      e.returnValue = false;
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }

        var pano = null;
        google.maps.event.addListener(theLocation.infowindow, 'domready', function () {
            if (pano != null) {
                pano.unbind("position");
                pano.setVisible(false);
            }
            pano = new google.maps.StreetViewPanorama(document.getElementById("markerInfo"),{
            position: position,
            pov: {
              heading: 34,
              pitch: 10,
              zoom: 1
            }
          });
            pano.bindTo("position", marker);
            pano.setVisible(true);
        });

        // google.maps.event.addListener(theLocation.infowindow, 'closeclick', function () {
        //     //pano.unbind("position");
        //     //pano.setVisible(false);
        //     //pano = null;
        // });

    
     var code     = location.code;
     var address  = location.street +','+ location.neighbor +', CP:'+location.zip + ',' + location.city + ','+location.state;
     var infoHtml = '<div class=""><strong>Código:</strong> '+code+'<hr/> <strong>Dirección:</strong>'+address+' <hr/> <div id="markerInfo" style="width:400px; height:300px"></div> </div>';
     theLocation.infowindow.setContent(infoHtml);
     theLocation.infowindow.setPosition(position);
     theLocation.infowindow.open(theLocation.map);

             

    };
  },

 
  addMarkersAllMap : function(map){
    for (var i = 0; i < theLocation.markers.length; i++) {
      theLocation.markers[i].setMap(map);
    }
  }

});