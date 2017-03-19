var mouse =
{
	// the mosses position from the top left of the canvas
	canvasX : 0,
	canvasY : 0,
	
	// the mosses position from the top left of the map
	gameX : 0,
	gameY : 0,
	
	// the grid coordanites the mouse is currently inside
	gridX : 0,
	gridY : 0,
	
	dragX : 0,
	dragY : 0,
	
	isLeftMouseButtonDown : false,
	
	// if the player is selecting with the left mouse button
	dragSelect : false,
	
	isMouseInCanvas : false,
	
	init : function()
	{
		var $mouseCanvas = $("#gameforegroundcanvas");
		
		$mouseCanvas.mousemove(
			function(ev)
			{
				var offset = $mouseCanvas.offset();
				
				mouse.canvasX = ev.pageX - offset.left;
				mouse.canvasY = ev.pageY - offset.top;
				
				mouse.calculateMouseCoordinites();
				
				if (mouse.isLeftMouseButtonDown)
				{
					// if the mouse has been moved more than 4 pixels (x or y) enable drag select
					if (Math.abs(mouse.dragX - mouse.gameX) > 4 || Math.abs(mouse.dragY - mouse.gameY) > 4)
					{
						mouse.dragSelect = true;
					}
					else
					{
						mouse.dragSelect = false;
					}
				}
			}
		);
		
		$mouseCanvas.click(
			function(ev)
			{
				mouse.click(ev, false);
				this.dragSelect = false;
				
				return false;
			}
		);
		
		$mouseCanvas.mousedown(
			function(ev)
			{
				//if (ev.whichMouseButton == 1)
				if (ev.which == 1)
				{
					mouse.isLeftMouseButtonDown = true;
					
					mouse.dragX = mouse.gameX;
					mouse.dragY = mouse.gameY;
					
					ev.preventDefault();
				}
				
				return false;
			}
		);
		
		$mouseCanvas.bind('contextmenu', 
			function()
			{
				mouse.click(ev, true);
				
				return false;
			}
		);
		
		$mouseCanvas.mouseup(
			function(ev)
			{
				var shiftPressed = ev.shiftKey;
				
				//if the left mouse button was relesed
				if (ev.which == 1)
				{
					if (mouse.dragSelect)
					{
						if (!shiftPressed)
						{
							// if the shift key is held retain the previously selected objects
							game.clearSelection();
						}
						
						var left = Math.min(mouse.gameX, mouse.dragX) / game.gridSize;
						var right = Math.max(mouse.gameX, mouse.dragX) / game.gridSize;
						var bottom = Math.max(mouse.gameY, mouse.dragY) / game.gridSize;
						var top = Math.min(mouse.gameY, mouse.dragY) / game.gridSize;
						
						for (var z = 0; z < game.items.length; z++)
						{
							var object = game.items[z];
							
							if (object.type != "building" && object.selectable && item.team == game.team && left <= object.x && right >= object.x)
							{
								if ((object.type == "vehicle" && top <= object.y && bottom >= object.y)
									|| (object.type == "aircraft" && (top <= object.y - object.pixelShadowHeight / game.gridSize) && (bottom >= object.y - object.pixelShadowHeight / game.gridSize)))
								{
									game.selectItem(object, shiftPressed);
								}
							}
						};
					}
					
					mouse.isLeftMouseButtonDown = false;
					mouse.dragSelect = false;
				}
				
				return false;
			}
		);
		
		$mouseCanvas.mouseleave(
			function()
			{
				if (mouse.isMouseInCanvas)
				{
					console.log("mouse left canvas");
				}
				
				mouse.isMouseInCanvas = false;
			}
		);
		
		$mouseCanvas.mouseenter(
			function(ev)
			{
				if (!mouse.isMouseInCanvas)
				{
					console.log("mouse entered canvas");
				}
				
				mouse.isLeftMouseButtonDown = false;
				mouse.isMouseInCanvas = true;
			}
		);
	},
	
	click : function(ev, rightClick)
	{
		var clickedObject = this.itemUnderMouse();
		var shiftPressed = ev.shiftKey;
		
		// if the mouse button clicked was the left mouse button
		if (!rightClick)
		{
			// if there is an object being selected
			if (clickedObject)
			{
				// if the shift key was not pressed clear the currently selected objects
				if (!shiftPressed)
				{
					game.clearSelection();
				}
				
				game.selectItem(clickedObject, shiftPressed);
			}
		}
		else
		{
			// handle giving orderers to the units
		}
	},
	
	drawSelectBox : function()
	{
		if (this.dragSelect)
		{
			// start drawing from the top left of the selct box
			var x = Math.min(this.gameX, this.dragX);
			var y = Math.min(this.gameY, this.dragY);
			
			var width = Math.abs(this.gameX - this.dragX);
			var height = Math.abs(this.gameY - this.dragY);
			
			game.foregroundContext.strokeStyle = 'white';
			game.foregroundContext.strokeRect(x - game.offsetX, y - game.offsetY, width, height);
		}
	},
	
	calculateMouseCoordinites : function()
	{
		mouse.gameX = mouse.canvasX + game.offsetX;
		mouse.gameY = mouse.canvasY + game.offsetY;
		
		mouse.gridX = Math.floor((mouse.gameX) / game.gridSize);
		mouse.gridY = Math.floor((mouse.gameY) / game.gridSize);
	},
	
	objectInSelectionBox : function(object)
	{
		if (object.x <= ((mouse.gameX) / game.gridSize))
		{	
			if (object.x >= ((mouse.gameX - object.baseWidth) / game.gridSize))
			{
				if (object.y <= ((mouse.gameY) / game.gridSize))
				{
					if (object.y >= ((mouse.gameX - object.baseHeight) / game.gridSize))
					{
						return true;
					}
				}
			}
		}
		
		return false;
	},
	
	objectInSelectionRadius : function(object)
	{
		squeredXDistacne = Math.pow(object.x - (mouse.gameX / game.gridSize), 2);
		squeredYDistacne = Math.pow(object.y - (mouse.gameY / game.gridSize), 2);
		
		if (object.type == "aircraft")
		{
			squeredYDistacne = Math.pow(object.y - (mouse.gameY + item.pixelShadowHeight) / game.gridSize, 2);
		}
		
		squeredObjectRadius = Math.pow((object.radius) / game.gridSize, 2)
		
		if (squeredXDistacne + squeredYDistacne < squeredObjectRadius)
		{
			return true;
		}
		
		return false;
	},
	
	itemUnderMouse : function()
	{
		for (var z = 0; z < game.items.length; z++)
		{
			var object = game.items[z];
			
			if (object.type == "building" || object.type == "terrain")
			{
				if (object.lifeState != "dead" && mouse.objectInSelectionBox(object))
				{
					return object;
				}
			}
			/*else if (object.type == "aircraft")
			{
				if (object.lifeState == "dead" && objectInSelectionRadius(object))
				{
					return item;
				}					
			}*/
			else
			{
				if (object.lifeState == "dead" && objectInSelectionRadius(object))
				{
					return item;
				}
			}
		}
	},
}

