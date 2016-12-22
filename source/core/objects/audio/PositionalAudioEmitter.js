"use strict";

function PositionalAudioEmitter(audio)
{
	THREE.Audio.call(this, PositionalAudioEmitter.listener);

	this.name = "audio";
	this.type = "Audio";

	this.audio = (audio !== undefined) ? audio : null;

	this.autoplay = true;
	this.playbackRate = 1;
	this.startTime = 0;
	this.loop = true;

	this.isPlaying = false;
	this.hasPlaybackControl = true;
}

//Default audio listener
PositionalAudioEmitter.listener = new THREE.AudioListener();

//Super prototypes
PositionalAudioEmitter.prototype = Object.create(THREE.Audio.prototype);

//Initialize audio object
PositionalAudioEmitter.prototype.initialize = function()
{
	var self = this;

	if(this.audio !== null)
	{
		THREE.AudioContext.getContext().decodeAudioData(this.audio.data, function(buffer)
		{
			self.setBuffer(buffer);
		});
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Dispose audio object
PositionalAudioEmitter.prototype.dispose = function()
{
	if(this.isPlaying)
	{
		this.stop();
		this.disconnect();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Create JSON description
PositionalAudioEmitter.prototype.toJSON = function(meta)
{
	var audio = this.audio;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		audio = audio.toJSON(meta);
	});

	data.object.audio = audio.uuid;	
	data.object.autoplay = this.autoplay;
	data.object.startTime = this.startTime;
	data.object.playbackRate = this.playbackRate;
	data.object.loop = this.loop;

	return data;
}