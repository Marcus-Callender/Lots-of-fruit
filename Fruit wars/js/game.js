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
		// initialize 'levels' object
		levels.init();
		
		// hide all game layers then display the game start screen
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
		
		// get a pointer for the games canvas and context
		game.canvas = $('#gamecavas')[0];
		game.context = game.canvas.getContext('2d');
	}
}

// an object for stroing data about the levels in the game
var levels = 
{
	data : [
		// first level
		{
			foreground : 'desert-forground',
			background : 'clouds-background',
			entities : []
		},
		// seccond level
		{
			foreground : 'desert-forground',
			background : 'clouds-background',
			entities : []
		}
	],
		
	// initialize the data for the level select screen
	init : function()
	{
		var html = "";
		
		// loops through all the levels
		for (var i = 0; i < levels.data.length; i++)
		{
			var level = levels.data[i];
			html += ' < input type = "button" value = "' + (i + 1) + '" > ';
		};
		
		$('#levelselectscreen').html(html);
		
		// set the buuton click event-handlers to load the corisponding level and hide the level select screen
		$('#levelselectscreen input').click(
			function()
			{
				levels.load(this.value - 1);
				$('#levelselectscreen').hide();
			}
		);
	},
	
	// load the data needed for a spsific level
	load : function(number)
	{
	}
}

