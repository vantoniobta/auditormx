App_Location = App.extend({  
   
    init : function(){    
      this.panels();     
    },
    /* init
    ------------------------------ */
    run : function(id){
       this.setup(); 
       this.loadPanel();
    },
    /*@setup
    -----------------------------*/
    setup : function(){
    
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
      $.ajax({
        type: "POST",
        url: "/v1/location/all",
        data:{page:that.pageL},
        success: function( response ) {
          that.pagination(2);
          that.isLogged(response,function(){            

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
                  title.innerHTML = e.street + ', '+e.neighbor+ ', '+e.city+ ', '+e.state+ '. CP. '+e.zip;
                  $(h4).append(title);
                var desc = document.createElement('div');
                  desc.className = 'desc';
                  $(div).append(desc);
                var rfc = document.createElement('span');
                  rfc.innerHTML = '<b>Compañía:</b> '+ e.supplier.name;
                  $(desc).append(rfc);
                var phone = document.createElement('span');
                    phone.innerHTML = '<b>Teléfono:</b> <a href="phone:'+e.supplier.phone+'">'+ e.supplier.phone +'</a>' + ' |  <b>Email :</b> <a href="mailto:'+e.supplier.email+'">'+ e.supplier.email +'</a>';
                  $(desc).append(phone);

                li.onclick = function(){
                  var id = this.id.split('_')[1];
                  that.loadObject(id,this);
                }
              
              
              });
          
          });

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