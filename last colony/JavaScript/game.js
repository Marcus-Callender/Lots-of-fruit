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
	
	reset : function()
	{
		game.counter = 1;
		
		game.items = [];
		
		game.sortedItems = [];
		
		game.building = [];
		game.vehicle = [];
		game.aircraft = [];
		game.terrain = [];
		
		game.triggeredEvents = [];
		game.selectedItems = [];
		
		game.sortedItems = [];
	},
	
	add : function(itemData)
	{
		// asign the item with a uniqueID
		if (!itemData.ID)
		{
			itemData.ID = game.counter;
			game.counter++;
		}
		
		// a refrence to the rrtuen value of adding the item to the window
		var itemRef = window[itemData.type].add(itemData);
		
		// store this item refrence in a genral array for use later
		game.items.push(itemRef);
		
		// also send a refrence to a spesific array array for more spsific uses
		game[itemRef.type].push(itemRef);
		
		return itemRef;
	},
	
	remove : function(itemData)
	{
		// unselect the object to ensure the player can't contol a non existant object
		itemData.selected = false;
		
		// loop over the selected items array
		for (var z = 0; z < game.selectedItems.length; z++)
		{
			// compare the current items ID and the item to removes ID, if they match they are the same item
			if (game.selectedItems[z].ID == itemData.ID)
			{
				// if the IDs match remove that item and exit the loop
				game.selectedItems.splice(z, 1);
				break;
			}
		};

		// repeat the loop fore the gental items array
		for (var z = 0; z < game.items.length; z++)
		{
			// compare the current items ID and the item to removes ID, if they match they are the same item
			if (game.items[z].ID == itemData.ID)
			{
				// if the IDs match remove that item and exit the loop
				game.items.splice(z, 1);
				break;
			}
		};
		
		// repeat again for the type spsific array it would be found in
		
		for (var z = 0; z < game[itemData.type].length; z++)
		{
			// compare the current items ID and the item to removes ID, if they match they are the same item
			if (game[itemData.type][z].ID == itemData.ID)
			{
				// if the IDs match remove that item and exit the loop
				game[itemData.type].splice(z, 1);
				break;
			}
		};
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
		
		game.foregroundContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
		
		mouse.drawSelectBox();
		
		if (game.running)
		{
			// call the drawing loop for the next frame using requestAnimationFrame
			requestAnimationFrame(game.drawingLoop);
		}
	},
}

