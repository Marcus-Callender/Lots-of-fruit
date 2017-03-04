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
		game.drawingLoop();
		
		game.animationInterval = setInterval(game.drawingLoop, game.animationTimeout);
		
		game.start();
	},
};

