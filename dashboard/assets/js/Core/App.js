Core_App = Core.extend({


	run :function(options){

		this.init();

		this.remote.token  = 'ti848e7h7CYD5G72TShHcaIDtO206WTe';
		this.remote.secret = 'aeafe3a711c5d071e89ed5dff4d53652768261aab740dc1b908e3b049ecb66e4';

		//parent
		var that  = this;
		this.stou = false;

		this.resize();

    this._options = options;

		$('[data-toggle="tooltip"]').tooltip();
    this.setWorkspaces(this._options.tenant);
    this.abc(that._options.user.email);
    this.loadMoreButton();

		$(window).resize(this.resize);

		this.getCurrentController(options);

	},
	resize : function(){
			var panelheight =  $(window).height();
			var nav         = $('.nav-schoolar').height();
			var auxnav      = $('.nav-aux').height();
			$('.sidepanel, .workspace').height( panelheight - (auxnav+nav+48) );
	},
	search :function(k){
		this.post('http://ws.iclicauditor.com/search',{keyword:k},function(e,data){
			 if(!e){
				if(data.code == 0){
					var db = data.data;
					var list = document.getElementById('search-results-list');
							list.innerHTML = '';
					for(x in db){
						var row = db[x];
						var fulname = row.name+' '+row.first_lastname+' '+row.second_lastname;
						var li = document.createElement('li');
								list.appendChild(li);

						var img = document.createElement('img');
								img.className = 'img-thumbnail';
								img.alt       = fulname;
								img.src       = 'https://779e6f633a70793f17c7-aaca350cfb3c6d39fe773134ecbf1de9.ssl.cf1.rackcdn.com/noavatar.jpg';
								li.appendChild(img);
								li.appendChild(document.createTextNode(fulname));
								li.onclick = function(){
										document.location.href = '/u/'+row._id;
								}
					}
					var sc = $('#schoolar-search').width() + 10;
					$('#search-results').css({display:'block',width:sc});
				}
			 }
		});
	},
	test:function(){
		 this.post('http://ws.iclicauditor.com',{},function(e,data){
			 if(!e){
				if(data.code == 0){
					console.log(e||data);
				}
			 }
		});
	},
	index : function(options){
		var Dashboard = new Core_Dashboard();
				Dashboard.getAction(options);
	},
	providers : function(options){
    var Providers = new Core_Providers();
        Providers.getAction(options);
	},
	users : function(options){
		var Users = new Core_Users();
				Users.getAction(options);
	},
  profile : function(options){
    var Profile = new Core_Profile();
        Profile.getAction(options);
  },
  // account : function(options){
  //   var account = new Core_Account();
  //       account.getAction(options);
  // },
  apps : function(options){
    var apps = new Core_Apps();
        apps.getAction(options);
	},
   lists : function(options){
    	var lists = new Core_Lists();
        lists.getAction(options);
  },
  setWorkspaces : function(id){
    var that = this;
    var str  = '';
    for( var x in that._options.user.tenant ){
      var row = that._options.user.tenant[x];
      str += '<a class="dropdown-item dropdown-item-workspace"  data-id="'+row._id+'" >'+row.name+'</a>';
      if(id && row._id == id){
         that.selectTenant(row.name,row._id);
      }
    }
    $('.tenants-container').html(str);
    $('.dropdown-item-workspace').click(function(){
      that.selectTenant(this.innerHTML,this.dataset.id);
      document.location.href = '/lists/index';
    });
  },
  abc: function(dx){
   var that = this;
       //................................
         var delay = (function(){   //function para timeout
                var timer = 0;
                return function(callback, ms){
                  clearTimeout (timer);
                  timer = setTimeout(callback, ms);
                  };
            })();
        //.....................................
        var input = document.getElementById('bc');
       //........................................
      input.addEventListener('keyup', function(event) {
            $('#sp1').hide();
            $('#sp2').show();
          var str  = '';
          var ex   = []; 
          var aqui = [];
          var pdc  = '';
          var este = input.value; //texto
            delay(function(){
                 $.post('http://ws.iclicauditor.com/providers/search',{id:dx}, function(data){
                  if(data.code == 0){
                    var db = data.data; //pasar los valores del post
                    if(este !=''){
                                  for(var w=0; w<db.length; w++){  
                                           ex.push(db[w]);
                                   }
                                  var  aqui = $.grep(ex, function(dt) {   // buscams en el array con el valor que tiene el input 
                                        return dt.name.indexOf(este) != -1;
                                  });
                                        for(x in aqui){
                                             var rw  = aqui[x];
                                             pdc += '<a class="dropdown-item dropdown-item-workspace"  data-id="'+rw._id+'" >'+rw.name+'</a>'; // Workspaces
                                             $('#sp2').hide();
                                             $('#sp1').show();
                                        }
                          }else{
                            $('#sp2').hide();
                            $('#sp1').show();
                              for(x in db){
                              var row = db[x];
                              pdc += '<a class="dropdown-item dropdown-item-workspace" data-id="'+row._id+'" >'+row.name+'</a>'; // Workspaces
                              }
                          }
                  }
                          $("#tenants-container").html(pdc);
                          $('.dropdown-item-workspace').click(function(){
                            that.selectTenant(this.innerHTML,this.dataset.id);
                          });
                 })
           }, 2000 );
      });
  },
  selectTenant : function(str,id){
    var that = this;
    var element = $('#btn-dropdown-workspace');
        element.html(str);
        $('#subnav-aux').removeClass('hide');
      that.post('/session/current',{id:id},function(e,r){
         if(e) return bootbox.alert('Ups ha ocurrido un error en el servidor!');
    });
  },


  loadMoreButton : function(){
    var that                 = this;
    var user                 = that._options.user;
    var plusButton           = document.createElement('div');
        plusButton.className = 'plusButton';
        document.body.appendChild(plusButton);
    var plusText             = document.createElement('div');
        plusText.className   = 'fa fa-plus';
        plusButton.appendChild(plusText);
    plusButton.onclick       = function(){
           var user          = that._options.user;
          bootbox.prompt("Agregar un cuenta", function(result) {
          if ( result ) {
            that.post('/account/add',{name:result,user:user.id},function(e,r){
                if(e) return bootbox.alert('Ups ha ocurrido un error en el servidor!');
                if(!e){
                  switch(r.code){
                    case 0:
                      bootbox.alert('Los datos fueron creados correctamente.');
                      that._options.user.tenant.push(r.tenant);
                      that.setWorkspaces(r.tenant._id);
                    break;
                    case 100:
                      bootbox.alert('No se logró crear la cuenta');
                    break;
                  }
                }
            });
          }
        });
    }
  }
});
