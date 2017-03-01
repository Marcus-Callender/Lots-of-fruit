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
		var level = maps.singlePlayer[singleplayer.currentLevel];
		
		// prevent the player from entering th emission untill all the assets have been loaded
		$("#entermission").attr("disabled", true);
		
		game.currentMapImage = loader.loadImage(level.mapImage);
		game.currentLevel = level;
		
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
		$('#missonbriefing').html(level.briefing.replace(/\n/g, '<br><br>'));
		$("#missionscreen").show();
	},
};

