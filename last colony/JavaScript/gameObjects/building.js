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
		
		"starport" :
		{
			name : "starport",
			
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
				{name : "closeing", count : 18},
				{name : "normal", count : 4},
				{name : "damaged", count : 1},
			],
			
		},
		
		"harvester" :
		{
			name : "harvester",
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 40,
			pixelHeight : 60,
			baseWidth : 40,
			baseHeight : 20,
			pixelOffsetX : -2,
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
			
			// data for the objects in game usefulness
			sight : 3,
			baseHP : 300,
			cost : 5000,
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "deploy", count : 17},
				{name : "normal", count : 3},
				{name : "damaged", count : 1},
			],
			
		},
		
		"ground turret" :
		{
			name : "ground turret",
			
			//canAttack : true,
			canAttackGround : true,
			canAttackAir : false,
			
			bulettType : "cannon ball",
			
			// this is the default action for attacking units
			// unlike stand it takes direction into account when drawing the unit
			action : "guard",
			
			direction : 0,
			numDirections : 8,
			
			orders : {type : "guard"},
			
			// data required to draw the object from the sprite sheet
			pixelWidth : 38,
			pixelHeight : 32,
			baseWidth : 20,
			baseHeight : 18,
			pixelOffsetX : 9,
			pixelOffsetY : 12,
			
			// data for pathfinding for units to navigate arround the base
			buildableGrid :
			[
				[1],
			],
			
			passableGrid :
			[
				[1],
			],
			
			// data for the objects in game usefulness
			sight : 5,
			baseHP : 200,
			cost : 1500,
			
			// data for the animations the building has
			spriteImages :
			[
				{name : "teleport", count : 9},
				// the directions filed is used to load all the directions from the sprite sheet
				{name : "normal", count : 1, directions : 8},
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
						
						if (this.canAttackAir || this.canAttackGround)
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
						this.animationIndex = 0;
						this.action = "stand";
					}
					
					break;
					
				case "opening" :
					this.imageList = this.spriteArray["closeing"];
					//this.imageOffset = this.imageList.offset + this.animationIndex;
					this.imageOffset = this.imageList.offset + this.imageList.count - this.animationIndex;
					this.animationIndex++;
					
					// change the animation to standing when the animation has finished
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
						this.action = "closeing";
					}
					
					break;
					
				case "deploy" :
					this.imageList = this.spriteArray["deploy"];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
					// change the animation to standing when the animation has finished
					if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
						this.action = "stand";
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

