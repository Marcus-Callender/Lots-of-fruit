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
		var $mouseCanvas = $("gameforegroundcanvas");
		
		$mouseCanvas.mousemove(
			function(ev)
			{
				var offset = $mouseCanvas.offset();
				
				this.canvasX = ev.pageX - offset.left;
				this.canvasY = ev.pageY - offset.top;
				
				this.calculateMouseCoordinites();
				
				if (this.isLeftMouseButtonDown)
				{
					// if the mouse has been moved more than 4 pixels (x or y) enable drag select
					if (Math.abs(this.dragX - this.gameX) > 4 || Math.abs(this.dragY - this.gameY) > 4)
					{
						this.dragSelect = true;
					}
					else
					{
						this.dragSelect = false;
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
				if (ev.whichMouseButton == 1)
				{
					this.isLeftMouseButtonDown = true;
					
					this.dragX = this.gameX;
					this.dragY = this.gameY;
					
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
				
				if (ev.whichMouseButton == 1)
				{
					this.isLeftMouseButtonDown = false;
					this.dragSelect = false;
				}
				
				return false;
			}
		);
		
		$mouseCanvas.mouseleave(
			function()
			{
				this.isMouseInCanvas = false;
			}
		);
		
		$mouseCanvas.mouseenter(
			function(ev)
			{
				this.isLeftMouseButtonDown = false;
				this.isMouseInCanvas = true;
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
		this.gameX = this.canvasX + game.offsetX;
		this.gameY = this.canvasY + game.offsetY;
		
		this.gridX = Math.floor((this.gameX)/ game.gridSize);
		this.gridY = Math.floor((this.gameY)/ game.gridSize);
	},
}

