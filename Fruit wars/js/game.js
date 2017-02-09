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
			//name : "glass",
			fullHealth : 100,
			density : 2.4,
			friction : 0.4,
			restitution : 0.15,
		},
		"wood" :
		{
			//name : "wood",
			fullHealth : 500,
			density : 0.7,
			friction : 0.4,
			restitution : 0.4,
		},
		"dirt" :
		{
			//name : "dirt",
			density : 3.0,
			friction : 1.5,
			restitution : 0.2,
		},
		"burger" :
		{
			//name : "burger",
			shape : "circle",
			radius : 25,
			fullHealth : 40,
			density : 1.0,
			friction : 0.5,
			restitution : 0.4,
		},
		"sodacan" :
		{
			//name : "sodacan",
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
			//name : "fries",
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
			//name : "apple",
			shape : "circle",
			radius : 25,
			density : 1.5,
			friction : 0.5,
			restitution : 0.4,
		},
		"orange" :
		{
			//name : "orange",
			shape : "circle",
			radius : 25,
			density : 1.5,
			friction : 0.5,
			restitution : 0.4,
		},
		"strawberry" :
		{
			//name : "strawberry",
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
		var definition = entities.definitions[entity.name];
		
		if (!definition)
		{
			console.log("Coulden't retreve entity: ", entity.name);
			return;
		}
		
		switch (entity.type)
		{
			case "block" :
				entity.health = definition.fullHealth;
				entity.fullHealth = definition.fullHealth;
				entity.shape = "rectangle";
				entity.sprite = loader.loadImage("images/entities/" + entity.name + ".png");
				entity.blockBreakSound = game.blockBreakSound[entity.name];
				box2d.createRectangle(entity, definition);
				break;
				
			case "ground" :
				// no health because ground blocks are indestructable
				entity.shape = "rectangle";
				// no sprite is nesacery as ground blocks aren't drawn
				box2d.createRectangle(entity, definition);
				break;
				
			case "hero" :
			case "villain" :
				// this code is for hero or vilan entities
				entity.health = definition.fullHealth;
				entity.fullHealth = definition.fullHealth;
				entity.sprite = loader.loadImage("images/entities/" + entity.name + ".png");
				entity.shape = definition.shape;
				entity.bounceSound = game.bounceSound;
				
				if (definition.shape == "circle")
				{
					entity.radius = definition.radius;
					box2d.createCircle(entity, definition);
				}
				else if (definition.shape == "rectangle")
				{
					entity.width = definition.width;
					entity.height = definition.height;
					box2d.createRectangle(entity, definition);
				}
				break;
				
			default :
				// if none of the other cases are run
				console.log("Coulden't recognise entity: ", entity.name);
				break;
		}
	},
	
	// draw the specified entity at the specified position and angle
	draw : function(entity, position, angle)
	{
		// move the canvas to where the image needs to be drawn
		game.context.translate((position.x * box2d.scale) - game.offsetLeft, position.y * box2d.scale);
		game.context.rotate(angle);
		
		// all images are drawn 1 pixel larger to hide gaps in the bix2d colision
		switch (entity.type)
		{
			case "block" :
				game.context.drawImage(entity.sprite, 0, 0, entity.sprite.width, entity.sprite.height, (-entity.width / 2) - 1, (-entity.height / 2) - 1, entity.width + 2, entity.height + 2);
				break;
				
			case "villain" :
			case "hero" :
				if (entity.shape == "circle")
				{
					game.context.drawImage(entity.sprite, 0, 0, entity.sprite.width, entity.sprite.height, -entity.radius - 1, -entity.radius - 1, (entity.radius * 2) + 2, (entity.radius * 2) + 2);
				}
				else if (entity.shape == "rectangle")
				{
					game.context.drawImage(entity.sprite, 0, 0, entity.sprite.width, entity.sprite.height, (-entity.width / 2) - 1, (-entity.height / 2) - 1, entity.width + 2, entity.height + 2);
				}
				break;
			
			case "ground" :
				// do nothing as these objects are not drawn
				break;
		}
		
		// resets the canvas to its original position and rotation
		game.context.rotate(-angle);
		game.context.translate((-position.x * box2d.scale) + game.offsetLeft, -position.y * box2d.scale);
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
		
		// set up the debug drawings
		var debugContext = document.getElementById('debugcanvas').getContext('2d');
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(debugContext);
		debugDraw.SetDrawScale(box2d.scale);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		box2d.world.SetDebugDraw(debugDraw);
		
		// set up for the modified contact listener that will be used in colisions between bodies
		var listener = new Box2D.Dynamics.b2ContactListener;
		
		listener.PostSolve = function(contact, impulse)
		{
			var body1 = contact.GetFixtureA().GetBody();
			var body2 = contact.GetFixtureB().GetBody();
			
			var entity1 = body1.GetUserData();
			var entity2 = body2.GetUserData();
			
			var impulseAlongNormal = Math.abs(impulse.normalImpulses[0]);
			
			// to reduce the ammount of times this is run all impulses under a value of 5 will be ignored
			if (impulseAlongNormal > 5)
			{
				// if an entity has health, reduce the health of the impulse value
				if (entity1.health)
				{
					entity1.health -= impulseAlongNormal;
				}
				
				if (entity2.health)
				{
					entity2.health -= impulseAlongNormal;
				}
				
				// if the entites have a bounce sound play it
				if (entity1.bounceSound)
				{
					entity1.bounceSound.play();
				}
				
				if (entity2.bounceSound)
				{
					entity2.bounceSound.play();
				}
			}
		}
		
		box2d.world.SetContactListener(listener);
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
		fixtureDef.shape.SetAsBox((entity.width / 2) / box2d.scale, (entity.height / 2) / box2d.scale);
		
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
			bodyDef.angle = Math.PI * (entity.angle / 180);
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
	
	step : function(timeStep)
	{
		var vecocityIterations = 8;
		var positionIterations = 3;
		
		// limits the timestp to a maximum of 2/60 of a seccond
		if (timeStep > 2 / 60)
		{
			timeStep = 2 / 60
		}
		
		box2d.world.Step(timeStep, vecocityIterations, positionIterations);
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
		
		// load all the audio files
		
		// background music "Kindergarten" by Gurdonark
		// http://ccmixter.org/files/gurdonark/26491 is licensed under a Creative Commons license
		game.backgroundMusic = loader.loadSound('audio/gurdonark-kindergarten');
		
		game.slingshotFireSound = loader.loadSound('audio/released');
		game.bounceSound = loader.loadSound('audio/bounce');
		game.blockBreakSound = 
		{
			"glass" : loader.loadSound('audio/glassbreak'),
			"wood" : loader.loadSound('audio/woodbreak')
		};
		
		
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
		var currentTime = new Date().getTime();
		var timeStep;
		
		if (game.lastUpdateTime)
		{
			timeStep = (currentTime - game.lastUpdateTime) / 1000;
			box2d.step(timeStep);
		}
		
		game.lastUpdateTime = currentTime;
		
		// Draw the backgrounds with a paralax scrolling
		// the forground will move 4x further than the background to simulate perspective
		game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft / 4.0, 0, 640, 480, 0, 0, 640, 480);
		game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
		
		// draw the back of the slingshot
		game.context.drawImage(game.slingshotImage, game.slingshotX - game.offsetLeft, game.slingshotY);
		
		// draw all the interactable objects
		game.drawAllBodies();
		
		// draw the slingshot band only when the hero is being dragged
		if (game.mode == "firing")
		{
			game.drawSlingshotBand();
		}
		
		//draw the frount of the slingshot
		game.context.drawImage(game.slingshotFrontImage, game.slingshotX - game.offsetLeft, game.slingshotY);
		
		if (!game.ended)
		{
			game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
		}
	},
	
	drawAllBodies : function()
	{
		box2d.world.DrawDebugData();
		
		// find and draw all bodies registered in box2d
		for (var body = box2d.world.GetBodyList(); body; body = body.GetNext())
		{
			var entity = body.GetUserData();
			
			if (entity)
			{
				var entityX = body.GetPosition().x * box2d.scale;
				
				if (entityX < 0 || entityX > game.currentLevel.foregroundImage.width || (entity.health && entity.health <= 0))
				{
					box2d.world.DestroyBody(body);
					
					if (entity.type == "villain")
					{
						game.score += entity.calories;
						$('#score').html('Score: ' + game.score);
					}
					
					if (entity.blockBreakSound)
					{
						entity.blockBreakSound.play();
					}
				}
				else
				{
					entities.draw(entity, body.GetPosition(), body.GetAngle())
				}
				
			}
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
		
		if (game.mode == "load-next-hero")
		{
			game.countCharicters();
			
			// if there are no villains remaing in the level the player has won
			if (game.villains.length == 0)
			{
				game.mode = "level-success";
				return;
			}
			
			// if there are no heros in the level and still villains the player has lost
			if (game.heroes.length == 0)
			{
				game.mode = "level-failure";
				return;
			}
			
			// if there are still heros and villans the game is still going
			// if there is no current active hero
			if (!game.currentHero)
			{
				game.currentHero = game.heroes[game.heroes.length - 1];
				game.currentHero.SetPosition({x : 180 / box2d.scale, y : 200 / box2d.scale});
				game.currentHero.SetLinearVelocity({x : 0, y : 0});
				game.currentHero.SetAngularVelocity(0);
				game.currentHero.SetAwake(true);
			}
			else
			{
				game.panTo(game.slingshotX);
				
				// Wait for hero to stop bouncing and return to sleep, then switch to wait-for-firing
				if (!game.currentHero.IsAwake())
				{
					game.mode = "wait-for-firing";
				}
			}
		}  

        if(game.mode == "wait-for-firing")
		{  
            if (mouse.dragging)
			{
				if (game.mouseOnCurrentHero())
				{
					// if the mouse is being clicked and on the current hero
					game.mode = "firing";
				}
				else
				{
					// if the mouse is not over the current hero the screen pans 
					game.panTo(mouse.x + game.offsetLeft)
				}
            }
			else
			{
				game.panTo(game.slingshotX);
            }
        }
		
		if (game.mode == "firing")
		{  
			if (mouse.buttonDown)
			{
				game.panTo(game.slingshotX);
				
				game.currentHero.SetPosition({x : (mouse.x + game.offsetLeft) / box2d.scale, y : mouse.y / box2d.scale});
			}
			else
			{
				game.mode = "fired";
				var impulseScaleFactor = 0.75;
				
				// fires the hero with a force preportional to the distance between the heros center and mouse pointer
				var impulse = new b2Vec2((game.slingshotX + 35 - mouse.x - game.offsetLeft) * impulseScaleFactor, (game.slingshotY + 25 - mouse.y) * impulseScaleFactor);
				game.currentHero.ApplyImpulse(impulse, game.currentHero.GetWorldCenter());
				
				game.slingshotFireSound.play();
			}
        }
        
		if (game.mode == "fired")
		{
			// pan to the location of the current hero
			var heroX = game.currentHero.GetPosition().x * box2d.scale;
			game.panTo(heroX);
			
			// if the hero has stoped moving or is out of bounds
			if (!game.currentHero.IsAwake() || heroX < 0 || heroX > game.currentLevel.foregroundImage.width)
			{
				// remove the current hero and null the pointer
				box2d.world.DestroyBody(game.currentHero);
				game.currentHero = undefined;
				
				// change the mode to load the next hero
				game.mode = "load-next-hero";
			}
		}
		
		if (game.mode == "level-success" || game.mode == "level-failure")
		{
			if (game.panTo(0))
			{
				game.ended = true;
				game.showEndingScreen();
			}
		}
   	},
	
	// counts the numbers of heros and villans still in the level
	countCharicters : function()
	{
		game.heroes = [];
		game.villains = [];
		
		for (var body = box2d.world.GetBodyList(); body; body = body.GetNext())
		{
			var entity = body.GetUserData();
			
			if (entity)
			{
				if (entity.type == "hero")
				{
					game.heroes.push(body);
				}
				else if (entity.type == "villain")
				{
					game.villains.push(body);
				}
				// else ignore the entity as it is an obstical
			}
		}
	},
	
	mouseOnCurrentHero : function()
	{
		if (!game.currentHero)
		{
			return false;
		}
		
		var heroPosition = game.currentHero.GetPosition();
		var distanceSquered = Math.pow((heroPosition.x * box2d.scale) - (mouse.x - game.offsetLeft), 2) + Math.pow((heroPosition.y * box2d.scale) - mouse.y, 2);
		var radiusSquared = Math.pow(game.currentHero.GetUserData().radius, 2);
		
		// if the distance between the cursor and the hero squered is less than or equal than the heros radius returns true
		return (distanceSquered <= radiusSquared);
	},
	
	showEndingScreen :  function()
	{
		if (game.mode == "level-success")
		{
			if (game.currentLevel.number  < levels.data.length -1)
			{
				$('#endingmessage').html('Level Complete! Good job!!');
				$('#playnextlevel').show();
			}
			else
			{
				$('#endingmessage').html('Game Comlete! Well Done!!');
				$('#playnextlevel').hide();
			}
		}
		else if (game.mode == "level-failure")
		{
			$('#endingmessage').html('Level failed. Try again?');
			$('#playnextlevel').hide();
		}
		
		$('#endingscreen').show();
	},
	
	drawSlingshotBand : function()
	{
		// "rgb(68, 31, 11)" is a dark brown colour
		game.context.strokeStyle = "rgb(68, 31, 11)";
		game.context.lineWidth = 6;
		
		// calculate the angle and position the band would need to be drawn at by using the heros offset from
		// the slingshot to find the angle is was draged at and its radius
		var heroRadius = game.currentHero.GetUserData().radius;
		var heroX = game.currentHero.GetPosition().x * box2d.scale;
		var heroY = game.currentHero.GetPosition().y * box2d.scale;
		
		// atan2 is the angle between the posative x axis and the given coordanets
		var angle = Math.atan2(game.slingshotY + (25 - heroY), game.slingshotX + (50 - heroX));
		
		var heroFarEdgeX = heroX - (heroRadius * Math.cos(angle));
		var heroFarEdgeY = heroY - (heroRadius * Math.sin(angle));
		
		// begin drawing the back of the slingshot band
		game.context.beginPath();
		game.context.moveTo(game.slingshotX + (50 - game.offsetLeft), game.slingshotY + 25);
		
		game.context.lineTo(heroX - game.offsetLeft, heroY);
		game.context.stroke();
		
		// draw the hero after the back of the back of the band but before it's frount
		entities.draw(game.currentHero.GetUserData(), game.currentHero.GetPosition(), game.currentHero.GetAngle());
		
		// move the canvas to the edge of the hero and draw a line back to the slingshot
		game.context.beginPath();
		game.context.moveTo(heroFarEdgeX - game.offsetLeft, heroFarEdgeY);
		
		game.context.lineTo((game.slingshotX - game.offsetLeft) + 10, game.slingshotY + 30);
		game.context.stroke();
	},
	
	restartLevel : function()
	{
		// reset the data of the level
		window.cancelAnimationFrame(game.animationFrame);
		game.lastUpdateTime = undefined;
		
		// load the current level again
		levels.load(game.currentLevel.number);
	},
	
	startNextLevel : function()
	{
		// reset the data of the level
		window.cancelAnimationFrame(game.animationFrame);
		game.lastUpdateTime = undefined;
		
		// load the next level in the array
		levels.load(game.currentLevel.number + 1);
	},
	
	startBackgroundMusic : function()
	{
		var toggleImage = $("#togglemusic")[0];
		game.backgroundMusic.play();
		toggleImage.src = "images/icons/sound.png"
	},
	
	stopBackgroundMusic : function()
	{
		var toggleImage = $("#togglemusic")[0];
		toggleImage.src = "images/icons/nosound.png";
		game.backgroundMusic.pause();
		// returns to the begining of the song
		game.backgroundMusic.currentTime = 0;
	},
	
	toggleBackgroundMusic : function()
	{
		var toggleImage = $('#toggleMusic')[0];
		
		if (game.backgroundMusic.paused)
		{
			game.backgroundMusic.play();
			toggleImage.src = "images/icons/sound.png";
		}
		else
		{
			game.backgroundMusic.pause();
			$("#togglemusic")[0].src = "images/icons/nosound.png";
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
			entities : 
			[
				{type : "ground", name : "dirt", x : 500, y : 440, width : 1000, height : 20, isStatic : true},
				{type : "ground", name : "wood", x : 180, y : 390, width : 40, height : 80, isStatic : true},
				
				{type : "block", name : "wood", x : 520, y : 375, angle : 90, width : 100, height : 25},
				{type : "block", name : "glass", x : 520, y : 275, angle : 90, width : 100, height : 25},
				{type : "block", name : "wood", x : 620, y : 375, angle : 90, width : 100, height : 25},
				{type : "block", name : "glass", x : 620, y : 275, angle : 90, width : 100, height : 25},
				
				{type : "villain", name : "burger", x : 520, y : 200, calories : 590},
				{type : "villain", name : "fries", x : 620, y : 200, calories : 420},
				
				{type : "hero", name : "orange", x : 90, y : 410},
				{type : "hero", name : "apple", x : 150, y : 410},
			]
		},
		// seccond level
		{
			foreground : 'desert-foreground',
			background : 'clouds-background',
			entities : 
			[
				{type : "ground", name : "dirt", x : 500, y : 440, width : 1000, height : 20, isStatic : true},
				{type : "ground", name : "wood", x : 180, y : 390, width : 40, height : 80, isStatic : true},
				
				{type : "block", name : "wood", x : 820, y : 375, angle : 90, width : 100, height : 25},
				{type : "block", name : "wood", x : 720, y : 375, angle : 90, width : 100, height : 25},
				{type : "block", name : "wood", x : 620, y : 375, angle : 90, width : 100, height : 25},
				
				{type : "block", name : "glass", x : 670, y : 310, width : 100, height : 25},
				{type : "block", name : "glass", x : 770, y : 310, width : 100, height : 25},
				
				{type : "block", name : "glass", x : 670, y : 248, angle : 90, width : 100, height : 25},
				{type : "block", name : "glass", x : 770, y : 248, angle : 90, width : 100, height : 25},
				
				{type : "block", name : "wood", x : 720, y : 180, width : 100, height : 25},
				
				{type : "villain", name : "burger", x : 715, y : 160, calories : 590},
				{type : "villain", name : "fries", x : 670, y : 400, calories : 420},
				{type : "villain", name : "sodacan", x : 765, y : 395, calories : 150},
				
				{type : "hero", name : "strawberry", x : 40, y : 420},
				{type : "hero", name : "orange", x : 90, y : 410},
				{type : "hero", name : "apple", x : 150, y : 410},
			]
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
		// initialze the box2d data and world
		box2d.init();
		
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
		
		// load the entities for the level (going backwards through the array)
		for (var i = level.entities.length - 1; i >= 0; i--)
		{
			var entity = level.entities[i];
			
			console.log("Creating entity: " + entity.name);
			
			entities.create(entity);
			
			if (entity.shape == undefined)
				console.log("Create entity: " + entity.name + " failed")
		};
		
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






