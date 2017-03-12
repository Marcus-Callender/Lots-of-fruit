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
				"building" : ["base"],
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
				{"type" : "building", "name" : "base", "x" : 15, "y" : 15, "team" : "green", "life" : 50},
			],
		},
	]
};

