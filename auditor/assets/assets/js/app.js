 
$(document).ready(function() {

	
	$('#hide-menu >:first-child > a').click(function(e) {
		$('body').toggleClass("hidden-menu");
		$('#page-content').toggleClass("mobile-content");
			e.preventDefault();
	});

	function sidebar(){
	
	   $('.hideLink').hide();
	
	    $( '#sidebar li' ).each( function(){
	
	      $( this ).children( 'a.mainLink' ).click( function () {
	      
	      	var display = $( this ).parent();
	      	var links = $(this).parent().attr('id');
	      	
	      
		      if ( $( '#sidebar li' ).has( '#' + links ) ){
		      
		      	$( '#sidebar li:not(#' + links + ')' ).children( 'ul' ).slideUp( 300 );
		      	
		      	      	
		      	$( '#sidebar li#' + links +' a.mainLink' ).children( 'b' ).children( 'i' ).toggleClass( ' fa-plus-square-o fa-minus-square-o ' );
		      	$( '#sidebar li:not(#' + links + ')' ).children('a.mainLink').children( 'b' ).children( 'i' ).removeClass(' fa-plus-square-o fa-minus-square-o ').addClass(' fa-plus-square-o ');
		      	
		      	      
		      	$( display ).children( 'ul' ).slideToggle( 300 );
		      	
		      }else if( !$( '#sidebar li' ).has( '#' + links ) ) {
		      	      	
	      	  }
	
	      });
	
	    });
	    
	} 
	
	sidebar();
	
});
    

