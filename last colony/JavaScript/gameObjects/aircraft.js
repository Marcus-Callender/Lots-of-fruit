var aircraft =
{
	list :
	{
		"chopper" :
		{
			name : "chopper",
			
			canAttackGround : true,
			canAttackAir : true,
			bulettType : "heatseeker",
			
			pixelWidth : 40,
			pixelHeight : 40,
			pixelOffsetX : 20,
			pixelOffsetY : 20,
			
			radius : 18,
			movmentSpeed : 25,
			turnSpeed : 4,
			
			sight : 6,
			cost : 900,
			baseHP : 50,
			
			pixelShadowHeight : 40,
			
			spriteImages :
			[
				{name : "fly", count : 4, directions : 8},
			],
		},
		
		"wraith" :
		{
			name : "wraith",
			
			canAttackGround : false,
			canAttackAir : true,
			bulettType : "fireball",
			
			pixelWidth : 30,
			pixelHeight : 40,
			pixelOffsetX : 15,
			pixelOffsetY : 15,
			
			radius : 15,
			movmentSpeed : 40,
			turnSpeed : 4,
			
			sight : 8,
			cost : 600,
			baseHP : 50,
			
			pixelShadowHeight : 40,
			
			spriteImages :
			[
				{name : "fly", count : 1, directions : 8},
			],
		},
	},
	
	load : loadItem,
	add : addItem,
	
	defaults :
	{
		type : "aircraft",
		animationIndex : 0,
		direction : 0,
		
		orders :
		{
			type : "fly",
		},
		
		action : "fly",
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
				case "fly" :
					this.imageList = this.spriteArray["fly : " + this.direction];
					this.imageOffset = this.imageList.offset + this.animationIndex;
					this.animationIndex++;
					
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
			var y = ((this.y * game.gridSize) - game.offsetY) - this.pixelOffsetY - this.pixelShadowHeight;
			
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
			
			// this is the position of the shadow on the sprite sheet
			var shadowOffset = this.pixelHeight * 2;
			
			game.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth,
				colourOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
				
			// this draws the aircrafts shadow on the ground
			game.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth,
				shadowOffset, this.pixelWidth, this.pixelHeight, x, (y + this.pixelShadowHeight), this.pixelWidth, this.pixelHeight);
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
			game.foregroundContext.lineWidth = 2;
			
			game.foregroundContext.beginPath();
			game.foregroundContext.arc(xPos, yPos, this.radius, 0, Math.PI * 2, false);
			game.foregroundContext.stroke();
			
			game.foregroundContext.fillStyle = game.selectionFillColour;
			game.foregroundContext.fill();
			
			game.foregroundContext.beginPath();
			game.foregroundContext.arc(xPos, yPos + this.pixelShadowHeight, 4, 0, Math.PI * 2, false);
			game.foregroundContext.stroke();
			
			game.foregroundContext.beginPath();
			game.foregroundContext.moveTo(xPos, yPos);
			game.foregroundContext.lineTo(xPos, yPos + this.pixelShadowHeight);
			game.foregroundContext.stroke();
		},
	},
}

