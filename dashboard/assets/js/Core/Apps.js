Core_Apps = Core.extend({


  run :function(){
    //load parent
    this.sounds();

    // this level
    var that = this;

    // alert('apps running');
  },

  index : function(options){
    //options
    this.options = options;

    //local scoope
    var that  = this;

    //load object
    this.run();

    //set addNewAppButton
    this.addNewAppButton();

    //getData;
    this.getData();

    //overflow hide
    this.overflow();

  },

  addNewAppButton: function(){
    var that = this;
    $('.sidepanel .panel-body').attr('id','sidepanel-body');

    var row = document.createElement('div');
        row.className = 'row';
        document.getElementById('sidepanel-body').appendChild(row);

    var col = document.createElement('div');
        col.id = 'extra-tools-users-container';
        col.className = 'col-md-12';
        row.appendChild(col);

    var btn = document.createElement('button');
        btn.className = 'btn btn-success btn-sm pull-right';
        btn.id        = 'btn-new-user';
        btn.innerHTML = '<i class="fa fa-plus-square" aria-hidden="true"></i> Nuevo </button>';
        col.appendChild(btn);

    var line = document.createElement('hr');
        document.getElementById('sidepanel-body').appendChild(line);

    //set add button
    $('#btn-new-user').click(function(){
        $('.zrow').removeClass('active');
        that.createForm(null);
    });
  },

 getData : function(){
    // $('.sidepanel .panel-body').html('');
    var that = this;
    window.DataChooser = $('.sidepanel .panel-body').DataChooser({
        rows:10,
        searchtext:'Buscar un elemento',
        source:'http://ws.iclicauditor.com/apps/all',
        params:{tenant:that.options.tenant},
        prepend:true,
        primary:'_id',
        template: ' <div class="row-{{role}}"> <div class="pull-left"> <div class="subtext ">{{email}}</div> </div>  <div class="clear fix"></div> </div>',
        onClick:function(data){
          that.createForm(data);
          //{{name}} <br/>
          //<div class="label label-{{role}} pull-right type-user">{{}}</div>
        },
        onRow: function(){

        },
    });
  },

  clearWorkSpace : function(){
     var container = document.getElementById('workspace');
         container.innerHTML = '';
         return container;
  },

  createForm : function(data){
    // inital values
    var that      = this;
    var data      = data === null ? false : data;

    // clear the container and get the container div object
    var container  = this.clearWorkSpace();

    // form container div
    var card = document.createElement('div');
    card.className    = 'card card-form card-form-user';
    container.appendChild(card);

    // the form element
    var form          = document.createElement('form');
    form.id           = 'form-user';
    form.dataset.id   = data.id;
    form.action       = '';
    form.method       = 'post';
    form.setAttribute('autocomplete', 'off');
    card.appendChild(form);

    // the card body container
    //------------------------------------------------------
    var cardBody           = document.createElement('div');
    cardBody.className     = 'row card-body ';
    form.appendChild(cardBody);

    //------------------------------------------------------
    var hiddenstatus       = document.createElement('input');
    hiddenstatus.id        = 'app-status';
    hiddenstatus.type      = 'hidden';
    hiddenstatus.name      = 'app[status]';
    hiddenstatus.value     = data === false ? '' : data.status;
    cardBody.appendChild(hiddenstatus);

    //------------------------------------------------------
    var hiddenid          = document.createElement('input');
    hiddenid.id           = 'app-id';
    hiddenid.type         = 'hidden';
    hiddenid.name         = 'app[id]';
    hiddenid.value        = data === false ? '' : data.id;
    // if( data !== false)
    cardBody.appendChild(hiddenid);

    //-----------------------------------------------------

    var hiddentenant       = document.createElement('input');
    hiddentenant.id        = 'app-tenant';
    hiddentenant.type      = 'hidden';
    hiddentenant.name      = 'app[tenant]';
    hiddentenant.value     =  this.options.tenant;
    cardBody.appendChild(hiddentenant);

  //------------------------------------------------------
    var toptools           = document.createElement('fieldset');
    toptools.className     = 'form-group';
    cardBody.appendChild(toptools);

    var h2                  = document.createElement('h2');
    h2.innerHTML            = data === false ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Agregar App' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Actualizar app' ;
    h2.className            = 'pull-left card-title';
    toptools.appendChild(h2);

    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group form-group-status ' + (data == false ? 'hide':'');
    cardBody.appendChild(fgroup);

    var div          = document.createElement('div');
    div.id           = 'app-status_update';
    div.className    = data.status === 0  ? 'alert alert-danger' : 'alert alert-info';
    div.readOnly     = true;
    div.innerHTML    = data.status === 0  ? '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i>&nbsp; App Inactiva' : '<i class="fa fa-info-circle fa-lg" aria-hidden="true"></i>&nbsp; App Activa';
    fgroup.appendChild(div);

    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group form-group-token ' + (data == false ? 'hide':'');
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Token';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'app-token';
    input.className    = 'form-control';
    input.type         = 'token';
    input.name         = 'app[token]';
    input.readOnly     = true;
    input.value        = data === false  ? '' : data.token;
    fgroup.appendChild(input);


    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className = 'form-group';
    cardBody.appendChild(fgroup);

    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group form-group-name';
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Nombre';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'app-name';
    input.className    = 'form-control';
    input.type         = 'name';
    input.name         = 'app[name]';
    // input.placeholder  = 'User email';
    input.value        = data === false  ? '' : data.name;
    fgroup.appendChild(input);


    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group form-group-email';
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Email';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'app-email';
    input.className    = 'form-control';
    input.type         = 'email';
    input.name         = 'app[email]';
    // input.placeholder  = 'User email';
    input.value        = data === false  ? '' : data.email;
    fgroup.appendChild(input);


    // Save Button
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
      // $("#app-email").attr('readonly', data === false  ? false : true);
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
      $('#app-name').prop('required',true);
      $('#app-email').prop('required',true);

    }else{
      // Delete Button Button
      //------------------------------------------------------
      var button          = document.createElement('button');
      button.type         = 'button';
      button.className    = 'btn btn btn-danger-outline pull-right';
      button.innerHTML    = '<i class="fa fa-trash-o" aria-hidden="true"></i> Eliminar';
      button.dataset.id       = data._id;
      button.dataset.tenant   =  this.options.tenant;
      container.appendChild(button);

      // delete action
      button.onclick = function(){
          var id     = this.dataset.id;
          var tenant = this.dataset.tenant;
          // console.log(id,tenant);
          bootbox.confirm('¿Deseas eliminar este registro?, los cambios serán permanentes!',function(result){
            if (result ) {
              that.post('http://ws.iclicauditor.com/apps/delete',{id:id,tenant:tenant},function(e,data){
                console.log(e);
                switch(data.code){
                  case 0:
                    that.clearWorkSpace();
                    bootbox.alert('El registro fue eliminado correctamente!');
                    window.DataChooser.deleteThis(id);
                  break;
                  case 1:
                    bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
                  break;
                }
                window.asound.play();
              });
            }
          });
      }

    }
    return true;
  },function (req, res) {
     res.view();
  },

  sentForm : function(data){
    // local scope
    var that = this;

    var mode  = $('#app-id').val() == '' ? 'add' : 'update';
    // disable form before start process
    this.disableForms('form-user','input, textarea, button, select',true);
    //send data
    this.post('http://ws.iclicauditor.com/apps/save',data,function(e,data){
      if(!e){
        switch(data.code){
            case 0:
              // application form response mode in success
              switch(mode){
                  case 'add':
                    // reset form
                    that.clearWorkSpace();
                    // append to collection chooser
                    window.DataChooser.appendThis(data.data[0]);
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
                // // check if raw data is enable
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
            case 101:

                // this error alert is when the error is not from database
                bootbox.alert('Ups!, Ya existe un usuario creado con este email');

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
      that.disableForms('form-user','input, textarea, button, select',false);
      //$("#app-email").attr('readonly', data === false  ? false : true);

    });

  }

});
