// sets up the requestAnimationFrame and cancelAnimationFrame for use in the games code
(function()
{
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	
	for (var z = 0; z < vendors.length && !window.requestAnimationFrame; ++z)
	{
		window.requestAnimationFrame = window[vendors[z] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[z] + 'CancelAnimationFrame'] 
			|| window[vendors[z] + 'CancelRequestAnimationFrame'];
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

// Declare all the commonly used objects as variables for convenience
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var entities =
{
	definitions :
	{
		"glass" :
		{
			fullHealth : 100,
			density : 2.4,
			friction : 0.4,
			restitution : 0.15,
		},
		"wood" :
		{
			fullHealth : 500,
			density : 0.7,
			friction : 0.4,
			restitution : 0.4,
		},
		"dirt" :
		{
			density : 3.0,
			friction : 1.5,
			restitution : 0.2,
		},
		"burger" :
		{
			shape : "circle",
			radius : 25,
			fullHealth : 40,
			density : 1.0,
			friction : 0.5,
			restitution : 0.4,
		},
		"soda" :
		{
			shape : "rectangle",
			width : 40,
			height : 60,
			fullHealth : 80,
			density : 1.0,
			friction : 0.5,
			restitution : 0.7,
		},
		"fries" :
		{
			shape : "rectangle",
			width : 40,
			height : 50,
			fullHealth : 50,
			density : 1.0,
			friction : 0.5,
			restitution : 0.6,
		},
		"apple" :
		{
			shape : "circle",
			radius : 25,
			density : 1.5,
			friction : 0.5,
			restitution : 0.4,
		},
		"orange" :
		{
			shape : "circle",
			radius : 25,
			density : 1.5,
			friction : 0.5,
			restitution : 0.4,
		},
		"strawberry" :
		{
			shape : "circle",
			radius : 15,
			density : 2.0,
			friction : 0.5,
			restitution : 0.4,
		}
	},
	
	// create a new Box2D rigid body and add it to the current world
	create : function(entity)
	{
		
	},
	
	// draw the specified entity at the specified position and angle
	draw : function(entity, position, angle)
	{
		
	}
}

// holds all Box2D related methods and data
var box2d =
{
	scale : 30,
	
	init : function()
	{
		// set up the box2d world that the objects will be contained in
		var gravity = new b2Vec2(0, 9.8);
		var allowSleep = true;
		box2d.world = new b2World(gravity, allowSleep);
	},
	
	createRectangle : function(entity, definition)
	{
		var bodyDef = new b2BodyDef;
		
		if (entity.isStatic)
		{
			bodyDef.type = b2Body.b2_staticBody;
		}
		else
		{
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		
		bodyDef.position.x = entity.x / box2d.scale;
		bodyDef.position.y = entity.y / box2d.scale;
		
		if (entity.angle)
		{
			bodyDef.angle = Math.PI * entity.angle / 180;
		}
		
		var fixtureDef = new b2FixtureDef;
		fixtureDef.density = definition.density;
		fixtureDef.friction = definition.friction;
		fixtureDef.restitution = definition.restitution;
		
		fixtureDef.shape = new b2PolygonShape;
		fixtureDef.shape.SetAsBox(entity.width / 2 / box2d.scale, entity.height / 2 / box2d.scale);
		
		var body = box2d.world.CreateBody(bodyDef);
		body.SetUserData(entity);
		
		var fixture = body.CreateFixture(fixtureDef);
		
		return body;
	},
	
	createCircle : function(entity, definition)
	{
		var bodyDef = new b2BodyDef;
		
		if (entity.isStatic)
		{
			bodyDef.type = b2Body.b2_staticBody;
		}
		else
		{
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		
		bodyDef.position.x = entity.x / box2d.scale;
		bodyDef.position.y = entity.y / box2d.scale;
		
		if (entity.angle)
		{
			bodyDef.angle = Math.PI * entity.angle / 180;
		}
		
		var fixtureDef = new b2FixtureDef;
		fixtureDef.density = definition.density;
		fixtureDef.friction = definition.friction;
		fixtureDef.restitution = definition.restitution;
		
		fixtureDef.shape = new b2CircleShape(entity.radius / box2d.scale);
		
		var body = box2d.world.CreateBody(bodyDef);
		body.SetUserData(entity);
		
		var fixture = body.CreateFixture(fixtureDef);
		
		return body;
	},
}

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
	// Game mode
	mode : "intro",
	slingshotX : 140,
	slingshotY : 280,
	maxPanSpeed : 3.0,
	minPanOffset : 0,
	maxPanOffset : 300,
	// current panning offset
	offsetLeft : 0,
	score : 0,
	
	// start initializing game objects, loading the assets and displaying the start screen
	init : function()
	{
		// initialize seprate game object
		levels.init();
		loader.init();
		mouse.init();
		
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
	
	/*handlePanning : function()
	{
		// a tempory placeholder that will continusly pan to the right
		game.offsetLeft++;
	},*/
	
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
		game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.offsetLeft, game.slingshotY);
		
		if (!game.ended)
		{
			game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
		}
	},
	
	panTo : function(centerPoint)
	{
		if (Math.abs(centerPoint - game.offsetLeft - game.canvas.width / 4.0) > 0
			&& game.offsetLeft <= game.maxPanOffset && game.offsetLeft >= game.minPanOffset)
		{
			var deltaX = Math.round((centerPoint - game.offsetLeft - game.canvas.width / 4.0) / 2.0);
			
			if (deltaX && Math.abs(deltaX) > game.maxPanSpeed)
			{
				deltaX = game.maxPanSpeed * Math.abs(deltaX) / (deltaX);
			}
			
			game.offsetLeft += deltaX;
		}
		else
		{
			return true;
		}
		
		if (game.offsetLeft < game.minPanOffset)
		{
			game.offsetLeft = game.minPanOffset;
			return true;
		}
		else if (game.offsetLeft > game.maxPanOffset)
		{
			game.offsetLeft = game.maxPanOffset;
			return true;
		}
		
		return false;
	},
	
	handlePanning : function()
	{
        if (game.mode == "intro")
		{        
            if (game.panTo(700))
			{
                game.mode = "load-next-hero";
            }             
        }       

        if(game.mode == "wait-for-firing")
		{  
            if (mouse.dragging)
			{
				game.panTo(mouse.x + game.offsetLeft)
            }
			else
			{
                game.panTo(game.slingshotX);
            }
        }
		
		if (game.mode == "load-next-hero")
		{
			// TODO: 
			// Check if any villains are alive, if not, end the level (success)
			// Check if there are any more heroes left to load, if not end the level (failure)
			// Load the hero and set mode to wait-for-firing
			game.mode = "wait-for-firing";			
		}
		
		if(game.mode == "firing")
		{  
            game.panTo(game.slingshotX);
        }
        
		if (game.mode == "fired")
		{
			// TODO:
			// Pan to wherever the hero currently is
		}
   	},
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

var mouse = 
{
	x : 0,
	y : 0,
	buttonDown : false,
	
	init : function()
	{
		$('#gamecanvas').mousemove(mouse.mousemovehandler);
		$('#gamecanvas').mousedown(mouse.mousedownhandler);
		$('#gamecanvas').mouseup(mouse.mouseuphandler);
		$('#gamecanvas').mouseout(mouse.mouseuphandler);
	},
	
	// uses jquery's offset() method to calculate the mouse position from the top left of the canvas and checks for mouse button input
	mousemovehandler : function(ev)
	{
		var offset = $('#gamecanvas').offset();
		
		mouse.x = ev.pageX - offset.left;
		mouse.y = ev.pageY - offset.top;
		
		if (mouse.buttonDown)
		{
			mouse.dragging = true;
		}
	},
	
	// Stores the position of the mouse when a mouse button was pressed and prevents default browser behaviour of mouse clicks
	mousedownhandler : function(ev)
	{
		mouse.buttonDown = true;
		mouse.downX = mouse.x;
		mouse.downY = mouse.y;
		ev.originalEvent.preventDefault();
	},
	
	// if the mouse leavs the canvas it it counted as the input being relesed
	mouseuphandler : function(ev)
	{
		mouse.buttonDown = false;
		mouse.dragging = false;
	}
}






