$(".hideLink").hide();$("#sidebar li").each(function(){$(this).children("a.mainLink").click(function(){var e=$(this).parent(),t=$(this).parent().attr("id");if($("#sidebar li").has("#"+t)){$("#sidebar li:not(#"+t+")").children("ul").slideUp(300);$("#sidebar li#"+t+" a.mainLink").children("b").children("i").toggleClass(" fa-plus-square-o fa-minus-square-o ");$("#sidebar li:not(#"+t+")").children("a.mainLink").children("b").children("i").removeClass(" fa-plus-square-o fa-minus-square-o ").addClass(" fa-plus-square-o ");$(e).children("ul").slideToggle(300)}else!$("#sidebar li").has("#"+t)})});