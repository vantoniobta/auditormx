Core_Profile = Core.extend({
  run :function(){
  	//load parent
  	this.sounds();

    // this level
    var that = this;
     that.setForm();
  },

  index : function(options){
    // local scoope
    var that     = this;

    // options
    this.options = options;

  	// load object
  	this.run();

    //getData;
    // this.getData();

    //overflow hide
    this.overflow();

    // //set add button
    // $('#btn-new-update').click(function(){
    //     that.setForm();
    // });
  },

  clearWorkSpace : function(){
     var container = document.getElementById('workspace');
         container.innerHTML = '';
         return container;
  },

  setForm : function(data){
    // inital values
    var that      = this;
    var data      = typeof(data) == 'undefined' ? false : data;

   var container  = this.clearWorkSpace();

    var card = document.createElement('div');
    card.className = 'card card-form';
    container.appendChild(card);

    var form          = document.createElement('form');
    form.id           = 'form-user';
    form.dataset.id   = data.id;
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
        h2.innerHTML = data === false ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Datos Personales' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Actualizar usuario' ;
        h2.className = 'pull-left card-title';
        toptools.appendChild(h2);

  //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className = 'form-group';
    cardBody.appendChild(fgroup);

  //------------------------------------------------------
    var hiddenid       = document.createElement('input');
    hiddenid.id           = 'user-id';
    hiddenid.type         = 'hidden';
    hiddenid.name         = 'user[id]';
    hiddenid.value        = this.options.user.id;
    // if( data !== false)
    fgroup.appendChild(hiddenid);

    //------------------------------------------------------
    var hiddenid       = document.createElement('input');
    hiddenid.id           = 'user-tenant';
    hiddenid.type         = 'hidden';
    hiddenid.name         = 'user[tenant]';
    hiddenid.value        = JSON.stringify(this.options.user.tenant);
    // if( data !== false)
    fgroup.appendChild(hiddenid);

    //------------------------------------------------------

    var label          = document.createElement('label');
    label.innerHTML    = 'Nombre del usuario';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'user-name';
    input.className    = 'form-control';
    input.type         = 'text';
    input.name         = 'user[name]';
    // input.placeholder  = 'Nombre del usuario ';
    input.value        = this.options.user.name;
    fgroup.appendChild(input);

  //------------------------------------------------------
   var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group';
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Email del usuario';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'user-email';
    input.className    = 'form-control';
    input.type         = 'text';
    input.name         = 'user[email]';
    input.value        = this.options.user.email;
    fgroup.appendChild(input);

    // Select languaje ------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group';
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Languaje';
    fgroup.appendChild(label);

    var select          = document.createElement('select');
    select.id           = 'user-lang';
    select.type         = 'select';
    select.name         = 'user[lang]';
    select.className    = 'form-control c-select';
    fgroup.appendChild(select);

    var option          = document.createElement('option');
    option.innerHTML    = 'English';
    option.value        = 'en';
    select.appendChild(option);

    var option          = document.createElement('option');
    option.innerHTML    = 'Spanish';
    option.value        = 'es';
    select.appendChild(option);
    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group';
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Asignar password';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'user-password';
    input.className    = 'form-control';
    input.type         = 'password';
    input.name         = 'user[password]';
    input.autocomplete = 'off';
    // input.placeholder  = 'Asignar password';
    fgroup.appendChild(input);

   //------------------------------------------------------
   // var fgroup = document.createElement('fieldset');
   //  fgroup.className   = 'form-group';
   //  cardBody.appendChild(fgroup);

   //  var label          = document.createElement('label');
   //  label.innerHTML    = 'Role';
   //  fgroup.appendChild(label);

   //  var input          = document.createElement('input');
   //  input.id           = 'user-role';
   //  input.className    = 'form-control';
   //  input.type         = 'text';
   //  input.name         = 'user[role]';
   //  // input.placeholder  = 'Nombre del usuario ';
   //  input.value        = this.options.user.role;
   //  fgroup.appendChild(input);

    // Save Buttons
    //------------------------------------------------------
    var button         = document.createElement('button');
    button.dataset.id  = data.id;
    button.className   = 'btn btn-success btn-block';
    button.innerHTML   = '<i class="fa fa-hdd-o" aria-hidden="true"></i> Guardar datos';
    cardBody.appendChild(button);
    // disable forms on loading
    this.disableForms('form-user','input, textarea, button, select',true);
    // show form
    setTimeout(function(){  
      // enable forms
      that.disableForms('form-user','input, textarea, button, select',false);
      // disable or enable
      $("#user-email").attr('readonly', data === false  ? false : true);
      // show card
      card.style.display = 'block';
      // enable requireds fields
      if( that.ifData(data,toptools) ){
       that.registerForm(form.id,function(e,data){
          that.sentForm(data);
       });
      }
    },100);
  },

  ifData : function(data,container){

    var that = this;
    if(data === false){
      // Delete Button Button
      //------------------------------------------------------
      $('input[type=email]').val('');
      $('input[type=password]').val('');
      $('#user-name').prop('required',true);
      $('#user-email').prop('required',true);
      // $('#user-password').prop('required',true);

    }else{
    }
    return true;
  },
  sentForm : function(data){
    // local scopegit 
    var that = this;
    // disable form before start process
    this.disableForms('form-user','input, textarea, button, select',true);
    // send data to server  ->ws.iclicauditor.com
    this.post('http://ws.iclicauditor.com/profile/update',data,function(e,data){
      if(!e){
        switch(data.code){
            case 0:
            
              // display action message to user
              bootbox.alert('Los datos fueron guardados correctamente en el sistema!');
            break;
            case 100:
              // display action message to user
              bootbox.alert('el email no existe!');
            break;
             case 101:
              // display action message to user
              bootbox.alert('El email ya se encuentra registrado con otro usuario!');
            break;
               case 102:
              // display action message to user
              bootbox.alert('Error al actualizar auditor Master!');
            break;
              case 103:
              // display action message to user
              bootbox.alert('Error al actualizar en Tenant!');
            break;
        }
      }else{
          // this error alert is when server timeout or cant get answer from it
          bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
      }

      // all another no documented stuff xD
      window.asound.play();
      that.disableForms('form-user','input, textarea, button, select',false);
     // $("#user-email").attr('readonly', data === false  ? false : true);
      $("#user-password").val('');

    });
  }

});
