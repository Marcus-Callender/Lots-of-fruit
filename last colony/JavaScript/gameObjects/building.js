var building =
{
	list :
	{
		"base" :
		{
			name : "base",
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 60,
			pixelHeight : 60,
			baseWidth : 40,
			baseHeight : 40,
			pixelOffsetX : 0,
			pixelOffsetY : 20,
			
			// data for pathfinding for units to navigate arround the base
			buildableGrid :
			[
				[1, 1],
				[1, 1],
			],
			
			passableGrid :
			[
				[1, 1],
				[1, 1],
			],
			
			// data for the objects in game usefulness
			sight : 3,
			hitPoints : 500,
			cost : 5000,
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "normal", count : 4},
				{name : "damaged", count : 4},
				{name : "building", count : 4},
			],
			
		},
	},
	
	defaults :
	{
		type : "building",
		animationIndex : 0,
		direction : 0,
		
		orders :
		{
			type : "stand",
		},
		
		action : "stand",
		selected : false,
		selectable : true,
		
		// default function for animating any building
		animate : function()
		{
			
		},
		
		// default function for drawing any building
		draw : function()
		{
			
		},
	},
	
	load : loadItem,
	add : addItem,
}

