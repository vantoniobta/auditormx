Customers_Form = Core_Customers.extend({  

    init : function(){

    },
    run : function(tabcontent,status){

      var container          = document.createElement('div');
      container.id           = 'customer-form-tab';
      container.className    = 'tab-pane '+ status;
      tabcontent.appendChild(container);    

      // inital values
      var that          = this;
      this.view_mode    = typeof(this._data.id) == 'undefined' ? false : true;
      
      // Card container
      var card          = document.createElement('div');    
      card.className    = 'card card-form ';
      container.appendChild(card);

      // Form container
      var form          = document.createElement('form');
      form.id           = 'form-customer';

      if( typeof(this._data) != 'undefined' ){
        form.dataset.id   = this._data.id;   
      }
      
      form.action       = '';
      form.method       = 'post';
      form.setAttribute('autocomplete', 'off');
      card.appendChild(form);

    //------------------------------------------------------
      var cardBody           = document.createElement('div');        
          cardBody.className = 'row card-body ';
          form.appendChild(cardBody);

    //------------------------------------------------------
    var toptools           = document.createElement('fieldset');
        toptools.className = 'form-group';
        cardBody.appendChild(toptools);

      var h2           = document.createElement('h2');
          h2.innerHTML = typeof(this._data) == 'undefined' ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Agregar cliente' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Actualizar datos del cliente ' ;
          h2.className = 'pull-left card-title';
          toptools.appendChild(h2);

      /* Customer ID Hidden
      ------------------------------------------------------ */

      var fgroup = document.createElement('fieldset');
      fgroup.className = 'form-group';
      cardBody.appendChild(fgroup);

      var hiddenid       = document.createElement('input');
      hiddenid.id           = 'customer-id';
      hiddenid.type         = 'hidden'; 
      hiddenid.name         = 'customer[id]'; 
      hiddenid.value        = typeof(this._data.id) == 'undefined' ? 0 : this._data.id;      
      fgroup.appendChild(hiddenid);

       /* Customer Key
      ------------------------------------------------------ */

      var av = typeof(this._data.cve) == 'undefined' ? false : true ; 
      var fgroup = this.addFormGroup(cardBody);
      var label  = this.addLabelForm(fgroup,'Clave de cliente','text-10');
      this.addInput({container:fgroup,prefix:'customer',name:'cve',type:'text',value:this._data.cve,default_value:'Campo requerido',value_type:'text',readonly: av, required: !av });

      /* Owner name
      ------------------------------------------------------ */

      var fgroup = this.addFormGroup(cardBody);
      var label  = this.addLabelForm(fgroup,'Nombre del propietario','text-10');
      this.addInput({container:fgroup,prefix:'customer',name:'owner_name',type:'text',value:this._data.owner_name,default_value:'Campo requerido',value_type:'text',required:true});

       /* Co-owner
      ------------------------------------------------------ */      
      
      var fgroup = this.addFormGroup(cardBody);
      var label  = this.addLabelForm(fgroup,'Nombre del Co-propietario','text-10');
      this.addInput({container:fgroup,prefix:'customer',name:'coowner_name',type:'text',value:this._data.coowner_name,default_value:'Campo requerido',value_type:'text'});

      
      /* Row Group country-state
      ------------------------------------------------------ */      
      var row   = this.addRow(cardBody,'');
     
     /* Country
     ------------------------------------------------------ */      
      var col   = this.addCol(row,'col-md-6');
      var fg    = this.addFormGroup(col);
      var label = this.addLabelForm(fg,'Pais','text-10');    

      var input          = document.createElement('select');
      input.id           = 'customer-country';
      input.className    = 'form-control';
      input.name         = 'customer[country]'; 
      input.value        = typeof(this._data) == 'undefined'  ? '' : this._data.country; 
      fg.appendChild(input);   
      //create options from select
      for( x in that.countrys){         
          that.createOption(input,that.countrys[x].cname,that.countrys[x].ccode);
      }

      $(input).val(typeof(this._data) == 'undefined'  ? '' : this._data.country);


      $(input).selectize();
 
      /* Zip
      ------------------------------------------------------ */      
      var col   = this.addCol(row,'col-md-6');
      var fg    = this.addFormGroup(col);
      var label = this.addLabelForm(fg,'Código Póstal','text-10');

     
      this.addInput({container:fg,prefix:'customer',name:'zip',type:'text',value:this._data.zip,default_value:'Campo requerido',value_type:'text',required:true}); 

      that.setGoogleZipApi('customer-zip','customer-country',function(data){
        $('#customer-neighbor').val(data.sublocality_level_1);

        if(data.administrative_area_level_3 != '')
          $('#customer-city').val(data.administrative_area_level_3).attr('readonly',true);

        if(data.state != '')
          $('#customer-state').val(data.state).attr('readonly',true);

         return false;
      });

      /* Street
      ------------------------------------------------------ */
      // var row   = this.addRow(cardBody,'');
      var fg    = this.addFormGroup(cardBody);    
      var label = this.addLabelForm(fg,'Calle y Numero','text-10');
      this.addInput({container:fg,prefix:'customer',name:'street',type:'text',value:this._data.street,default_value:'Campo requerido',value_type:'text',required:true}); 
      
      /* Neighbor
      ------------------------------------------------------ */
     
      var fg    = this.addFormGroup(cardBody);    
      var label = this.addLabelForm(fg,'Colonia','text-10');
      this.addInput({container:fg,prefix:'customer',name:'neighbor',type:'text',value:this._data.neighbor,default_value:'Campo requerido',value_type:'text',required:true}); 

      /* Row Group country-state
      ------------------------------------------------------ */      
      var row   = this.addRow(cardBody,'');

      /* City
      ------------------------------------------------------ */
      
      var col   = this.addCol(row,'col-md-6');
      var fg    = this.addFormGroup(col);      
      var label = this.addLabelForm(fg,'Pais','text-10');  
      this.addInput({container:fg,prefix:'customer',name:'city',type:'text',value:this._data.city,default_value:'Campo requerido',value_type:'text',required:true});  

      /* State
      ------------------------------------------------------ */
      
      var col   = this.addCol(row,'col-md-6');
      var fg    = this.addFormGroup(col);      
      var label = this.addLabelForm(fg,'Estado','text-10');  
      this.addInput({container:fg,prefix:'customer',name:'state',type:'text',value:this._data.state,default_value:'Campo requerido',value_type:'text',required:true});  
   

      /* Group contact phones
      ------------------------------------------------------ */    
      var row   = this.addRow(cardBody,'');

       /* Mobile
      ------------------------------------------------------ */
      
      var col   = this.addCol(row,'col-md-6');
      var fg    = this.addFormGroup(col);      
      var label = this.addLabelForm(fg,'Teléfono Móvil','text-10');  
      this.addInput({container:fg,prefix:'customer',name:'mobile',type:'text',value:this._data.mobile,default_value:'Campo requerido',value_type:'text',required:true});  

      /* Phone
      ------------------------------------------------------ */     

      var col   = this.addCol(row,'col-md-6');
      var fg    = this.addFormGroup(col);      
      var label = this.addLabelForm(fg,'Teléfono Fijo','text-10');  
      this.addInput({container:fg,prefix:'customer',name:'phone',type:'text',value:this._data.phone,default_value:'Campo requerido',value_type:'text'});  

      /* Email
      ------------------------------------------------------ */
     
      var fg    = this.addFormGroup(cardBody);      
      var label = this.addLabelForm(fg,'Email del usuario','text-10');  
      this.addInput({container:fg,prefix:'customer',name:'email',type:'text',value:this._data.email,default_value:'Campo requerido',value_type:'text'});  

      /* Save Button
      ------------------------------------------------------ */

      var row  = this.addRow(cardBody,'');
      var col  = this.addCol(row,'col-md-12');
      var fg    = this.addFormGroup(col,'actions-buttons');

      var button = document.createElement('button');
      button.dataset.id  = typeof(this._data) == 'undefined'  ? 0 : this._data.id;
      button.innerHTML   = '<i class="fa fa-hdd-o" aria-hidden="true"></i> Guardar datos';
      button.className   = 'btn btn-success-outline btn-lg btn-block';
      fg.appendChild(button);

      // disable forms on loading
      this.disableForms('form-customer','input, textarea, button, select',true);
      // show form
      setTimeout(function(){            
        // enable forms
        that.disableForms('form-customer','input, textarea, button, select',false);
        // disable or enable 
        // $("#user-email").attr('readonly', data === false  ? false : true);
        // show card
        card.style.display = 'block';      
        // enable requireds fields
        if( that.ifData(toptools,container) ){ 
         that.registerForm(form.id,function(e,data){
              that.sentForm(data);
         });
        }
      },100);  
    },
    ifData : function(container,workspace){

        var that = this;
        if( typeof(this._data) == 'undefined' ){
          // Delete Button Button
          //------------------------------------------------------
          $('input[type=email]').val('');      
          $('#customer-owner-name').prop('required',true);
          $('#customer-street').prop('required',true);
          $('#customer-neighbor').prop('required',true);
          $('#customer-city').prop('required',true);
          $('#customer-state').prop('required',true);
          $('#customer-country').prop('required',true);
          $('#customer-email').prop('required',true);

        }

    return true;
  },

  sentForm : function(data){
    // local scope
    var that = this;
    // disable form before start process
    this.disableForms('form-customer','input, textarea, button, select',true);
    // send data to server
    this.post('/customers/save',data,function(e,data){
      if(!e){
        switch(data.code){
            case 0:
              // application form response mode in success 
              switch(data.mode){
                  case 'insert':
                    // reset form
                    that.clearWorkSpace(); 
                    // append to collection chooser
                    window.DataChooser.appendThis(data.data);
                  break;
                  case 'update':
                    //update element in collection chooser
                    window.DataChooser.updateThis(data.data);
                  break;
              }
              // display action message to user
              bootbox.alert('Los datos fueron guardados correctamente en el sistema!');
            break;
            case 1:
                // check if raw data is enable
                if( typeof(data.data.raw) != 'undefined'){
                  // case database error for application response
                  switch( data.data.raw.code ){
                    case 11000:
                      bootbox.alert('El email que intenta registrar ya se encuentra en la base de datos!');
                    break;
                    default:
                      bootbox.alert('Unknow error database error');
                    break;
                  }
                }else{
                 // this error alert is when the error is not from database
                 bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
                }             
            break;
            default:
              // this error alert is when server timeout or cant get answer from it
              bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
            break;
        }                
      }else{
          // this error alert is when server timeout or cant get answer from it
          bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
      }

      // all another no documented stuff xD
      window.asound.play();
      that.disableForms('form-customer','input, textarea, button, select',false);
    }); 
  }

});  