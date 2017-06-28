App_Inventory = Core.extend({  
    
    /* init
    ------------------------------ */
    run : function(){
       this.setup();
       
       if (typeof(window.supplier) != 'undefined') {
        this.loadPanelSupplier();
       }else{
        this.loadPanel();
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
    loadPanel : function(){
      var that = this;
      $('#inventoryList').panel({
        rows: 10,
        rheight : '100px',
        navigation : '#mainFooter',
        source : '/v1/inventory/all',
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
            title.innerHTML = e.content;
            $(h4).append(title);

          var desc = document.createElement('div');
            desc.className = 'desc';
            $(div).append(desc);
            
          var tdate = new Date(e.from);
            month = new String( tdate.getMonth( ) +1 );            
            month = month.length == 1 ? '0'+ month : month;
            
          var from = document.createElement('span');
            from.innerHTML = '<b>Desde:</b> '+ tdate.getDate() + '/' + month + '/' + tdate.getFullYear() ;
            $(desc).append(from);
          
          tdate = new Date(e.to);
            month = new String( tdate.getMonth( ) +1 );            
            month = month.length == 1 ? '0'+ month : month;
          var to = document.createElement('span');
            to.innerHTML = '<b>Hasta:</b>' + tdate.getDate() + '/' + month + '/' + tdate.getFullYear() ;
            $(desc).append(to);

          var small = document.createElement('small');
            small.innerHTML = '<b>Código del sitio:</b> ' + e.location.code + ' <b>Proveedor:</b> ' + e.supplier.name;
            $(div).append(small);
        }
      });

    },
    loadPanelSupplier : function(id){
      var that = this;
      $('#inventoryList').panel({
        source: 'v1/inventory/all',
        params: {idSupplier : window.supplier},
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
            title.innerHTML = e.content;
            $(h4).append(title);

          var desc = document.createElement('div');
            desc.className = 'desc';
            $(div).append(desc);
            
          var tdate = new Date(e.from);
            month = new String( tdate.getMonth( ) +1 );            
            month = month.length == 1 ? '0'+ month : month;
            
          var from = document.createElement('span');
            from.innerHTML = '<b>Desde:</b> '+ tdate.getDate() + '/' + month + '/' + tdate.getFullYear() ;
            $(desc).append(from);
          
          tdate = new Date(e.to);
            month = new String( tdate.getMonth( ) +1 );            
            month = month.length == 1 ? '0'+ month : month;
          var to = document.createElement('span');
            to.innerHTML = '<b>Hasta:</b>' + tdate.getDate() + '/' + month + '/' + tdate.getFullYear() ;
            $(desc).append(to);

          var small = document.createElement('small');
            small.innerHTML = '<b>Código del sitio:</b> ' + e.location.code;
            $(div).append(small);
        }
      });
    },
  
    loadObject : function(id,obj){

        var that = this;
        $('#suppliersList li').removeClass('active');
        $(obj).addClass('active');
  
        $.ajax({
          type: "POST",
          url: "/v1/location/form",
          success: function( response ){            
            $('#theTitle').html( 'Agregar a Sitios Activos' ).show();
            $('#newLocationContainer').html(response);
            that.setCalendar(); 
          }
        });

    },
   
});