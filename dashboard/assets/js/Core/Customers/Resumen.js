 Customers_Resumen = Core_Customers.extend({  
  init : function(){

  },
  run : function(tabcontent,status){

    var that               = this;
    var container          = document.createElement('div');
    container.id           = 'customer-resumen-tab';             
    container.className    = 'tab-pane ' + status;
    container.setAttribute('role','tabpanel');
    tabcontent.appendChild(container);    

    this.post('/customers/get',this._data,function(e,data){

      var data           = data.data;
      var card           = document.createElement('div');      
      card.className     = 'card card-resumen ';
      card.style.display = 'block';
      container.appendChild(card);

        /* card-body
        ------------------------------------------------------ */
        var cardBody           = document.createElement('div');
            cardBody.className = 'row card-body ';
            card.appendChild(cardBody);

        that._cardBody = cardBody;
        
        /* General info 
        ------------------------------------------------------ */
        that.setGeneralInfo(data,cardBody);

      if( that.gotMembership(data) ){

        
        /* the debts table
        ------------------------------------------------------ */
        that.addSeparator(cardBody);
        that.tableDebts(cardBody);
        
        /* the payments table
        ------------------------------------------------------ */
        // that.addSeparator(cardBody);
        that.tablePayments(cardBody);


      }else{
        // that.noMemberShipSegment();
      }
     
    });
  },

  noMemberShipSegment : function(){

      /* new row
      -------------------------------------------------- */
      var row = this.addRow(this._cardBody);
      var col           = document.createElement('div');
          col.className = ' col-md-12 ';        
          row.appendChild(col);

      var div           = document.createElement('div');
          div.className = 'no-membership';
          div.innerHTML = 'Este cliente no tiene una membresía asignada <a id="btn-create-membership" class="btn btn-danger" role="tab"> Crear membresía </a>';
          col.appendChild(div);


        $('#btn-create-membership').click(function(){
          $('#myTab a[href="#customer-membership-tab"]').tab('show');
        });

  },
  gotMembership : function(data){

    // console.log('ID: ',data.membership_id);

    return data.membership_id != '' ? true : false;
  },

  setGeneralInfo : function(data,cardBody){

      //local scoope
      var that = this;
      var data = data;
      for(x in data ){
        data[x] = data[x] === null ? '' : data[x];
      }

      /* new row
      -------------------------------------------------- */
      var row = that.addRow(cardBody);

      var col           = document.createElement('div');
          col.className = ' col-md-12 ';
          row.appendChild(col);

      var h2           = document.createElement('h2');
          h2.innerHTML = data.owner_name ;
          h2.className = 'card-title';
          col.appendChild(h2);

      //print button
      this.setDeleteButton(data,col);

      /* new row
      -------------------------------------------------- */
      var row = that.addRow(cardBody);

      /* col-md-6
      -------------------------------------------------- */
      var col           = document.createElement('div');
          col.className = ' col-md-12 ';
          row.appendChild(col);

      var segment           = document.createElement('div');
          segment.innerHTML = '<strong>Clave.</strong> '+ data.cve ;
          segment.className = 'card-segment';
          col.appendChild(segment);

      var segment           = document.createElement('div');
          segment.innerHTML = '<strong>Contrato:</strong> '+ data.uuid ;
          segment.className = 'pull-left card-segment';
          col.appendChild(segment);    

      var segment           = document.createElement('div');
          segment.innerHTML = '<strong>Móvil:</strong> '+ data.mobile  ;
          segment.className = ' card-segment';
          col.appendChild(segment);  

      var segment           = document.createElement('div');
          segment.innerHTML = '<strong>Dirección:</strong> '+ data.address ;
          segment.className = 'card-segment';
          col.appendChild(segment);

      // /* col-md-6
      // -------------------------------------------------- */
      // var col           = document.createElement('div');
      //     col.className = ' col-md-4 ';
      //     row.appendChild(col);

      // var segment           = document.createElement('div');
      //     segment.innerHTML = '<div class="left-payment-label">Total por cobrar</div> <div class="left-payment-total">$0.00</div>' ;
      //     segment.className = 'pull-left card-segment';
      //     col.appendChild(segment);

      this.clearFix(row);
  },

  setDataSegment : function(data,cardBody){

    var row           = this.addRow(cardBody,'segments-container');

    var col           = document.createElement('div');         
        col.className = ' col-md-4 ';
        row.appendChild(col);

    this.createCardElement(col,'Facturas vencidas',0);

    var col           = document.createElement('div');
        col.className = ' col-md-4 ';
        row.appendChild(col);

    this.createCardElement(col,'Facturas no vencidas',0);

    var col           = document.createElement('div');
        col.className = ' col-md-4 ';
        row.appendChild(col);

    this.createCardElement(col,'Antigüedad',0);

  },
   tablePayments : function(cardBody){
    var that  = this;
    var ndate = new Date();

    // new row
    var row = this.addRow(cardBody,'table-payments-container');   

    // the invoice table
    var segment       = document.createElement('div');
        segment.id        = 'theTable';
        segment.className = 'col-md-12';
        row.appendChild(segment);  

     var h3           = document.createElement('h3');
        h3.innerHTML = 'Historial de Pagos';
        segment.appendChild(h3);  

   var headers = {
        "uuid" :{name:'Folio',width:'100px', label:'danger',value:function(i,o){ 
              var value           = o.uuid.toUpperCase();
              var uuid            = o.uuid;
              var comment         = o.comment;
              var comment_cancel  = o.comment_cancel;
              var token_cancel    = o.token_cancel;
              var created         = o.createdAt;
              return '<span class="label label-danger inspect-item" data-uuid="'+uuid+'" data-created="'+created+'" data-comment="'+comment+'" data-comment-cancel="'+comment_cancel+'" data-token-cancel="'+token_cancel+'"> #'+value+'</span>';
        }},
        "name_creator" :{name:'Operator',width:'100px',align:'left'},
        "name_cancel" :{name:'Cancelado por',width:'100px',align:'left'},
        "amount"       :{name:'Cantidad',width:'100px',type:'money', align:'right'},
        "createdAt"    :{name:'Fecha',align:'center',width:'150px',type:'date'},
        "method"       :{name:'Método de Pago',align:'center',width:'100px'},
        "thestatus"    :{name:'Estatus',width:'50px',  align:'center', value:function(i,o){ 
              var value = o.thestatus.toUpperCase();
              var label = value == 'APLICADO' ? 'label-success' : 'label-danger';
              return '<span class="label '+label+'">'+value+'</span>';
        }}        
      };

      if( this.allow(this.user.role,['admin','root']) ){
        headers["id"] = {name:'Cancelar Pago',align:'center',width:'50px', value : function(i,o){
            if(!o.token_cancel){
            return '<i data-uuid="'+ o.uuid +'" class="fa fa-minus-square remove-item" aria-hidden="true"  data-toggle="tooltip" data-placement="top" title="Eliminar este pago"></i>'
          }else{
            return '';
          }
        }}
      }
   
   window.tablePayments = $('#theTable').Table({
      source   :'/payments/table',
      method   :'GET',
      type     :'table',
      params   : {id:this._data.id},
      tooltips : true,
      rows     : 499,
      sortable :false,
      checkbox :false,
      searcher : true,
      headers  : headers, 
      onLink: function(e){
          console.log(e);
      },
      onCheckBox: function(check){
          // console.log('is checked',check);
      },
      onCheckBoxMain : function(checked){
          // console.log(checked)
      },
      onCompleteRequest:function(){        
        $('#theTable .inspect-item').click(function(){
            bootbox.dialog({              
              message: '<div class="row"> <div class="col-md-12"> ' +
                        '<p> <strong>Comentarios del pago</strong><br>' +
                        $(this).attr('data-comment') +'</p> ' +
                        '<p> <strong>Mótivo por el cual fué cancelado</strong><br>' +
                        $(this).attr('data-comment-cancel') +'</p> ' +
                         '<p> <strong>Folio</strong><br>' +
                        $(this).attr('data-token-cancel') +'</p> ' +
                         '<p> <strong>Fecha</strong><br>' +
                        $(this).attr('data-created') +'</p> ' +
                      '</div></div>',
              title: 'Detalle del pago <span class="green-text">#'+ $(this).attr('data-uuid') +'</span>',
              buttons: {
                success: {
                  label: "Aceptar",
                  className: "btn-default",
                  callback: function() { }
                }
              }
            });
        });

        $('#theTable .remove-item').click(function(){
            //--------------------------
            bootbox.dialog({              
              message: '<div class="row">  ' +
                      '<div class="col-md-12"> ' +
                      '<form > ' +
                      '<div class="form-group"> ' +                      
                      '<div class="col-md-12"> ' +
                      '<label class=" control-label" for="name">Motivo:</label> ' +
                      '<input class="form-control" type="hidden" value="'+ $(this).attr('data-uuid') +'" id="payment-cancel-uuid">' +
                      '<textarea rows="4" class="form-control" id="payment-cancel-comment"></textarea>' + 
                      '<span class="help-block">Escriba la razón para cancelar este registro</span> </div> ' +
                      '</div> ' +
                      '</div> </div>' +
                      '</form> </div>  </div>',
              title: 'Cancelar registro de pago: <span class="green-text">'+ $(this).attr('data-uuid') +'</span>',
              buttons: {
                success: {
                  label: "Aceptar",
                  className: "btn-default",
                  callback: function() { 
                      data         = {};
                      data.uuid    = $('#payment-cancel-uuid').val();
                      data.comment = $('#payment-cancel-comment').val();
                     if( data.comment.length > 0){
                        that.post('/payments/cancel',data,function(e,data){
                            window.asound.play();
                            window.tablePayments.load();
                            return true;
                        });
                     }else{
                        alert('Porfavor escriba la razón para cancelar este pago!');
                        return false;
                     }                     
                  }
                },
                danger: {
                  label: "Cancelar",
                  className: "btn-danger",
                  callback: function() {
                    console.log('shits happens!');
                  }
                }
              }
            });
            //-----------------------
        });          
      }
    });
   },   
  tableDebts : function(cardBody){

     // new row
    var row = this.addRow(cardBody,'table-debts-container');

    // the invoice table
    var segment           = document.createElement('div');
        segment.id        = 'theTableDebts';
        segment.className = 'col-md-12';
        row.appendChild(segment);  

    var h3           = document.createElement('h3');
        h3.innerHTML = 'Periodos atrasados';
        segment.appendChild(h3);  


    var headers = { 
      'number'    :{name:'Periodo',width:'50px',type:'text', align:'center'},
      'date'      :{name:'Fecha',width:'50px',type:'date', align:'left', label:'primary'},
      'balance'   :{name:'Saldo',width:'30px',type:'money', align:'center' },
      'amount'    :{name:'Mensualidad',width:'50px',type:'money', align:'right', value:function(i,o){
          return o.amount + o.payment_cost;
      }},
      'difference'        :{name:'Pendiente',width:'50px',type:'money', align:'right'},
      'payment_done'      :{name:'Pagado',width:'100px',type:'text', align:'right', value:function(i,o){
        return o.payment_done == null ? '0.00' : o.payment_done;
      }},
      'monthly_interest'    :{name:'Interés',width:'50px',type:'text', align:'right'},
      'capital'             :{name:'Capital',width:'50px',type:'text', align:'right'},
      'balance_diference'   :{name:'Saldo',width:'50px',type:'money', align:'right'},
      'interest'            :{name:'Int. acumulado',width:'50px',type:'money', align:'right'},
      'status'              :{name:'Estatus',width:'50px',  align:'center', value:function(i,o){
              var value = o.status;
              var classes = value == 1 ? 'label-success' : 'label-default';
              var label   = value == 1 ? 'Pagado' : 'Por pagar';

              if( value == 0 && o.current_date > o.date){
                var classes = 'label-danger';
                var label   = 'Atrasado'; 
              }

              return '<span class="label '+classes+'">'+label+'</span>';
        }}        
      };

    window.tableDebts = $('#theTableDebts').Table({
      source   :'/amortization/debts',
      method   :'GET',
      type     :'table',
      params   :{membership_id:this._data.membership_id},
      tooltips :true,
      rows     :10,
      sortable :false,
      checkbox :false,
      searcher :true,
      headers  : headers, 
      onLink: function(e){
          console.log(e);
      },
      onCheckBox: function(check){
          // console.log('is checked',check);
      },
      onCheckBoxMain : function(checked){
          // console.log(checked)
      },
      onCompleteRequest:function(){        
       
      }
    });
  },
   setDeleteButton : function(data,container){

    // that 
    var that            = this;

    /* Delete Button Button
    --------------------------------------------------------------- */
    var button          = document.createElement('button');
    button.type         = 'button'; 
    button.className    = 'btn btn-danger-outline pull-right btn-tools-customer';
    button.innerHTML    = '<i class="fa fa-trash-o" aria-hidden="true"></i> Eliminar';
    button.dataset.id   = data.id;
    container.appendChild(button);
    // delete action 
    button.onclick = function(){
      var id = this.dataset.id;
      bootbox.confirm('¿Deseas eliminar este registro?, los cambios serán permanentes!',function(result){
        if (result ) {
          that.post('/customers/delete',{id:id},function(e,data){
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
});