// run when the code is loaded and sets up the requestAnimationFrame and cancelAnimationFrame functions
(function() {
	var lastTime = 0;
	var vendors = ['ms', ';', 'webkit', 'o'];
	
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
	{
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	
	if (!window.requestAnimationFrame)
	{
		window.requestAnimationFrame = function(callback, element)
		{
			var currentTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
			
			var id = window.setTimeout(
			function()
			{
				callback(currentTime - lastTime);
			}, timeToCall);
			
			lastTime = currentTime + timeToCall;
			return id;
		};
	}
	
	if (!window.cancelAnimationFrame)
	{
		window.cancelAnimationFrame = function(id)
		{
			clearTimeout(id);
		};
	}
}());

var loader = 
{
	loaded : true,
	assetsLoadedCount : 0,
	totalassetsCount : 0,
	
	soundFileExtn : ".ogg",
	
	init : function()
	{
		// checks the compatibility with audio filetypes
		var mpsSupport, oggSupport;
		var audio = document.createElement('audio');
		
		if (audio.canPlayType)
		{
			// canPlayType will return "", "mayby" or "probably"
			mp3Support = ("" != audio.canPlayType('audio/mpeg'));
			oggSupport = ("" != audio.canPlayType('audio/ogg; codecs = "vorbis"'));
		}
		else
		{
			mp3Support = false;
			oggSupport = false;
		}
		
		// check for ogg and mp3 support, if nither are true set the type to undefined
		loader.soundFileExtn = oggSupport ? ".ogg" : (mp3Support ? "mp3" : undefined);
	},
	
	loadImage : function(url)
	{
		this.totalassetsCount++;
		this.loaded = false;
		$('#loadingscreen').show();
		var image = new Image();
		image.src = url;
		image.onload = loader.itemLoaded;
		return image;
	},
	
	loadSound : function(url)
	{
		this.totalassetsCount++;
		this.loaded = false;
		$('#loadingscreen').show();
		var audio = new Audio();
		audio.src = url + loader.soundFileExtn;
		audio.addEventListener("canplaythrough", loader.itemLoaded, false);
		return audio;
	},
	
	itemLoaded : function()
	{
		loader.assetsLoadedCount++;
		$('#loadingmessage').html('Loaded ' + loader.assetsLoadedCount + ' of ' + loader.totalassetsCount);
		
		// if true all assets have been loaded
		if (loader.assetsLoadedCount === loader.totalassetsCount)
		{
			loader.loaded = true;
			$('#loadingscreen').hide();
			
			// if the loader.onload method has been assigned, run it then unasign it
			if (loader.onload)
			{
				loader.onload();
				loader.onload = undefined;
			}
		}
	}
}

function loadItem(name)
{
	var item = this.list[name];
	
	// if the nesacery sprite array already exsists there is no need to create it again
	if (item.spriteArray)
	{
		return;
	}
	
	// creates default data to use
	item.spriteSheet = loader.loadImage('images/' + this.defaults.type + '/' + name + '.png');
	item.spriteArray = [];
	item.spriteCount = 0;
	
	for (var z = 0; z < item.spriteImages.length; z++)
	{
		var createdImageCount = item.spriteImages[z].count;
		var createdDirectionCount = item.spriteImages[z].directions;
		
		// if the sprite has multiple directions these are loaded as a  group inside the for loop
		if (createdDirectionCount)
		{
			for (var x = 0; x < createdDirectionCount; x++)
			{
				var createdImageName = item.spriteImages[z].name + " : " + x;
				
				item.spriteArray[createdImageName] = 
				{
					name : createdImageName,
					count : createdImageCount,
					offset : item.spriteCount,
				};
				
				item.spriteCount += createdImageCount;
			};
		}
		else
		{
			var createdImageName = item.spriteImages[z].name;
			
			item.spriteArray[createdImageName] =
			{
				name : createdImageName,
				count : createdImageCount,
				offset : item.spriteCount,
			};
			
			item.spriteCount += createdImageCount;
		}
	}
}

function addItem(itemData)
{
	var item = {};
	var name = itemData.name;
	
	// applies the default values to the object
	$.extend(item, this.defaults);
	$.extend(item, this.list[name]);
	
	item.hp = item.baseHP;
	
	// applies any additional data passed as a paramiter
	$.extend(item, itemData);
	
	return item;
}

/* Mathmatical functions for turning and moving units */

// gets values between 0 & directions
function findAngle(unit1, unit2, directions)
{
	var diffrenceX = unit1.x - unit2.x;
	var diffrenceY = unit1.y - unit2.y;
	
	// TODO: put more brackets in this
	var angle = wrapDirection(directions / 2 - (Math.atan2(diffrenceX, diffrenceY) * directions / (2 * Math.PI)), directions);
	
	return angle;
}

// returns the minimum angle between 2 angles between -directions / 2 to directions / 2
function angleDiff(angle1, angle2, directions)
{
	if (angle1 >= directions / 2)
	{
		angle1 -= directions;
	}
	
	if (angle2 >= directions / 2)
	{
		angle2 -= directions;
	}
	
	diffrence = angle2 - angle1;
	
	if (diffrence < -diffrence / 2)
	{
		diffrence += directions;
	}
	
	if (diffrence > directions / 2)
	{
		diffrence - directions;
	}
	
	return diffrence;
}

// returns a value between 0 and directions - 1
function wrapDirection(direction, directions)
{
	var tempDir = Math.round(direction);
	
	if (tempDir % 1 != 0)
	{
		console.log("DIRECTION NOT INT");
	}
	
	if (tempDir < 0)
	{
		tempDir += directions;
	}
	
	if (tempDir > directions - 1)
	{
		tempDir -= directions;
	}
	
	return tempDir;
}

