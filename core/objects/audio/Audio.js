"use strict";

function Audio()
{
	THREE.Audio.call(this, Audio.listener);

	this.name = "audio";
	this.type = "Audio";

	this.autoplay = true;
	this.playbackRate = 1;
	this.startTime = 0;

	this.source.loop = true;

	this.file = "data/sample.ogg";
}

Audio.prototype = Object.create(THREE.Audio.prototype);

//Static variables
Audio.listener = new THREE.AudioListener();

//Initialize
Audio.prototype.initialize = function()
{
	var self = this;

	//Load audio file
	var loader = new THREE.XHRLoader(this.manager);
	loader.setResponseType("arraybuffer");
	loader.load(this.file, function(data)
	{
		//Decode audio data
		THREE.AudioContext.decodeAudioData(data, function(buffer)
		{
			self.setBuffer(buffer);
		});
	});

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Dipose music
Audio.prototype.dispose = function()
{
	if(this.isPlaying)
	{
		this.stop();
		this.disconnect();
	}

	//Dipose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Create JSON for object
Audio.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.autoplay = this.autoplay;
	data.object.startTime = this.startTime;
	data.object.playbackRate = this.playbackRate;

	data.object.source = {};
	data.object.source.loop = this.source.loop;

	return data;
}