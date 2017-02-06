"use strict";

function PositionalAudio(audio)
{
	THREE.PositionalAudio.call(this, AudioEmitter.listener);

	this.name = "audio";
	this.type = "PositionalAudio";

	this.audio = (audio !== undefined) ? audio : null;

	this.volume = 1.0;

	this.autoplay = true;
	this.playbackRate = 1.0;
	this.startTime = 0;
	this.loop = true;
	
	this.isPlaying = false;
	this.hasPlaybackControl = true;

	//Runtime variables
	this.cameras = null;
	this.tempA = new THREE.Vector3();
	this.tempB = new THREE.Vector3();
}

//Super prototypes
PositionalAudio.prototype = Object.create(THREE.PositionalAudio.prototype);

//Initialize audio object
PositionalAudio.prototype.initialize = function()
{
	var self = this;

	if(this.audio !== null)
	{
		THREE.AudioContext.getContext().decodeAudioData(this.audio.data, function(buffer)
		{
			self.setBuffer(buffer);
		});
	}

	this.setVolume(this.volume);

	//Get cameras
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			this.cameras = node.cameras;
		}
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update audio position
PositionalAudio.prototype.update = function()
{
	this.tempA.setFromMatrixPosition(this.matrixWorld);

	if(this.cameras.length > 0)
	{
		this.tempB.setFromMatrixPosition(this.cameras[0].matrixWorld);
		this.tempA.sub(this.tempB);
	}

	this.panner.setPosition(this.tempA.x, this.tempA.y, this.tempA.z);

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Dispose audio object
PositionalAudio.prototype.dispose = function()
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

//Set volume
AudioEmitter.prototype.setVolume = function(value)
{
	this.volume = value;
	this.gain.gain.value = value;

	return this;
}

//Update world matrix
/*PositionalAudio.prototype.updateMatrixWorld = function(force)
{
	Object3D.prototype.updateMatrixWorld.call(this, force);
}*/

//Create JSON description
PositionalAudio.prototype.toJSON = function(meta)
{
	var audio = this.audio;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		audio = audio.toJSON(meta);
	});

	data.object.audio = audio.uuid;
	data.object.volume = this.volume;
	data.object.autoplay = this.autoplay;
	data.object.startTime = this.startTime;
	data.object.playbackRate = this.playbackRate;
	data.object.loop = this.loop;

	return data;
}