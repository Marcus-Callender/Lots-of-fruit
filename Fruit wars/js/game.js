// sets up the requestAnimationFrame and cancelAnimationFrame for use in the games code
(function()
{
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	
	for (var z = 0; z < vendors.length && !window.requestAnimationFrame; ++z)
	{
		window.requestAnimattionFrame = window[vendors[z] + 'requestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[z] + 'cancelAnimationFrame'] 
			|| window[vendors[z] + 'cancelRequestANimationFrame'];
	}
	
	if (!window.requestAnimationFrame)
	{
		window.requestAnimationFrame = function(callback, element)
		{
			var currentTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
			
			var id = window.setTimeout (function()
				{
					callback(currentTime + timeToCall);
				},
				timeToCall
			);
			
			lastTime = currentTime + timeToCall;
			
			return id;
		};
		
		if (!window.cancelAnimationFrame)
		{
			window.cancelAnimationFrame = function(id)
			{
				clearTimeout(id);
			};
		}
	}
}());

// calles game.init when the window has fully loaded
$(window).load(
	function()
	{
		game.init();
	}
);

// defines basic game logic for truit wars
var game =
{// Game mode
	mode : "intro",
	slingshotX : 140,
	slingshotY : 280,
	
	// start initializing game objects, loading the assets and displaying the start screen
	init : function()
	{
		// initialize seprate game object
		levels.init();
		loader.init();
		
		// hide all game layers then display the game start screen
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
		
		// get a pointer for the games canvas and context
		game.canvas = $('#gamecanvas')[0];
		game.context = game.canvas.getContext('2d');
	},
	
	// hides the main menu screen and slowly displays the level selection screen
	showLevelScreen : function()
	{
		$('.gamelayer').hide();
		$('#levelselectscreen').show('slow');
	},
	
	start : function()
	{
		$('.gamelayer').hide();
		
		//Display the game canvas and current player score
		$('#gamecanvas').show();
		$('#scorescreen').show();
		
		game.mode = "intro";
		game.offsetLeft = 0;
		game.ended = false;
		game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
	},
	
	handlePanning : function()
	{
		// a tempory placeholder that will continusly pan to the right
		game.offsetLeft++;
	},
	
	animate : function()
	{
		// animation for the background
		game.handlePanning();
		
		// animate the charicters
		
		// Draw the backgrounds with a paralax scrolling
		// the forground will move 4x further than the background to simulate perspective
		game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft / 4.0, 0, 640, 480, 0, 0, 640, 480);
		game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
		
		// draw the slingshot
		game.context.drawImage(game.slingshotImage, game.slingshotX - game.offsetLeft, game.slingshotY);
		game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.leftOffset, game.slingshotY);
		
		if (!game.ended)
		{
			game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
		}
	}
}

// an object for stroing data about the levels in the game
var levels = 
{
	data : [
		// first level
		{
			foreground : 'desert-foreground',
			background : 'clouds-background',
			entities : []
		},
		// seccond level
		{
			foreground : 'desert-foreground',
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
			html += '<input type = "button" value = "' + (i + 1) + '">';
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
		// declare a new 'currentLevel' object
		game.currentLevel = {number : number, hero : []};
		game.score = 0;
		
		$('#score').html('Score: ' + game.score);
		var level = levels.data[number];
		
		// load the background, forground and slingshot images
		game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
		game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
		
		game.slingshotImage = loader.loadImage("images/slingshot.png");
		game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");
		
		// call start() once all the assets have been loaded
		if (loader.loaded)
		{
			games.start();
		}
		else
		{
			// if the images haven't yet been loaded this will be called when they have
			loader.onload = game.start;
		}
	}
}

var loader = 
{
	loaded : true,
	assetsLoadedCount : 0,
	totalassetsCount : 0,
	
	soundFileExtn : ".ogg",
	
	init : function()
	{
		// checks the compatibility with audio filetypes
		var mpsSupport, oggSupport;
		var audio = document.createElement('audio');
		
		if (audio.canPlayType)
		{
			// canPlayType will return "", "mayby" or "probably"
			mp3Support = ("" != audio.canPlayType('audio/mpeg'));
			oggSupport = ("" != audio.canPlayType('audio/ogg; codecs = "vorbis"'));
		}
		else
		{
			mp3Support = false;
			oggSupport = false;
		}
		
		// check for ogg and mp3 support, if nither are true set the type to undefined
		loader.soundFileExtn = oggSupport ? ".ogg" : (mp3Support ? "mp3" : undefined);
	},
	
	loadImage : function(url)
	{
		this.totalassetsCount++;
		this.loaded = false;
		$('#loadingscreen').show();
		var image = new Image();
		image.src = url;
		image.onload = loader.itemLoaded;
		return image;
	},
	
	loadSound : function(url)
	{
		this.totalassetsCount++;
		this.loaded = false;
		$('#loadingscreen').show();
		var audio = new Audio();
		audio.src = url + loader.soundFileExtn;
		audio.addEventListener("canplaythrough", loader.itemLoaded, false);
		return audio;
	},
	
	itemLoaded : function()
	{
		loader.assetsLoadedCount++;
		$('#loadingmessage').html('Loaded ' + loader.assetsLoadedCount + ' of ' + loader.totalassetsCount);
		
		// if true all assets have been loaded
		if (loader.assetsLoadedCount === loader.totalassetsCount)
		{
			loader.loaded = true;
			$('#loadingscreen').hide();
			
			// if the loader.onload method has been assigned, run it then unasign it
			if (loader.onload)
			{
				loader.onload();
				loader.onload = undefined;
			}
		}
	}
}

