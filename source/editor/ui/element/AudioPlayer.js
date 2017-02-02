"use strict";

function AudioPlayer(parent)
{
	this.parent = (parent !== undefined) ? parent : document.body;

	//WebAudio context
	//this.context = new (window.AudioContext || window.webkitAudioContext)();
	this.context = THREE.AudioContext.getContext();

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
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
	this.icon.src = "editor/files/icons/misc/play.png";
	this.button.appendChild(this.icon);

	//Track
	this.track = document.createElement("div");
	this.track.style.position = "absolute";
	this.track.style.backgroundColor = "#222222";
	//this.track.style.cursor = "pointer";
	this.element.appendChild(this.track);

	//Progress
	this.progress = document.createElement("div");
	this.progress.style.position = "absolute";
	this.progress.style.backgroundColor = "#555555";
	this.progress.style.height = "100%";
	this.track.appendChild(this.progress);

	//Scrubber
	this.scrubber = document.createElement("div");
	this.scrubber.style.position = "absolute";
	this.scrubber.style.backgroundColor = "#FFFFFF";
	this.scrubber.style.cursor = "pointer";
	this.track.appendChild(this.scrubber);

	//Audio source and buffer
	this.buffer = null;
	this.source = null;

	//Playback control
	this.time = 0;
	this.start_time = 0;
	this.playing = false;
	this.loop = false;

	//Drag controll
	this.seek_start = 0;
	this.seek_time = 0;
	this.seek_progress = 0;
	this.dragging = false;

	//Self pointer
	var self = this;

	this.button. onclick = function()
	{
		self.toggle();
	};

	this.scrubber.onmousedown = function(event)
	{
		self.dragging = true;
		self.seek_start = event.pageX;
		self.seek_time = self.time;
	};

	this.onMouseMove = function(event)
	{
		if(self.dragging)
		{
			self.seek_progress = (event.pageX - self.seek_start) / (self.size.x - self.size.y * 1.1);
			self.seek_progress += self.seek_time / self.buffer.duration;

			if(self.seek_progress < 0)
			{
				self.seek_progress = 0;
			}
			else if(self.seek_progress > 1)
			{
				self.seek_progress = 1;
			}

			self.progress.style.width = (self.seek_progress * 100) + "%";
			self.scrubber.style.left = self.progress.style.width;
		}
	};

	this.onMouseUp = function(event)
	{
		if(self.dragging)
		{
			self.time = self.seek_progress * self.buffer.duration;
			self.dragging = false;

			if(self.playing)
			{
				self.play(self.time);
			}
		}
		
	};
	
	//Window events
	window.addEventListener("mousemove", this.onMouseMove);
	window.addEventListener("mouseup", this.onMouseUp);

	//Update elements
	function draw()
	{
		if(self.playing)
		{
			self.time = self.context.currentTime - self.start_time;

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

	//Attributes
	this.visible = true;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	
	//Attach element
	this.parent.appendChild(this.element);
}

//Decode audio
AudioPlayer.prototype.setAudioBuffer = function(buffer, onLoad)
{
	this.context.decodeAudioData(buffer, function(buffer)
	{
		this.buffer = buffer;

		if(onLoad !== undefined)
		{
			onLoad(buffer);
		}
	}.bind(this));
}

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
}

//Disconnect source
AudioPlayer.prototype.disconnect = function()
{
	this.source.disconnect();
}

//Play audio
AudioPlayer.prototype.play = function(time)
{
	this.connect();

	if(time !== undefined)
	{
		this.time = time;
	}

	this.source.loop = this.loop;
	this.start_time = this.context.currentTime - this.time;
	this.source.start(this.context.currentTime, this.time);
	this.playing = true;

	this.icon.src = "editor/files/icons/misc/pause.png";
}

//Pause audio
AudioPlayer.prototype.pause = function()
{
	if(this.playing)
	{
		this.playing = false;
		this.source.stop();
		this.time = this.context.currentTime - this.start_time;

		this.icon.src = "editor/files/icons/misc/play.png";
	}
}

//Stop audio playback
AudioPlayer.prototype.stop = function()
{	
	if(this.playing)
	{
		this.source.stop();
		this.time = 0;
		this.playing = false;

		this.icon.src = "editor/files/icons/misc/play.png";
	}
}

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
}

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
}

//Remove element
AudioPlayer.prototype.destroy = function()
{
	try
	{
		//Stop audio playback
		this.stop();

		//Remove event listeners
		window.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("mouseup", this.onMouseUp);

		//Remove element
		this.parent.removeChild(this.element);
		this.parent = null;
	}
	catch(e){}
}

//Update
AudioPlayer.prototype.update = function(){}

//Update division Size
AudioPlayer.prototype.updateInterface = function()
{
	//Set visibility
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
	this.track.style.top = (this.size.y * 0.40) + "px";
	this.track.style.left = (this.size.y * 1.05) + "px";
	this.track.style.width = (this.size.x - this.size.y * 1.5 - 35) + "px";
	this.track.style.height = (this.size.y * 0.2) + "px";

	//Scrubber
	this.scrubber.style.width = (this.size.y * 0.2) + "px";
	this.scrubber.style.height = (this.size.y * 0.6) + "px";
	this.scrubber.style.top = (-this.size.y * 0.2) + "px";
}