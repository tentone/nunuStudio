"use strict";

function AudioPlayer(parent)
{
	Element.call(this, parent);

	//WebAudio context
	this.context = THREE.AudioContext.getContext();

	this.element.style.overflow = "visible";

	//Timer
	this.timer = document.createElement("div");
	this.timer.style.position = "absolute";
	this.timer.style.display = "flex";
	this.timer.style.justifyContent = "center";
	this.timer.style.alignItems = "center";
	this.timer.style.width = "40px";
	this.timer.style.height = "100%";
	this.timer.style.right = "0px";
	this.timer.innerHTML = "00:00";
	this.element.appendChild(this.timer);

	//Button
	this.button = document.createElement("button");
	this.button.style.position = "absolute";
	this.button.style.cursor = "pointer";
	this.button.style.background = "transparent";
	this.button.style.border = "none";
	this.button.style.outline = "none";
	this.element.appendChild(this.button);

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.left = "15%";
	this.icon.style.top = "15%";
	this.icon.style.width = "70%";
	this.icon.style.height = "70%";
	this.icon.src = Editor.filePath + "icons/misc/play.png";
	this.button.appendChild(this.icon);

	//Track
	this.track = document.createElement("div");
	this.track.style.position = "absolute";
	this.track.style.backgroundColor = Editor.theme.audioTrack;
	this.track.style.cursor = "pointer";
	this.element.appendChild(this.track);

	//Progress
	this.progress = document.createElement("div");
	this.progress.style.pointerEvents = "none";
	this.progress.style.position = "absolute";
	this.progress.style.backgroundColor = Editor.theme.audioProgress;
	this.progress.style.height = "100%";
	this.track.appendChild(this.progress);

	//Scrubber
	this.scrubber = document.createElement("div");
	this.scrubber.style.position = "absolute";
	this.scrubber.style.backgroundColor = Editor.theme.audioScrubber;
	this.scrubber.style.cursor = "pointer";
	this.scrubber.style.width = "6px";
	this.track.appendChild(this.scrubber);

	//Audio source and buffer
	this.buffer = null;
	this.source = null;

	//Playback control
	this.time = 0;
	this.startTime = 0;
	this.playing = false;
	this.loop = false;

	//Drag control
	this.seekStart = 0;
	this.seekTime = 0;
	this.seekProgress = 0;
	this.dragging = false;

	//Self pointer
	var self = this;

	this.button.onclick = function()
	{
		self.toggle();
	};

	this.scrubber.onmousedown = function(event)
	{
		self.dragging = true;
		self.seekStart = event.pageX;
		self.seekTime = self.time;
	};

	this.track.onmousemove = function(event)
	{
		if(self.dragging && self.buffer !== null)
		{
			var progress = event.layerX / this.offsetWidth;
			self.time = progress * self.buffer.duration;

			if(self.playing)
			{
				self.play(self.time);
			}

			progress *= 100;
			self.progress.style.width = progress + "%";
			self.scrubber.style.left = progress + "%";
		}
	};

	//Event manager
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		if(self.dragging && self.buffer !== null)
		{
			self.seekProgress = (event.pageX - self.seekStart) / (self.size.x - self.size.y * 1.1);
			self.seekProgress += self.seekTime / self.buffer.duration;

			if(self.seekProgress < 0)
			{
				self.seekProgress = 0;
			}
			else if(self.seekProgress > 1)
			{
				self.seekProgress = 1;
			}

			self.progress.style.width = (self.seekProgress * 100) + "%";
			self.scrubber.style.left = self.progress.style.width;
		}
	});

	this.manager.add(window, "mouseup", function(event)
	{
		if(self.dragging)
		{
			self.time = self.seekProgress * self.buffer.duration;
			self.dragging = false;

			if(self.playing)
			{
				self.play(self.time);
			}
		}
	});
	
	this.manager.create();

	//Update elements
	function draw()
	{
		if(self.playing)
		{
			self.time = self.context.currentTime - self.startTime;

			var seconds = Math.round(self.time % 60);
			if(seconds < 10)
			{
				seconds = "0" + seconds;
			}

			var minutes = Math.round(self.time / 60);
			if(minutes < 10)
			{
				minutes = "0" + minutes;
			}
			
			self.timer.innerHTML = minutes + ":" + seconds;

			if(self.time >= self.buffer.duration)
			{
				self.stop();
			}

			var progress = (self.time / self.buffer.duration) * 100;

			if(!self.dragging)
			{
				self.progress.style.width = progress + "%";
				self.scrubber.style.left = progress + "%";
			}
		}

		if(self.parent !== null)
		{
			requestAnimationFrame(draw);
		}
	}
	draw();
}

AudioPlayer.prototype = Object.create(Element.prototype);

//Decode audio
AudioPlayer.prototype.setAudioBuffer = function(buffer, onLoad)
{
	var self = this;

	this.context.decodeAudioData(buffer.slice(0), function(buffer)
	{
		self.buffer = buffer;

		if(onLoad !== undefined)
		{
			onLoad(buffer);
		}
	}.bind(this));
};

//Connect audio source
AudioPlayer.prototype.connect = function()
{
	if(this.playing)
	{
		this.pause();
	}

	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(this.context.destination);
};

//Disconnect source
AudioPlayer.prototype.disconnect = function()
{
	this.source.disconnect();
};

//Play audio
AudioPlayer.prototype.play = function(time)
{
	this.connect();

	if(time !== undefined)
	{
		this.time = time;
	}

	this.source.loop = this.loop;
	this.startTime = this.context.currentTime - this.time;
	this.source.start(this.context.currentTime, this.time);
	this.playing = true;

	this.icon.src = Editor.filePath + "icons/misc/pause.png";
};

//Pause audio
AudioPlayer.prototype.pause = function()
{
	if(this.playing)
	{
		this.playing = false;
		this.source.stop();
		this.time = this.context.currentTime - this.startTime;

		this.icon.src = Editor.filePath + "icons/misc/play.png";
	}
};

//Stop audio playback
AudioPlayer.prototype.stop = function()
{	
	if(this.playing)
	{
		this.source.stop();
		this.time = 0;
		this.playing = false;

		this.icon.src = Editor.filePath + "icons/misc/play.png";
	}
};

//Seek time
AudioPlayer.prototype.seek = function(time)
{
	if(this.playing)
	{
		this.play(time);
	}
	else
	{
		this.time = time;
	}
};

//Toggle play/pause
AudioPlayer.prototype.toggle = function()
{
	if(!this.playing)
	{
		this.play();
	}
	else
	{
		this.pause();
	}
};

//Remove element
AudioPlayer.prototype.destroy = function()
{
	try
	{
		//Remove event listeners
		this.manager.destroy();

		//Stop audio playback
		this.disconnect();
		this.stop();

		//Remove element
		if(this.parent.contains(this.element))
		{
			this.parent.removeChild(this.element);
		}
		this.parent = null;
	}
	catch(e){}
};

//Update division Size
AudioPlayer.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	//Button
	this.button.style.width = this.element.style.height;
	this.button.style.height = this.element.style.height;

	//Track
	this.track.style.top = (this.size.y * 0.4) + "px";
	this.track.style.left = (this.size.y * 1.05) + "px";
	this.track.style.width = (this.size.x - this.size.y * 1.5 - 35) + "px";
	this.track.style.height = (this.size.y * 0.3) + "px";

	//Scrubber
	this.scrubber.style.height = (this.size.y * 0.8) + "px";
	this.scrubber.style.top = (-this.size.y * 0.3) + "px";
};
