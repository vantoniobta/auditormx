App_Art = App.extend({  
    artVersion : 0,
    init : function(){    
      this.panels();     
    },
    /* init
    ------------------------------ */
    run : function(id){
       //this.setup();
       var that = this;
       that.reset();
       that.getForm(function(){
            that.setForm();
            that.setCalendar();
       });
       that.loadPanel();
       
       $('#addNew').click(function(){
            that.reset();
            that.getForm(function(){
                that.setForm();
                that.setCalendar();
            });
       });
    },
    /*@Reset
    -----------------------*/
    reset : function(){
        window.theForm = {
        status: 'create',
        _id: null
      }
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
      $('.date').datepicker({
            language : 'es',
            autoclose : true
        });     
    },
    /*@loadPanel
    -----------------------------*/
    loadPanel : function(){
      var that = this;
      $('#artsListContainer').panel({
            rows: 10,            
            rheight : '100px',
            navigation : '#mainFooter',
            searcher:'#findSuppliers',
            source : '/v1/art/all',
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
                title.innerHTML = e.name;
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
                small.innerHTML = '';
                $(div).append(small);

              //var spanDate = document.createElement('span');
              //
              //var tdate = new Date(e.created);
              //    month = new String( tdate.getMonth( ) +1 );            
              //    month = month.length == 1 ? '0'+ month : month;
              //
              //  spanDate.className = 'date';
              //  spanDate.innerHTML = tdate.getDate() +'-'+month+'-'+tdate.getFullYear() ;
              //  $(small).append(spanDate);
              //
              //var spanLabels = document.createElement('span');
              //  spanLabels.className = 'labels';
              //  $(small).append(spanLabels);

              //var status = document.createElement('span');  
              //  status.className = 'label label-success';
              //  status.innerHTML = 'activo';
              //  $(spanLabels).append(status);             
            },
            onClickRow : function(item){
                //this id
                var id = item.id.split('_')[1];
                  //this get form
                  that.getForm(function(){
                  that.setForm();
                  that.loadObject(id,function(){
                      //set delete supplier function
                      //$('#delete_supplier').show();
                      //$('#delete_supplier').click(function(){
                      //    that.delete();          
                      //});  
                  });
                });
            }
          });

    },
  
    loadObject : function(id,obj){

        var that = this;
        
        $.ajax({
            type: "POST",
            url: "/v1/art/load",
            dataType : 'JSON',
            data: {_id : id},
            success: function( response ){            
                window.theForm._id    = id;
                window.theForm.status = 'update';
                $('#name_art').val(response.art.name);
                var tdate = new Date(response.art.from)
                var month = new String( tdate.getMonth( ) +1 );            
                month = month.length == 1 ? '0'+ month : month;
                var dateFrom = tdate.getDate() + '-' + month + '-' + tdate.getFullYear() ;
                
                tdate = new Date(response.art.to)
                month = new String( tdate.getMonth( ) +1 );            
                month = month.length == 1 ? '0'+ month : month;
                var dateTo = tdate.getDate() + '-' + month + '-' + tdate.getFullYear() ;
                
                $('#date_start').val(dateFrom);
                $('#date_finish').val(dateTo);
                if (response.art.versions.length) {
                    var limit = response.art.versions.length  - 1;
                    for (var x = 0; x < limit; x++) {
                        that.addVersion();
                    }
                }
                $('.version').each(function(i, input){
                    $(input).val(response.art.versions[i]);
                });
                //$.each(response.art.versions, function(i, version){
                //    
                //});
                
                that.setCalendar();
          }
        });

    },
    
    setForm : function(){
        var that = this;
        
        $("#newArt").submit(function(){
            that.insertData();
            $.ajax({
                url : '/v1/art/save',
                type: 'POST',
                dataType : 'JSON',
                data : $(this).serialize(),
                success : function(data){
                    that.isLogged(data, function(){
                        if (data.code == 0) {
                            console.log(data)
                            bootbox.alert(data.msg);
                            that.loadPanel();
                            that.getForm();
                        }
                    });
                }
            });
            return false;
        });
        $('#add-art').click(function(){
            that.addVersion();
        })
    },
    
    getForm : function(callback){
        var that = this;
        that.artVersion = 0;
        $.ajax({
            url : '/v1/art/form',
            type: 'GET',
            success : function(response){
                $('#artForm').html(response);
                callback.call();
            }
        })
    },
    
    addVersion : function(){
        var that = this;
        var container = $('#versions');
        
        var divGroup = document.createElement('div');
        divGroup.className = 'control-group';
        divGroup.id = 'version-'+ that.artVersion;
            var divControl = document.createElement('div');
            divControl.className = 'controls input-append';
        $(divGroup).append(divControl);
                var inputControl = document.createElement('input');
                inputControl.name = 'versions[]';
                inputControl.className = 'span11 version';
                inputControl.setAttribute('placeholder','Version');
                inputControl.setAttribute('required','required');
                inputControl.type = 'text';
                
                var deleteVersion = document.createElement('button');
                deleteVersion.id = 'version-'+ that.artVersion;
                deleteVersion.className = 'btn btn-danger';
                deleteVersion.innerHTML = '<i class="icon-remove"></i>';
                deleteVersion.type = 'button';
                deleteVersion.onclick = function(){
                    $('#'+this.id).remove();
                }
            $(divControl).append(inputControl).append(deleteVersion);
            
        $(container).append(divGroup);
    },
    
    loadSelect : function(select, data){
        for (x in data.data) {
            if (data.data[x].versions.length > 1) {
                var optionGroup = document.createElement('optgroup');
                optionGroup.label = data.data[x].name;
                for (y in data.data[x].versions) {
                    //console.log(data.data[x].versions[y]);
                    var itemOption = document.createElement('option');
                    itemOption.value = data.data[x]._id;
                    itemOption.innerHTML = data.data[x].versions[y];
                    $(optionGroup).append(itemOption);
                }
                $(select).append(optionGroup);
            }else{
                var optionGroup = document.createElement('optgroup');
                optionGroup.label = data.data[x].name;
                
                var itemOption = document.createElement('option');
                itemOption.value = data.data[x]._id;
                itemOption.innerHTML = data.data[x].versions[0];
                $(optionGroup).append(itemOption);
                $(select).append(optionGroup);
            }
        }
    },
  /*@insertData
  ---------------------------------------*/
  insertData : function(){
      $('input[name="_id"]').remove();
      var id = document.createElement('input');
        id.name  = '_id';
        id.type  = 'hidden';
        id.value = window.theForm._id
        $('#newArt').append(id);
        $('input[name="status"]').remove();
        var status   = document.createElement('input');
        status.name  = 'status';
        status.type  = 'hidden';
        status.value = window.theForm.status
        $('#newArt').append(status);
        // $('#formTitle').html( response.data.name );
  }
   
});