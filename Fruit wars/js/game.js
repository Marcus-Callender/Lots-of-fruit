// calles game.init when the window has fully loaded
$(window).load(
	function()
	{
		game.init();
	}
);

// defines basic game logic for truit wars
var game =
{
	// start initializing game objects, loading the assets and displaying the start screen
	init : function()
	{
		// hide all game layers then display the game start screen
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
		
		// get a pointer for the games canvas and context
		game.canvas = $('#gamecavas')[0];
		game.context = game.canvas.getContext('2d');
	}
}

