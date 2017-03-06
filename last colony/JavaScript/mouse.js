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
				thiss.dragSelect = false;
				
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
			function()
			{
				var shiftPressed = ev.shiftKey;
				
				//if (ev.whichMouseButton == 1)
				if (ev.which == 1)
				{
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
		// TODO implement
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
}

