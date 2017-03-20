var vehicle =
{
	list :
	{
		"transport" :
		{
			name : "transport",
			
			pixelWidth : 31,
			pixelHeight : 30,
			pixelOffsetX : 15,
			pixelOffsetY : 15,
			
			radius : 15,
			movmentSpeed : 15,
			turnSpeed : 2,
			
			sight : 3,
			cost : 400,
			baseHP : 100,
			
			spriteImages :
			[
				{name : "normal", count : 1, directions : 8},
			],
		},
		
		"harvester" :
		{
			name : "harvester",
			
			pixelWidth : 21,
			pixelHeight : 20,
			pixelOffsetX : 10,
			pixelOffsetY : 10,
			
			radius : 10,
			movmentSpeed : 10,
			turnSpeed : 2,
			
			sight : 3,
			cost : 1600,
			baseHP : 50,
			
			spriteImages :
			[
				{name : "normal", count : 1, directions : 8},
			],
		},
		
		"scout-tank" :
		{
			name : "scout-tank",
			
			canAttackGround : true,
			canAttackAir : false,
			bulettType : "bullet",
			
			pixelWidth : 21,
			pixelHeight : 21,
			pixelOffsetX : 10,
			pixelOffsetY : 10,
			
			radius : 11,
			movmentSpeed : 20,
			turnSpeed : 4,
			
			sight : 4,
			cost : 500,
			baseHP : 50,
			
			spriteImages :
			[
				{name : "normal", count : 1, directions : 8},
			],
		},
		
		"heavy-tank" :
		{
			name : "heavy-tank",
			
			canAttackGround : true,
			canAttackAir : false,
			bulettType : "cannon ball",
			
			pixelWidth : 30,
			pixelHeight : 30,
			pixelOffsetX : 15,
			pixelOffsetY : 15,
			
			radius : 13,
			movmentSpeed : 15,
			turnSpeed : 4,
			
			sight : 5,
			cost : 1200,
			baseHP : 50,
			
			spriteImages :
			[
				{name : "normal", count : 1, directions : 8},
			],
		},
	},
	
	load : loadItem,
	add : addItem,
	
	defaults :
	{
		type : "vehicle",
		animationIndex : 0,
		direction : 0,
		
		orders :
		{
			type : "stand",
		},
		
		action : "stand",
		selected : false,
		selectable : true,
		directions : 8,
		
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
					this.imageList = this.spriteArray["normal : " + this.direction];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					//this.animationIndex++;
					
					// once the animation has finished it is reverted back to the begining to loop it
					/*if (this.animationIndex >= this.imageList.count)
					{
						this.animationIndex = 0;
					}*/
					
					break;
			}
		},
		
		// default function for drawing any vehicle
		draw : function()
		{
			var x = ((this.x * game.gridSize) - game.offsetX) - this.pixelOffsetX;
			var y = ((this.y * game.gridSize) - game.offsetY) - this.pixelOffsetY;
			
			this.drawingX = x;
			this.drawingY = y;
			
			if (this.selected)
			{
				this.drawSelectionBorder();
				this.drawLifeBar();
			}
			
			// decides which row to read the sprites from 0 = blue 1 = green
			var colourIndex = (this.team == "blue") ? 0 : 1;
			var colourOffset = colourIndex * this.pixelHeight;
			
			game.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth,
				colourOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
		},
		
		drawLifeBar : function()
		{
			var xPos = this.drawingX;
			var yPos = this.drawingY - (2 * game.lifeBarHeight);
			
			// sets the life bar to green when the building is normal and red when it is bellow 40%
			game.foregroundContext.fillStyle = (this.lifeState == "normal") ? game.healthBarHealthyFillColour : game.healthBarDamagedFillColour;
			
			// draws the life bar
			game.foregroundContext.fillRect(xPos, yPos, this.baseWidth * (this.hp / this.baseHP) , game.lifeBarHeight);
			
			// sets the context for drawing the life bar border
			game.foregroundContext.strokeStyle = game.healthBarBorderColour;
			game.foregroundContext.lineWidth = 1;
			
			// draws a border arround the life bar
			game.foregroundContext.strokeRect(xPos, yPos, this.baseWidth, game.lifeBarHeight);
		},
		
		drawSelectionBorder : function()
		{
			var xPos = this.drawingX + this.pixelOffsetX;
			var yPos = this.drawingY + this.pixelOffsetY;
			
			game.foregroundContext.strokeStyle = game.selectionBorderColour;
			game.foregroundContext.lineWidth = 1;
			
			game.foregroundContext.beginPath();
			game.foregroundContext.arc(xPos, yPos, this.radius, 0, Math.PI * 2, false);
			game.foregroundContext.fillStyle = game.selectionFillColour;
			game.foregroundContext.fill();
			game.foregroundContext.stroke();
		},
	},
}

