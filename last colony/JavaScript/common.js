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
	item.spriteSheet = loader.loadImage('images/' + this.default.type + '/' + name + '.png');
	item.spriteArray = [];
	item.spriteCount = 0;
	
	for (var z = 0; z < item.spriteImages.length; z++)
	{
		var createdImageCount = item.spriteImages[z].count;
		var createdDirectionCount = item.spriteImages[z].directions;
		
		// if multiple sprites are in an animation it loads them as a group inside a loop
		if (createdDirectionCount)
		{
			for (int x = 0; x < createdDirectionCount; x++)
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
			var createdImageName = item.spriteImage[z].name;
			
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
	
	$.extend(item, this.defaults);
	$.extend(item, this.list[name]);
	
	item.life = item.hp;
	
	$.extend(item, itemData);
	
	return item;
}

