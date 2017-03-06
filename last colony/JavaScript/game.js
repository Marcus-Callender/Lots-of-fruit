$(window).load(
	function()
	{
		game.init();
	}
);

var game = 
{
	// the map is made up of tiles of this size in pixels (20 x 20 px)
	gridSize : 20,
	
	// if true the background has been moved and need to be redrawn at its new loaction
	backgroundMoved : true,
	
	// A control loop that runs at a fixed period of time
	// exicute animation code every 100 milisecons
	animationTimeout : 100,
	
	// the ammount the camera has been moved
	offsetX : 0,
	offsetY : 0,
	
	// the distance the mouse needs to be from the edge of the canvas for the panning to start
	startPanningThreshold : 60,
	panningSpeed : 10,
	
	init : function()
	{
		// preload necicery assets
		loader.init();
		
		mouse.init();
		
		$('.gamelayer').hide();
		$('#gamestartscreen').show();
		
		game.backgroundCanvas = document.getElementById('gamebackgroundcanvas');
		game.backgroundContext = game.backgroundCanvas.getContext('2d');
		
		game.foregroundCanvas = document.getElementById('gameforegroundcanvas');
		game.foregroundContext = game.foregroundCanvas.getContext('2d');
		
		game.canvasWidth = game.backgroundCanvas.width;
		game.canvasHeight = game.backgroundCanvas.height;
	},
	
	start : function()
	{
		$('.gamelayer').hide();
		$('#gameinterfacescreen').show();
		game.running = true;
		game.refreshBackground = true;
		
		game.drawingLoop();
	},
	
	animation : function()
	{
		// To be implemented
	},
	
	handlePanning : function()
	{
		// if the mouse is not inside the canvas leave imidietly
		if (!mouse.isMouseInCanvas)
		{
			return;
		}
		
		if (mouse.canvasX <= game.startPanningThreshold)
		{
			if (game.offsetX >= game.panningSpeed)
			{
				game.refreshBackground = true;
				game.offsetX -= game.panningSpeed;
			}
		}
		else if (mouse.canvasX >= game.canvasWidth - game.startPanningThreshold)
		{
			if (game.offsetX + game.canvasWidth  + game.panningSpeed <= game.currentMapImage.width)
			{
				game.refreshBackground = true;
				game.offsetX += game.panningSpeed;
			}
		}
		
		if (mouse.canvasY <= game.startPanningThreshold)
		{
			if (game.offsetY >= game.panningSpeed)
			{
				game.refreshBackground = true;
				game.offsetY -= game.panningSpeed;
			}
		}
		else if (mouse.canvasY >= game.canvasHeight - game.startPanningThreshold)
		{
			if (game.offsetY + game.canvasHeight  + game.panningSpeed <= game.currentMapImage.height)
			{
				game.refreshBackground = true;
				game.offsetY += game.panningSpeed;
			}
		}
		
		if (this.refreshBackground)
		{
			// update the mouse values if the background has changed location
			mouse.calculateMouseCoordinites();
		}
	},
	
	drawingLoop : function()
	{
		// handle panning the camera
		game.handlePanning();
		
		// if the background needs to be refreshed draw the image at its new position then agnowlage it has been refreshed
		// this reduces the workload of constantly redrawing the background
		if (game.refreshBackground)
		{
			game.backgroundContext.drawImage(game.currentMapImage, game.offsetX, game.offsetY,
				game.canvasWidth, game.canvasHeight, 0, 0, game.canvasWidth, game.canvasHeight);
				
			game.refreshBackground = false;
		}
		
		mouse.drawSelectBox();
		
		if (game.running)
		{
			// call the drawing loop for the next frame using requestAnimationFrame
			requestAnimationFrame(game.drawingLoop);
		}
	},
}

