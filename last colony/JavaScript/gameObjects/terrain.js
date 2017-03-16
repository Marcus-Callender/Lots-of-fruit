var terrain =
{
	list :
	{
		"oilfield" :
		{
			name : "oilfield",
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 40,
			pixelHeight : 60,
			baseWidth : 40,
			baseHeight : 20,
			pixelOffsetX : 0,
			pixelOffsetY : 40,
			
			// data for pathfinding for units to navigate arround the base
			buildableGrid :
			[
				[1, 1],
			],
			
			passableGrid :
			[
				[1, 1],
			],
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "default", count : 1},
				{name : "hint", count : 1},
			],
			
		},
		
		"bigRocks" :
		{
			name : "bigRocks",
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 40,
			pixelHeight : 70,
			baseWidth : 40,
			baseHeight : 40,
			pixelOffsetX : 0,
			pixelOffsetY : 30,
			
			// data for pathfinding for units to navigate arround the base
			buildableGrid :
			[
				[1, 1],
				[0, 1],
			],
			
			passableGrid :
			[
				[1, 1],
				[0, 1],
			],
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "default", count : 1},
			],
			
		},
		
		"smallRocks" :
		{
			name : "smallRocks",
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 20,
			pixelHeight : 35,
			baseWidth : 20,
			baseHeight : 20,
			pixelOffsetX : 0,
			pixelOffsetY : 15,
			
			// data for pathfinding for units to navigate arround the base
			buildableGrid :
			[
				[1],
			],
			
			passableGrid :
			[
				[1],
			],
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "default", count : 1},
			],
			
		},
	},
	
	load : loadItem,
	add : addItem,
	
	defaults :
	{
		type : "terrain",
		animationIndex : 0,
		
		action : "default",
		selected : false,
		selectable : false,
		
		// default function for animating any building
		animate : function()
		{
			switch(this.action)
			{
				case "default" :
					this.imageList = this.spriteArray["default"];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// once the animation has finished it is reverted back to the begining to loop it
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
					}
					
					break;
					
				case "hint" :
					this.imageList = this.spriteArray["hint"];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// if the building animation has finished the animation reverts to normal
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
					}
					
					break;
			}
		},
		
		// default function for drawing any building
		draw : function()
		{
			var x = ((this.x * game.gridSize) - game.offsetX) - this.pixelOffsetX;
			var y = ((this.y * game.gridSize) - game.offsetY) - this.pixelOffsetY;
			
			// terrain dosen't belong to any team
			var colourOffset = 0;
			
			game.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth,
				colourOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
		},
	},
}

