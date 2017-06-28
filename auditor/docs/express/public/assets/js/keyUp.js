function keyUpField (i) {
	var fields = i.split(' ');
	$.each( fields, function ( key, value ) {
		var item = value.split('/');
		$(item[0]).keyup(function(e){
		  var val = $(this).val();
		  $(this).attr('autocomplete','off');
		  $(item[1]).val(val);
		});
	})
}