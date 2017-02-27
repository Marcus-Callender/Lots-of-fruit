$(window).load(
	function()
	{
		game.init();
	}
);

var game = 
{
	init : function()
	{
		// preload necicery assets
		loader.init();
		
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
	}
}

