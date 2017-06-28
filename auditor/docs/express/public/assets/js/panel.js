(function($){ 

  $.fn.panel = function(options) {

      /* initizalize
      ---------------------------------- */
      this.init = function(){    

        //constants
        this.id        = this.uniq(this[0].id);
        this.container = $(this);

        //default data
        var defaults = {        
           id:this.id,
           title:null,
           source:null,
           auto:true,
           params:{},
           condition:'',
           rows:10,
           page:1,
           vpp:5,
           rheight:'',
           classPagination : '',
           autoclick:true,
           checkbox:false,
           drawgrid:false,
           btCheckbox:false,       
           searcher:false,
           navigation:true,
           animation:false,
           primary:false,
           sortable:false,
           onStart:function(){},
           onStartRequest:function(){},
           onCompleteRequest:function(){},
           onCreateRow:function(){},
           onClickRow:function(){}
        }
        
        //extend options
        this.opts = $.extend(defaults, options);  

        this.page        = this.opts.page;
        this.crows       = this.opts.rows;
        this.keyword     = null;
        this.sortfield   = null;
        this.sortby      = null;           
        
        //callback on start
        this.opts.onStart.call(this);

        //load data
        this.theLoad();

        //search input
        this.setSearchInput();
      }

      /* load data from server
      ---------------------------------- */
      this.theLoad = function(){

        var that = this;    
        this.opts.params.page   = this.page;
        this.opts.params.rows   = this.crows;
        
        if( this.keyword != null ){   
          this.opts.params.keyword = this.keyword;    
        }else{    
          delete this.opts.params.keyword;    
        }     
          
        //--------------------------------------      
        if( this.sortfield != null ){       
          this.opts.params.sortfield   = this.sortfield;
          this.opts.params.sortby = this.sortby;      
        }else{      
          delete this.opts.params.sortfield;
          delete this.opts.params.sortby;     
        }
        //console.log(this.opts);
        if (this.opts.condition != '') {
         this.opts.params.condition = $(this.opts.condition).val();
        }
        
        //on start request     
        this.opts.onStartRequest.call(this);      
        $.post(this.opts.source,this.opts.params, function(response){    
          that.response = response;    
          that.executer();
        }, "json");
      }

      this.executer = function(){

        //the dataset
        this.data = this.response.data

        //the keyword
        this.keyword = this.keyword ? this.keyword  : null;

        //on complete request
        this.opts.onCompleteRequest.call(this); 

        //create Row
        this.createRow();

        //pagination;
        this.drawPages();


      } 

      /* create row
      ---------------------------------- */
      this.createRow = function(){
        var that = this;
        var data = this.data.data;

        //empty container
        this.container.html('');

        //ul container 
        var ul           = document.createElement('ul');
            ul.id        = that.opts.id;
            ul.className = 'panel';
            this.container.append(ul);

            //list iteraction 
            $.each(this.data, function(i,row){
                
                var li          = document.createElement('li');
                li.id           = 'item_'+row._id;
                li.style.height = that.opts.rheight;
                $(ul).append(li);

                var div       = document.createElement('div');
                div.className = 'inner';                   
                $(li).append(div); 

                //container 
                var container = $(div);

                li.onclick = function(event){
                  event.preventDefault();
                  //on click row
                  that.opts.onClickRow.call(that,this);
                }

                //This call onBeforeCreateRow Callback
                that.opts.onCreateRow.call(this,container);          

            });

      }


     /* drawPages
      ---------------------------------- */   
      this.drawPages = function(  ){
       
       var pages = this.response.pages;
   

        var nav           = document.createElement('div');
        nav.className = 'pagination pagination-centered '+ this.opts.classPagination ;        
        
        //create jquery object
        this.nav        = $(nav);

        //append navigation
        if( typeof( this.opts.navigation )  == 'string'  ){
            //append to main container

            $( this.opts.navigation + ' .pagination').html('');
            $( this.opts.navigation ).append(nav);
        }else{
            //append to main container
            this.container.append(nav);
        }
        

        var curr       = pages.current > 1 ? ( parseInt( pages.current ) ) : pages.current;       
        var that       = this;         
        var nav        = '';       
        var pageview   = 10;
        var interval   = Math.floor ( (pageview/2) );
        var total      = pages.total;
        var current    = parseInt(curr);
        
        var aux        = ( Math.round(current) - pageview ) + interval;
        
        var initpage   = current < pageview ?  0 : ( aux ) ;                              
        var maxpages   = current == total  ? total : initpage + pageview ;  
        var maxpages   = maxpages > total ? total : maxpages;
        
        var aux2       =  maxpages - initpage ;       
        var ninitpage  = initpage - ( pageview - aux2 ) ;        
        var initpage   =  aux2 < pageview && ( total > pageview ) ? ninitpage : initpage ;
         
         if( pages.total > 1 ) {
           
            var prevpage = parseInt(curr) - 1;
           
            if( parseInt(curr) != 1 && prevpage >= 0 ){             
              nav += '<li><a href="javascript:;" id="znavi_'+1+'" class="'+ classe +'"><< first </a></li>';           
            }else{              
              nav += '<li><a href="javascript:;" id="znavi_'+1+'" class="banned"><< first </a></li>';             
            }
            if( parseInt(curr) != 1 && prevpage >= 0 ){             
               nav += '<li><a href="javascript:;" id="znavi_'+prevpage+'" class="'+ classe +'"><< prev </a></li>';            
            }else{              
             nav += '<li><a href="javascript:;"  id="znavi_'+1+'" class="banned"><< prev </a></li>';              
            }
                     
           /////////////////////////////////////////////////
           
           for( var o = initpage; o < maxpages; o++ ){             
             var classe =  curr == ( o + 1 )  ? 'active' : '';
             var nextpage = parseInt(curr) + 1;            
             var ix = o + 1;             
             nav += '<li class="'+ classe +'"><a href="javascript:;" id="znavi_'+ix+'" >'+ ix +'</a></li>';           
           };        
            /////////////////////////////////////////////////        
            if( nextpage <= pages.total ){            
              nav += '<li><a href="javascript:;" id="znavi_'+nextpage+'" >next >></a></li>';            
            }else{              
              nav += '<li><a href="javascript:;"  id="znavi_'+pages.total+'" class="banned">next >></a>';
            }
            
            if( nextpage <=  pages.total){            
              nav += '<li><a href="javascript:;" id="znavi_'+pages.total+'" class="'+ classe +'">last >></a></li>';             
            }else{              
                nav += '<li><a href="javascript:;" id="znavi_'+pages.total+'" class="banned">last >></a></li>';            
            }
         }

        nav = '<ul>'+ nav + '<div class="fix"></div></ul>';

        this.nav.append( nav );
         
         $('.pagination a').each(function( e , itm){            
            if( typeof(itm.id) != 'undefined' ){
              $(this).click(function(){             
                that.setPage( (this.id).split('_')[1] );              
              });           
            }
         });         
      }
         
      /* setPage
      ---------------------------------- */     
      this.setPage = function( p ){        
       this.page = p;        
       this.theLoad();         
      }

   /* createSearchInput
    ---------------------------------- */   
    this.setSearchInput = function(s ){
      
     var that         = this;
     this.searchInput = $(this.opts.searcher);
     
    // this.searchTextDefault      = 'Enter keyword to find, press enter';      
    // this.SearchInput            = document.createElement('input');
    // this.SearchInput.type       = 'text';
    // this.SearchInput.value      = this.keyword ?  this.keyword : this.searchTextDefault;
    // this.SearchInput.className  = 'search ' ;   
    // this.Sic.appendChild( this.SearchInput );   
    // this.SearchInput = $( this.SearchInput );   
    // this.SearchInput.click(function(){          
    //   if( that.SearchInput.val() == that.searchTextDefault ) {        
    //     that.SearchInput.val('');       
    //   }       
    //  });
         
     this.searchInput.blur(function(){          
      if( that.searchInput.val() == ''  ) {       
        that.keyword = null;   
      }else{        
        that.search();          
      }
          
     });
     
     this.searchInput.keyup(function(e){
        e.preventDefault();       
        // if(  ( that.searchInput.val() != that.searchTextDefault ) ){                
        that.keyword  = that.searchInput.val();    
        that.search();            
        // }         
     });      
    },
    
    /* create unique id
    ---------------------------------- */     
    this.search = function(){
      
      var that  = this;      
      this.page = 1; 
      if (window.keyTimeout_) {         
          clearTimeout(window.keyTimeout_);       
      }       
      var callMethod = function(){
        that.theLoad();
      }
      window.keyTimeout_ = setTimeout(callMethod, 1000);     

    },

      /* create unique id
      ---------------------------------- */     
      this.uniq = function(id){
        return id+'_'+Math.random().toString(36).substr(2)
        + Math.random().toString(36).substr(2)
        + Math.random().toString(36).substr(2)
        + Math.random().toString(36).substr(2);
      }
 
      //start plugin 
      this.init(); 
  }

})(jQuery);


 // var that = this;
 //      $.ajax({
 //        type: "POST",
 //        url: "/v1/suppliers/all",
 //        data:{page:that.pageP}
 //        }).done(function( response ) {
 //          that.pagination();
 //        that.isLogged(response,function(){

 //         $('a[rel=tooltip]').tooltip();
 //        
 //              li.onclick = function(){
 //                $('#placesList').hide(); 
 //                var id = this.id.split('_')[1];

 //                //carga el objecto location seleccionado
 //                that.getForm(function(){
 //                  that.setForm();
 //                  that.loadObject(id,function(){
 //                    //set delete supplier function
 //                    $('#delete_supplier').show();
 //                    $('#delete_supplier').click(function(){
 //                        that.delete();            
 //                  });
 //                });

 //              });

 //              }
 //            })  
 //         })
 //      });