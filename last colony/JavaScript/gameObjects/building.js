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
			baseHP : 500,
			cost : 5000,
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "normal", count : 4},
				{name : "damaged", count : 1},
				{name : "building", count : 3},
			],
			
		},
		
		"startport" :
		{
			name : "startport",
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 40,
			pixelHeight : 60,
			baseWidth : 40,
			baseHeight : 55,
			pixelOffsetX : 1,
			pixelOffsetY : 5,
			
			// data for pathfinding for units to navigate arround the base
			buildableGrid :
			[
				[1, 1],
				[1, 1],
				[1, 1],
			],
			
			passableGrid :
			[
				[1, 1],
				[0, 0],
				[0, 0],
			],
			
			// data for the objects in game usefulness
			sight : 3,
			baseHP : 300,
			cost : 2000,
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "teleport", count : 9},
				{name : "closing", count : 18},
				{name : "normal", count : 4},
				{name : "damaged", count : 1},
			],
			
		},
	},
	
	load : loadItem,
	add : addItem,
	
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
			// checks if the entity has no health and should be removed
			if (this.hp <= 0)
			{
				this.lifeState = "dead";
				game.remove(this);
				return;
			}
			
			// display the normal state if the buildings life is above 40%
			if (this.hp > this.baseHP * 0.4)
			{
				this.lifeState = "normal";
			}
			else
			{
				this.lifeState = "damaged";
			}
			
			switch(this.action)
			{
				case "stand" :
					this.imageList = this.spriteArray[this.lifeState];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// once the animation has finished it is reverted back to the begining to loop it
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
					}
					
					break;
					
				case "building" :
					this.imageList = this.spriteArray["building"];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// if the building animation has finished the animation reverts to normal
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
						this.action =  "stand";
					}
					
					break;
					
				case "teleport" :
					this.imageList = this.spriteArray["teleport"];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// once the teleport animation has finished move to the appropriate animation
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
						
						/*this.action = "stand";*/
						
						if (this.canAttack)
						{
							this.action = "guard";
						}
						else
						{
							this.action = "stand";
						}
					}
					
					break;
					
				case "closeing" :
					this.imageList = this.spriteArray["closeing"];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// change the animation to standing when the animation has finished
					if (this.animationIndex >= this.imageList.count)
					{
						animationIndex = 0;
						this.action = "standing";
					}
					
					break;
					
				case "closing" :
					this.imageList = this.spriteArray["closeing"];
					this.imageOffset = this.imageOffset + this.animationIndex;
					this.animationIndex++;
					
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
						this.action = "standing";
					}
					
					break;
					
				case "opening" :
					this.imageList = this.spriteArray["opening"];
					
					// by reversing the imageOffset you are reversing the animation, making this the reverse of the closing animation
					this.imageOffset = (this.imageList.offset + this.imageList.count) - this.animationIndex;
					
					this.animationIndex++;
					
					// change to the closing animation after this animation has finished
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
						this.action = "closeing";
					}
					
					break;
			}
		},
		
		// default function for drawing any building
		draw : function()
		{
			var x = ((this.x * game.gridSize) - game.offsetX) - this.pixelOffsetX;
			var y = ((this.y * game.gridSize) - game.offsetY) - this.pixelOffsetY;
			
			// decides which row to read the sprites from 0 = blue 1 = green
			var colourIndex = (this.team == "blue") ? 0 : 1;
			var colourOffset = colourIndex * this.pixelHeight;
			
			game.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth,
				colourOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
		},
	},
}

