var singleplayer =
{
	currentLevel : 0,
	
	start : function()
	{
		$('.gamelayer').hide();
		
		// sets nececary data before starting the level
		singleplayer.currentLevel = 0;
		game.type = "singleplayer";
		game.team = "blue";
		
		singleplayer.startCurrentLevel();
	},
	
	exit : function()
	{
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
	},
	
	startCurrentLevel : function()
	{
		// load all the items for the current level
		var level = maps.singleplayer[singleplayer.currentLevel];
		
		// prevent the player from entering th emission untill all the assets have been loaded
		$("#entermission").attr("disabled", true);
		
		game.currentMapImage = loader.loadImage(level.mapImage);
		game.currentLevel = level;
		
		// places the offset to the level.start number of grid spaces
		game.offsetX = level.startX * game.gridSize;
		game.offsetY = level.startY * game.gridSize;
		
		// clear all the data
		game.reset();
		
		for (var type in level.requirements)
		{
			console.log("Requirements: " + level.requirements);
			console.log("Type: " + type);
			console.log("Requirement type: " + level.requirements[type]);
			
			var requirementsArray = level.requirements[type];
			
			console.log("requirements array: " + requirementsArray);
			
			for (var z = 0; z < requirementsArray.length; z++)
			{
				var name = requirementsArray[z];
				
				if (window[type])
				{
					// loads the data using the appropriate load method
					window[type].load(name)
				}
				else
				{
					console.log('Error: failed to load asset of type: ' + type);
				}
			};
		}
		
		for (var z = level.items.length - 1; z >= 0; z--)
		{
			// adds all of the assets that have just been loaded to the game object
			var itemDetails = level.items[z];
			game.add(itemDetails);
		}
		
		// remove the block for entering the level once th eloader has finished loading the assets
		if (loader.loaded)
		{
			$("#entermission").removeAttr("disabled");
		}
		else 
		{
			loader.onload =
			function()
			{
				$("#entermission").removeAttr("disabled");
			}
		}
		
		// load and show the misssion briefing screen with the current missions briefing
		//$('#missonbriefing').html(level.briefing.replace(/\n/g, '<br><br>'));
	    $('#missonbriefing').html(level.briefing.replace('\n','<br><br>'));    
		$("#missionscreen").show();
	},
	
	play : function()
	{
		game.animate();
		
		game.animationInterval = setInterval(game.animate, game.animationTimeout);
		
		game.start();
	},
};

