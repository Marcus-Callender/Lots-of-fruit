// stores data about all the maps in the game
var maps = 
{
	"singleplayer" : 
	[
		{
			"name" : "Introduction", //"Training Mission",
			"briefing" : "Learn  the basics of last coleny",
			
			"mapImage" : "images/maps/level-one-debug-grid.png",
			"startX" : 4,
			"startY" : 4,
			
			/* what types of objects will be preloaded */
			"requirements" :
			{
				"building" : ["base", "starport", "harvester", "ground-turret"],
				"vehicle" : [],
				"aircraft" : [],
				"terrain" : [],
			},
			
			/* details on the objects that will be pre loaded */
			"items" :
			[
				{"type" : "building", "name" : "base", "x" : 11, "y" : 14, "team" : "blue"},
				{"type" : "building", "name" : "base", "x" : 12, "y" : 16, "team" : "green"},
				// another green building, whos life will start reduced
				{"type" : "building", "name" : "base", "x" : 15, "y" : 15, "team" : "green", "hp" : 50},
				
				{"type" : "building", "name" : "starport", "x" : 18, "y" : 14, "team" : "blue"},
				{"type" : "building", "name" : "starport", "x" : 18, "y" : 10, "team" : "blue", "action" : "teleport"},
				{"type" : "building", "name" : "starport", "x" : 18, "y" : 6, "team" : "green", "action" : "opening"},
				
				{"type" : "building", "name" : "harvester", "x" : 20, "y" : 10, "team" : "blue"},
				{"type" : "building", "name" : "harvester", "x" : 22, "y" : 12, "team" : "green", "action" : "deploy"},
				
				{"type" : "building", "name" : "ground-turret", "x" : 14, "y" : 9, "team" : "blue", "direction" : 3},
				{"type" : "building", "name" : "ground-turret", "x" : 14, "y" : 12, "team" : "green", "direction" : 1},
				{"type" : "building", "name" : "ground-turret", "x" : 16, "y" : 10, "team" : "blue", "action" : "teleport"},
			],
		},
	]
};

