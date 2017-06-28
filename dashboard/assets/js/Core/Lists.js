Core_Lists = Core.extend({


  run :function(){
  	//load parent
  	this.sounds();

    // this level
    var that = this;

    that.frm_table();


  },

  index : function(options){
    // options
    this.options = options;

    // local scoope
    var that     = this;

  	// load object
  	this.run();

    //set addNewUserButton
    this.addNewUserButton();

    //getData;
    this.getData();

    //overflow hide
    this.overflow();
  },

addNewUserButton: function(){
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
        btn.id        = 'btn-new-lists';
        btn.innerHTML = '<i class="fa fa-plus-square" aria-hidden="true"></i> Nuevo </button>';
        col.appendChild(btn);

    var line = document.createElement('hr');
        document.getElementById('sidepanel-body').appendChild(line);

    //set add button
    $('#btn-new-lists').click(function(){
        that.setForm(null);

    });
},

getData : function(){
    var that = this;
    window.DataChooser = $('.sidepanel .panel-body').DataChooser({
        rows:10,
        searchtext:'Buscar un elemento',
        source:'http://ws.iclicauditor.com/lists/all',
        params:{tenant:that.options.tenant},
        prepend:true,
        primary:'_id',
        template: ' <div class="row-{{role}}"> <div class="pull-left"> <div class="subtext ">{{name}}</div> </div>  <div class="clear fix"></div> </div>',
        onClick:function(data){
          that.setForm(data);
          // var psp = document.getElementById('mytable');
          // psp.style.display = 'none';
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

  frm_table: function(data){
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

            var cardBody           = document.createElement('div');
                cardBody.className = 'row card-body ';
                form.appendChild(cardBody);

            var toptools           = document.createElement('fieldset');
                toptools.className = 'form-group';
                cardBody.appendChild(toptools);


            var fgroup = document.createElement('fieldset');
                fgroup.className = 'form-group';
                cardBody.appendChild(fgroup);

            var atc = document.createElement('div');
               atc.id  = 'tb_index';
               fgroup.appendChild(atc);


                ///..............pagination...............
                // var nav1       = document.createElement('nav');
                // nav1.id        ='nav1';
                // nav1.style.display  = 'none';
                // fgroup.appendChild(nav1);


                // var ul_p         = document.createElement('ul');
                // ul_p.className   = 'pagination';
                // fgroup.appendChild(ul_p);



                // var li1         = document.createElement('li');
                // li1.className   = 'page-item disabled';
                // fgroup.appendChild(li1);


                // ///.............................................

                // var a1          = document.createElement('a');
                // a1.className    = 'page-link';
                // a1.href         = '#';
                // fgroup.appendChild(a1);


                // var sp1          = document.createElement('span');
                // sp1.innerHTML    ='&laquo;';
                // fgroup.appendChild(sp1);


                // var sp2          = document.createElement('span');
                // sp2.className    = 'sr-only';
                // sp2.innerHTML    ='Previous';
                // fgroup.appendChild(sp2);





                //   var li2         = document.createElement('li');
                //  li2.className   = 'page-item';
                //  fgroup.appendChild(li2);

                //   var a2          = document.createElement('a');
                //   a2.className    = 'page-link';
                //   a2.href         = '#';
                //   a2.innerHTML    = '1';
                //   fgroup.appendChild(a2);



                //   var li3         = document.createElement('li');
                //   li3.className      = 'page-item';
                //   fgroup.appendChild(li3);

                //   var a3          = document.createElement('a');
                //   a3.className    = 'page-link';
                //   a3.href         = '#';
                //   a3.innerHTML    = '2';
                //   fgroup.appendChild(a3);


                //    var li4         = document.createElement('li');
                //    li4.className      = 'page-item';
                //    fgroup.appendChild(li4);

                //   var a4          = document.createElement('a');
                //   a4.className    = 'page-link';
                //   a4.href         = '#';
                //   a4.innerHTML    = '3';
                //   fgroup.appendChild(a4);


                //   var li5         = document.createElement('li');
                //    li5.className  = 'page-item';
                //    fgroup.appendChild(li5);

                //   var a5          = document.createElement('a');
                //   a5.className    = 'page-link';
                //   a5.href         = '#';
                //   a5.innerHTML    = '4';
                //   fgroup.appendChild(a5);


                //   var li6         = document.createElement('li');
                //    li6.className  = 'page-item';
                //    fgroup.appendChild(li6);

                //   var a6          = document.createElement('a');
                //   a6.className    = 'page-link';
                //   a6.href         = '#';
                //   a6.innerHTML    = '5';
                //   fgroup.appendChild(a6);





                //    var li7         = document.createElement('li');
                //    li7.className  = 'page-item';
                //    fgroup.appendChild(li7);

                //   var a7          = document.createElement('a');
                //   a7.className    = 'page-link';
                //   a7.href         = '#';
                //   fgroup.appendChild(a7);

                //    var sp3          = document.createElement('span');
                //    sp3.innerHTML    ='&raquo;';
                //    fgroup.appendChild(sp3);


                //   var sp4          = document.createElement('span');
                //   sp4.className    = 'sr-only';
                //   sp4.innerHTML    ='Next';
                //   fgroup.appendChild(sp4);


                //   $(a7).append(sp3);
                //   $(a7).append(sp4);
                //   $(li7).append(a7);


                //   $(li2).append(a2);
                //   $(li3).append(a3);
                //   $(li4).append(a4);
                //   $(li5).append(a5);
                //   $(li6).append(a6);


                // ///............................................
                //    $(a1).append(sp2);
                //    $(a1).append(sp1);
                //    $(li1).append(a1);
                // ///............................................
                //    $(ul_p).append(li1);
                //    $(ul_p).append(li2);
                //    $(ul_p).append(li3);
                //    $(ul_p).append(li4);
                //    $(ul_p).append(li5);
                //    $(ul_p).append(li6);
                //    $(ul_p).append(li7);



                //    $(nav1).append(ul_p);

                // fgroup.appendChild(nav1);

                ///..............pagination...............

               this.table_index(data);

              this.disableForms('form-user','input, textarea, button, select',true);

              setTimeout(function(){  
                // enable forms
                that.disableForms('form-user','input, textarea, button, select',false);
                // disable or enable
                $("#user-email").attr('readonly', data === false  ? false : true);
                // show card
                card.style.display = 'block';
                // enable requireds fields
                
                 that.registerForm(form.id,function(e,data){
                    //that.sentForm(data);
                 });
              
              },100);

  },
  setForm : function(data){
    // inital value
    var that      = this;
    var data      = data === null ? false : data;

    var container  = this.clearWorkSpace();

    var card = document.createElement('div');
    card.className = 'card card-form card-form-lists';
    container.appendChild(card);

    var form          = document.createElement('form');
    form.id           = 'form-lists';
    form.dataset.id   = data.id;
    form.action       = '';
    form.method       = 'post';
    form.setAttribute('autocomplete', 'off');
    card.appendChild(form);

  //------------------------------------------------------
    var cardBody           = document.createElement('div');
        cardBody.className = 'row card-body ';
        cardBody.id        = 'one'
        form.appendChild(cardBody);

	//------------------------------------------------------
 	this.setRemoveButton(data,cardBody);

  //------------------------------------------------------
    var hiddenid       = document.createElement('input');
    hiddenid.id           = 'lists-id';
    hiddenid.type         = 'hidden';
    hiddenid.name         = 'id';
    hiddenid.value        = data === false ? '' : data._id;
    cardBody.appendChild(hiddenid);

   //------------------------------------------------------
    var hiddenid       = document.createElement('input');
    hiddenid.id           = 'lists-tenant';
    hiddenid.type         = 'hidden';
    hiddenid.name         = 'tenant';
    hiddenid.value        = this.options.tenant;
    cardBody.appendChild(hiddenid);

   //------------------------------------------------------
    var toptools           = document.createElement('fieldset');
    toptools.className = 'form-group';
    cardBody.appendChild(toptools);

    var h2           = document.createElement('h2');
    h2.innerHTML = data === false ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Agregar Lista' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Actualizar lista' ;
    h2.className = 'pull-left card-title';
    toptools.appendChild(h2);
   // //------------------------------------------------------
    // that.table(data.name)
   //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group form-group-token ' + (data == false ? 'hide':'');
    cardBody.appendChild(fgroup);

    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className = 'form-group';
    cardBody.appendChild(fgroup);
    //------------------------------------------------------
    var fgroup = document.createElement('fieldset');
    fgroup.className   = 'form-group form-group-name';
    cardBody.appendChild(fgroup);

    var label          = document.createElement('label');
    label.innerHTML    = 'Name';
    fgroup.appendChild(label);

    var input          = document.createElement('input');
    input.id           = 'lists-name';
    input.className    = 'form-control';
    input.type         = 'text';
    input.name         = 'name';
    // input.placeholder  = 'User email';
    input.value        = data === false  ? '' : data.name;
    fgroup.appendChild(input);

    //---------div block------------------------------

          var cardtwo           = document.createElement('div');
          cardtwo.className = 'row card-body ';
          cardtwo.id        = 'two'
          cardtwo.style.display = 'none';
          form.appendChild(cardtwo);

           this.initnext(cardtwo);


          var tc           = document.createElement('fieldset');
          tc.className     = 'form-group';
          tc.id            = 'tc1'
          cardtwo.appendChild(tc);

          var h2           = document.createElement('h2');
          h2.innerHTML = data === false ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Agregar Lista' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i>...' ;
          h2.id        =  'code';
          h2.className = 'pull-left card-title';
          tc.appendChild(h2);
          // //------------------------------------------------------
          var fgroup = document.createElement('fieldset');
          fgroup.className   = 'form-group form-group-name';
          cardtwo.appendChild(fgroup);

          var fgroup = document.createElement('fieldset');
          fgroup.className   = 'form-group form-group-name';
          cardtwo.appendChild(fgroup);

                  //..................ul........................
                  var o_ul         = document.createElement('ul');
                  o_ul.id          = 'o_ul';
                  //o_ul.className   = 'nav nav-pills';
                  o_ul.className   = 'nav nav-tabs';
                  o_ul.role        = 'tablist';
                 //-----------------li----------------------------
                 var o_li           = document.createElement('li');
                  o_li.className     = 'nav-item';
                  
                 var title           = document.createElement('a');
                  title.id           = 'title_one';
                  title.className    = 'nav-link active';
                  title.role         = 'tab';
                  title.dataset.toggle = 'tab';
                  title.href         = '#datos';
                  title.innerHTML    = 'DATOS GENERALES';
                  $(o_li).append(title);
                  o_ul.appendChild(o_li);
                  //-----------------li----------------------------
                 //  var o_li2           = document.createElement('li');
                 //  o_li2.className     = 'nav-item';
                  
                 // var title2           = document.createElement('a');
                 //  title2.id           = 'title_two';
                 //  title2.className    = 'nav-link';
                 //  title2.role          = 'tab';
                 //  title2.dataset.toggle = 'tab';
                 //  title2.href         = '#tabla';
                 //  title2.innerHTML    = 'TABLA DE ESTATUS';


                 //  $(o_li2).append(title2);
                 //  o_ul.appendChild(o_li2);
                  //-----------------li----------------------------
                 //  var o_li3          = document.createElement('li');
                 //  o_li3.className     = 'nav-item';
                  
                 // var title3             = document.createElement('a');
                 //  title3.id             = 'title_tree';
                 //  title3.className      = 'nav-link';
                 //  title3.role           = 'tab';
                 //  title3.dataset.toggle = 'tab';
                 //  title3.href           = '#fotos';
                 //  title3.innerHTML      = 'FOTOS';
                 //  $(o_li3).append(title3);
                 //  o_ul.appendChild(o_li3);
                   //-----------------li----------------------------
                  fgroup.appendChild(o_ul);
                  //..................ul............................
                   //----------------------div tab general---------------------------
                   var div_1           = document.createElement('div');
                   div_1.className     =  'tab-content';
                   div_1.id            = 'div_1';
                   
                   //--------------------tab1--------------------------------
                   var dc          = document.createElement('div');
                   // dc.className    =  'tab-pane active';
                   dc.className    =  'col-md-6';
                   dc.id           =  'datos';
                   dc.role         = 'tabpanel';
                   dc.innerHTML    = '<br>';


                   var dir         = document.createElement('label');
                      dir.innerHTML    = 'Dirección';
                      $(dc).append(dir);
                      fgroup.appendChild(dc);

                      var direc          = document.createElement('input');
                      direc.id           = 'dir_';
                      direc.className    = 'form-control';
                      direc.readOnly     = true;
                      $(dc).append(direc);
                      fgroup.appendChild(dc);


                      var toptools           = document.createElement('fieldset');
                        toptools.className = 'form-group';
                        cardBody.appendChild(toptools);

                      var es         = document.createElement('label');
                      es.innerHTML    = 'Estado';
                      $(dc).append(es);
                      fgroup.appendChild(dc);

                      var txt_e          = document.createElement('input');
                      txt_e.id           = 'txt_e';
                      txt_e.className    = 'form-control';
                      txt_e.readOnly     = true;
                      $(dc).append(txt_e);
                      fgroup.appendChild(dc);



                      var city         = document.createElement('label');
                      city.innerHTML    = 'Ciudad';
                      $(dc).append(city);
                      fgroup.appendChild(dc);

                      var txt_city          = document.createElement('input');
                      txt_city.id           = 'txt_city';
                      txt_city.className    = 'form-control';
                      txt_city.readOnly     = true;
                      $(dc).append(txt_city);
                      fgroup.appendChild(dc);


                       //.........mapa...............

                      var br          = document.createElement('br');
                      fgroup.appendChild(br);

                       var map          = document.createElement('div');
                       map.id           =  'map';
                       map.className    = 'hidden';
                       map.style        = 'height: 400px; margin: 10px 0';
                       map.innerHTML    = '<p>map...</p>'
                       //$(dc).append(map);
                       fgroup.appendChild(map);

                   //--------------------tab2--------------------------------
                     var dc1             = document.createElement('div');
                     dc1.className       =  'tab-pane';
                     dc1.id              =  'tabla';
                     dc1.style.display   = 'none';
                     dc1.role            = 'tabpanel';
                     dc1.innerHTML       = '<br><br><br>';


                     var br          = document.createElement('br');
                        fgroup.appendChild(br);
                     var br          = document.createElement('br');
                        fgroup.appendChild(br);
                     var br          = document.createElement('br');
                        fgroup.appendChild(br);

                  //................for table...
                      var table_b           = document.createElement("table");
                       table_b.id           = 'table_b';
                       table_b.className    = 'table';


                        var thead           = document.createElement("thead");
                           thead.className  = 'thead-default';
                        $(table_b).append(thead);


                        var th        = document.createElement("th");
                        th.innerHTML  = 'FOLIO';
                        $(thead).append(th);

                        var th2        = document.createElement("th");
                        th2.innerHTML  = 'ESTATUS';
                        $(thead).append(th2);

                        var th3        = document.createElement("th");
                        th3.innerHTML  = 'CREADO POR:';
                        $(thead).append(th3);



                        var tbody         = document.createElement("tbody");
                         $(table_b).append(tbody);
                         var tr            = document.createElement("tr");
                             // tr.className  = 'table-success';
                         $(table_b).append(tr);


                         var th_e             = document.createElement("th");
                             th_e.id          = 'th_e';
                             //th_e.innerHTML   = '<a href="#" class="btn btn-info editButton"  data-toggle="modal" data-target="#basicModal">'+529440+'</a>';
                             //th_e.innerHTML  = '<a data-target="#myModal" >'+529440+'</a>';
                             $(table_b).append(th_e);

                        var th_e1        = document.createElement("th");
                            th_e1.id     = 'th_e1';
                            $(table_b).append(th_e1);

                        var th_e2        = document.createElement("th");
                            th_e2.id     = 'th_e2';
                               // th_e2.innerHTML  = 'Valentin Antonio';
                              $(table_b).append(th_e2);

                             //$(dc1).append(table_b);
                             fgroup.appendChild(table_b);
                            // fgroup.appendChild(dc1);

                            //...............modal..............
                               var modal                = document.createElement('div');
                               modal.className       = 'modal fade'
                               modal.id              =  'basicModal';
                               modal.role            =  'dialog';
                               // modal.aria-hidden     = 'basicModal';
                               // modal.aria-hidden     = 'true';


                                var modal_dia            = document.createElement('div');
                                modal_dia.className      = 'modal-dialog';
                                modal_dia.style          = 'height:1200px'

                                var modal_cont           = document.createElement('div');
                                modal_cont.className     = 'modal-content';
                                modal_cont.style          = 'width:1400px; left:-200px; top:50px;';

                                 var modal_hea           = document.createElement('div');
                                 modal_hea.className     = 'modal-header';

  
                                 var btn                 = document.createElement('button');
                                 btn.type                = 'button';
                                 btn.className           = 'close';
                                 $(modal_hea).append(btn);


                                 var tit_                = document.createElement('h4');
                                 tit_.className          = 'modal-title';
                                 tit_.id                 = 'myModalLabel';
                                 tit_.innerHTML          = 'Fotos';
                                 $(modal_hea).append(tit_);


                                 var modal_body          = document.createElement('div');
                                 modal_body.className    = 'modal-body';
                                 modal_body.style        = 'height:1020px'

                                 var oImg        = document.createElement('img');
                                 oImg.src        = 'https://elrincondelohumano.files.wordpress.com/2012/02/coyote.jpg';
                                 oImg.className  = 'img-thumbnail';
                                 oImg.style      = 'width:650px; height:500px;';
                                 oImg.alt        = 'Cinque Terre';
                                 oImg.id         = 'oImg';


                                  var oImg2        = document.createElement('img');
                                 oImg2.src         = 'https://elrincondelohumano.files.wordpress.com/2012/02/coyote.jpg';
                                 oImg2.className   = 'img-thumbnail';
                                 oImg2.style       = 'width:650px; height:500px;';
                                 oImg2.alt         = 'Cinque Terre';
                                 oImg2.id          = 'oImg';

                                 var oImg3        = document.createElement('img');
                                 oImg3.src         = 'https://elrincondelohumano.files.wordpress.com/2012/02/coyote.jpg';
                                 oImg3.className   = 'img-thumbnail';
                                 oImg3.style       = 'width:650px; height:500px;';
                                 oImg3.alt         = 'Cinque Terre';
                                 oImg3.id          = 'oImg';

 
                                $(modal_body).append(oImg,oImg2,oImg3);
                                 
                                $(modal_cont).append(modal_hea);

                                $(modal_cont).append(modal_body);


                                 var modal_footer          = document.createElement('div');
                                 modal_footer.className    = 'modal-footer';


                                 var btnf                  = document.createElement('a');
                                 btnf.className            = 'btn btn-info-outline btn-rounded waves-effect';
                                 btnf.innerHTML            = 'Cerrar';

                                $(modal_footer).append(btnf);

                                $(modal_cont).append(modal_footer);

                                $(modal_dia).append(modal_cont);
                                $(modal).append(modal_dia);
                               fgroup.appendChild(modal);


                               btnf.onclick = function(){

                                $('#basicModal').modal('hide');
                                
                                 // var bx     = document.getElementById('basicModal');
                                 //     bx.style.display = 'none';
                               }

                            //...............modal..............




                   //--------------------tab2--------------------------------

                   //--------------------tab3--------------------------------
                   var dc2          = document.createElement('div');
                   dc2.className    =  'tab-pane';
                   dc2.id           =  'fotos';
                   dc2.role         = 'tabpanel';
                   fgroup.appendChild(dc2);



                   fgroup.appendChild(div_1);

                  //----------------------div tab general---------------------------


                   o_li.onclick = function(){
                     var n1            = document.getElementById('datos');
                         n1.style.display  = 'block';
                     var tabla            = document.getElementById('tabla');
                         tabla.style.display  = 'none';
                   }
              //---------div block------------------------------

              // Button area
              //------------------------------------------------------
              		var fgroup = document.createElement('fieldset');
              		fgroup.className   = 'form-group';
              		cardBody.appendChild(fgroup);

              		var button         = document.createElement('button');
              		button.dataset.id  = data.id;
              		button.className   = 'btn btn-success pull-left';
              		button.innerHTML   = '<i class="fa fa-hdd-o" aria-hidden="true"></i> Guardar datos';
              		fgroup.appendChild(button);

              		// register form ---------------------------------------------
              		that.registerForm('form-lists',function(e,data){
              		 that.sentForm(data);
              		});


              		if( data ){

              			this.addSeparator(cardBody);

              			//--------------------input file-----------------------------
              			var fgroup 			 	= document.createElement('fieldset');
              			fgroup.className   	= 'form-group form-group-upload-file';
              			cardBody.appendChild(fgroup);

              			var tableTitle 		= document.createElement('h3');
              			tableTitle.className = 'card-title';
              			tableTitle.innerHTML = 'Archivos relacionados';
              			fgroup.appendChild(tableTitle);

              			var divfgroup 			= document.createElement('div');
              			divfgroup.className  = 'fileUpload btn btn-danger-outline btn-sm';
              			fgroup.appendChild(divfgroup);

              			var divfgroupLabel = document.createElement('span');
              			divfgroupLabel.innerHTML = '<i class="fa fa-upload" aria-hidden="true"></i> Subir Archivo';
              			divfgroup.appendChild(divfgroupLabel);

              			var input          = document.createElement('input');
              			input.id           = 'lists-file';
              			input.className    = 'upload';
              			input.type         = 'file';
              			input.name         = 'filedoc';
              			input.value        = ''
              			input.accept		 = ".xls,.xlsx"
              			divfgroup.appendChild(input);

              			//-------------------------------------------------------

              			var progressNum 			  = document.createElement('div');
              			progressNum.id  			  = 'progressNum';
              			fgroup.appendChild(progressNum);

              			var progressBar           = document.createElement('div');
              			progressBar.id         	  = 'progressBar';
              			progressBar.className     = 'progresstrip';
              			fgroup.appendChild(progressBar);

              			var progressInner         = document.createElement('div');
              			progressInner.className   = 'progress-inner';
              			progressBar.appendChild(progressInner);

        //---------------div principal--------------------
         //  var atc = document.createElement('div');
         // atc.id  = 'tb_index';
         // fgroup.appendChild(atc);

			//---------------div table--------------------------

			   var atc = document.createElement('div');
			   atc.id  = 'files-table-container';
			   fgroup.appendChild(atc);

			   //---------------div table--------------------------
			   var tableTitle = document.createElement('h3');
         tableTitle.id  = "title-lists"
			   tableTitle.className = 'card-title';
			   tableTitle.innerHTML = 'Sitios relacionados';
			   cardBody.appendChild(tableTitle);

			   var atc = document.createElement('div');
			   atc.id = 'atc-container';
			   cardBody.appendChild(atc);

         // var iter = document.createElement('div');
         // iter.id = 'iter';
         // cardBody.appendChild(iter);

			  // load table --------------------------------------
        //alert(data)


        
        this.tableFiles(data);
        this.tableLocations(data);
        
        // this.table_index(data);

			  //upload form component
			  $('#form-lists').upload({
			    input:'lists-file',
			    source:'http://ws.iclicauditor.com/lists/upload',
          primary:'_id',
			    max: 1,
			    wait:true,
			    onBeforeSend: function(){

			    },
			    onComplete: function(response){
			      $('#lists-file').val('');
             window.tableFiles.load();
             window.tableLocations.load();
			    },
			    onCancel: function(res){
			      alert('No han seleccionado archivos para subirlos')
			    }
			  });
			}
		// show form -------------------------------------------------
		card.style.display = 'block';
  },
  setRemoveButton : function(data,container){

    var that = this;
    if(data !== false){

      //------------------------------------------------------
      var button          = document.createElement('button');
      button.type         = 'button';
      button.className    = 'btn btn btn-danger-outline pull-right';
      button.innerHTML    = '<i class="fa fa-trash-o" aria-hidden="true"></i> Eliminar';
      button.dataset.id   = data._id;
      container.appendChild(button);

      // delete action
      button.onclick = function(){
          var id = this.dataset.id;
          bootbox.confirm('¿Deseas eliminar este registro?, los cambios serán permanentes!',function(result){
              if (result ) {
                that.post('http://ws.iclicauditor.com/lists/remove',{id:id},function(e,data){
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
  },

  initnext : function(container){
    var that = this;
      //------------------------------------------------------
      var btn          = document.createElement('button');
      btn.type         = 'button';
      btn.id           = 'btn_reg';
      btn.className    = 'btn btn btn-danger-outline pull-right';
      btn.innerHTML    = '<i class="fa fa-arrow-left" aria-hidden="true"></i> Regresar';
      btn.dataset.id   = 'data._id';
      container.appendChild(btn);

      btn.onclick = function(){
        document.getElementById('two').style.display='none';
        document.getElementById('one').style.display='block';

         }  
    return true;
  },




  tableLocations:function(data) {
    var that = this;
    var container = document.getElementById('atc-container');
        container.innerHTML = '';
      headers  = {
      'key'         		:{name:'Clave',width:'50px',type:'text', align:'left',label:'label label-link', value:function(i,o){

       return '<span class="label label-primary tc_v" data-id="'+o.key+'">'+o.key+'</span>';
        //return '<span class="label label-primary"><i class="fa fa-exclamation-circle tc_v" aria-hidden="true " data-id="'+o.key+'"></i>'+o.key+'</span>';
       
      }},
      'address'         :{name:'Direccion',width:'50px',type:'text', align:'left'},
      'neigborhud'      :{name:'Calle',width:'30px',type:'text', align:'center'},
      'city'            :{name:'Ciudad',width:'30px',type:'text', align:'center'},
      'state'           :{name:'Estado',width:'30px',type:'text', align:'center' },
      'country'         :{name:'País',width:'50px',type:'text', align:'right'},
      'zip'             :{name:'zip',width:'50px',type:'integer', align:'right'},
      'company'         :{name:'company',width:'50px',type:'integer', align:'center'},
      'tipo'            :{name:'tipo',width:'50px',type:'integer', align:'center'},
      'start_date'      :{name:'start_date',width:'50px',type:'text', align:'center', label:'label label-success'},
      'end_date'        :{name:'end_date',width:'50px',type:'text', align:'center', label:'label label-success'},
      'status'          :{name:'status',width:'50px',type:'integer', align:'center'},
      };
    window.tableLocations = $(container).Table({
      rows     :10,
      source   :'http://ws.iclicauditor.com/lists/table',
      method   :'GET',
      type     :'table',
      params   :{id:data._id,tenant:this.options.tenant},
      tooltips :true,
      sortable :false,
      checkbox :false,
      headers  : headers,
      onLink: function(e){
         //console.log(e);
      },
      onCheckBox: function(check){
          // console.log('is checked',check);
      },
      onCheckBoxMain : function(checked){
          // console.log(checked)
      },
      onCompleteRequest:function(){
        //........................................

       $('.tc_v').click(function(e){
        e.preventDefault();
        var id = this.dataset.id;
        document.getElementById('one').style.display='none'
        document.getElementById('two').style.display='block'

         that.post('http://ws.iclicauditor.com/lists/viewall',{id:id,tenant:that.options.tenant,user:that.options.user,ids:data._id},function(e,r){
                if(!e){
                    var all = r.data
                    for(var x=0; x<all.length; x++){
                     // alert(all[x].key) 
                       var ab = document.getElementById('code') //h2
                       ab.innerHTML ='<i class="fa fa-pencil-square green-text" aria-hidden="true"></i>Código:'+all[x].key+'';
                       //.......................datos generales.............................
                        var ad       = document.getElementById('dir_');
                        var txt_e    = document.getElementById('txt_e');
                        var txt_city = document.getElementById('txt_city');
                        var th_e     = document.getElementById('th_e');
                        
                        
                        ad.value       = all[x].address;
                        txt_e.value    = all[x].state;
                        txt_city.value = all[x].city;
                        th_e.innerHTML = '<a href="#" class="btn btn-info editButton"  data-toggle="modal" data-target="#basicModal">'+all[x].key+'</a>';
                      
                        //........................MAP................................................
                       var mapOptions = {
                           center: new google.maps.LatLng(0, 0),
                           zoom: 16
                          },
                         map = new google.maps.Map(document.getElementById("map"), mapOptions)
                         marker = new google.maps.Marker({
                                  position: map.getCenter(),
                                  map: map,
                                  title: 'Drag to set position',
                                  draggable: true,
                                  flat: false
                              });
                            google.maps.event.addListener(marker, 'dragend', function() {
                                latlng = marker.getPosition();
                                url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latlng.lat() + ',' + latlng.lng() + '&sensor=false';
                                $.get(url, function(data) {
                                    if (data.status == 'OK') {
                                        map.setCenter(data.results[0].geometry.location);                
                                        if (confirm('Do you also want to change location text to ' + data.results[0].formatted_address) === true) {
                                            $('#location').val(data.results[0].formatted_address);
                                            $('#lat').val(data.results[0].geometry.location.lat);
                                            $('#lng').val(data.results[0].geometry.location.lng);
                                        }
                                    }
                                });    
                            });

                           if ($('#map').hasClass('hidden')) {
                                $('#map').removeClass('hidden').fadeIn().addClass('show');
                                google.maps.event.trigger(map, 'resize');
                           }

                            var address = all[x].address+','+all[x].state;
                                if (address.length == 0) {
                                    $('#map').removeClass('show').fadeOut().addClass('hidden');
                            }

                           url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false';
                            $.get(url, function(data) {
                                  if (data.status == 'OK') {
                                      map.setCenter(data.results[0].geometry.location);
                                      marker.position=map.getCenter();
                                  }
                            });      
                        //........................table................................................
                           var st           = document.getElementById('th_e1');
                               st.innerHTML = all[x].status;

                           var us           =  document.getElementById('th_e2');
                               us.innerHTML = that.options.user.name.toUpperCase();

                               //........................img popup................................................
                             // var img_all    = document.getElementById('oImg');
                             // for(var n = 0; n<3; n++){
                             //    img_all.src = 'http://www.jose-aguilar.com/blog/wp-content/uploads/2014/05/boopstrap-responsive.jpg';
                             // }  
                    }
                  }
              });
       });
      }
    });
	},
	tableFiles:function(data) {

		var that = this;
      var filestable = document.getElementById('files-table-container');
        filestable.innerHTML = '';
		headers  = {
			'name'     	:{name:'Nombre',width:'250px',type:'text', align:'left',value:function(i,o){
				return '<a href="'+o.src+'">'+o.name+'</a>';
			}},
			'progress'  :{name:'Estatus',width:'50px',type:'text',label:'label label-success', align:'center'},
			'extension' :{name:'Extensión',width:'50px',type:'text',label:'label label-primary', align:'center'},
			'mime' 		:{name:'Eliminar',width:'50px',type:'text',  align:'center',value:function(i,o){
				return '<span class="label label-danger"><i class="fa fa-times remove-item-white remove-file-table" aria-hidden="true " data-id="'+o._id+'"></i></span>';
			}},
		};
    window.tableFiles = $(filestable).Table({
      source   :'http://ws.iclicauditor.com/lists/files',
      method   :'GET',
      type     :'table',
      params   :{id:data._id,tenant:this.options.tenant},
      tooltips :true,
      rows     :10,
      sortable :false,
      checkbox :false,
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
      	$('.remove-file-table').click(function(e){
      		e.preventDefault();
      		var id = this.dataset.id;
      		bootbox.confirm('Realmente deseas eliminar este archivo?.',function(r){
      			if(r){
      				that.post('http://ws.iclicauditor.com/lists/removefiles',{id:id,tenant:that.options.tenant},function(e,r){
      					window.tableFiles.load();
      				});
      			}
      		});
      	});
      }
    });
	},
  table_index: function(data){ //table locations
    var that = this;
    var container = document.getElementById('tb_index');
        container.innerHTML = '';

        var headers = {
              'key'           :{name:'key',width:'30px',type:'text', align:'center', value: function(i,o){
                //return '<span class="label label-primary">'+o.key+'</span>';
                  return '<span class="label label-default">'+o.key+'</span>';
              } },
              'address'       :{name:'address',width:'50px',type:'text', align:'center'},
              'neigborhud'    :{name:'neigborhud',width:'30px',type:'text', align:'center' },
              'city'          :{name:'city',width:'50px',type:'text', align:'center'},
              'state'         :{name:'state',width:'30px',type:'text', align:'center' },
              'country'       :{name:'country',width:'50px',type:'text', align:'center'},
              'zip'           :{name:'zip',width:'30px',type:'text', align:'center' },
              'company'       :{name:'company',width:'50px',type:'text', align:'center'},
               'tipo'          :{name:'tipo',width:'50px',type:'text', align:'center' ,label:'label label-success'},
              'start_date'    :{name:'start_date',width:'30px',type:'text', align:'center' },
              'end_date'      :{name:'end_date',width:'30px',type:'text', align:'center' }
          };
              window.table_index = $(container).Table({
                    rows     :10,
                    source   :'http://ws.iclicauditor.com/lists/table_one',
                    method   :'GET',
                    type     :'table',
                    params   :{id:data._id,tenant:this.options.tenant},

                    tooltips :true,
                    sortable :false,
                    checkbox :false,
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
                      //.................................................
                      // var nav1 = document.getElementById('nav1');
                      // nav1.style.display  = 'block';
                      //.................................................
                        $('.label label-primary').click(function(e){
                          e.preventDefault();
                          var id = this.dataset.id;
                          bootbox.confirm('Realmente deseas eliminar este archivo?.',function(r){
                            if(r){
                              that.post('http://ws.iclicauditor.com/lists/group',{id:id,tenant:that.options.tenant},function(e,r){
                                window.table_index.load();
                              });
                            }
                          });
                        });

                    }
                  });
  },
  sentForm : function(data){
    // local scope
    var that = this;
    // disable form before start process
    this.disableForms('form-lists','input, textarea, button, select',true);
    // send data to server
    this.post('http://ws.iclicauditor.com/lists/save',data,function(e,data){
      if(!e){
        switch(data.code){
            case 0:
              // application form response mode in success
              switch(data.mode){
                  case 'insert':
                    // reset form
                    that.clearWorkSpace();
                    // append to collection chooser
                    window.DataChooser.appendThis(data.data[0]);
                    //load
                     window.DataChooser.loadThis(data.data[0])
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
      that.disableForms('form-lists','input, textarea, button, select',false);
      $("#user-email").attr('readonly', data === false  ? false : true);
      $("#user-password").val('');

    });
  }

});
