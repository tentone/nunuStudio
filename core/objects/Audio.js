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

//Function Prototype
Audio.prototype = Object.create(THREE.Audio.prototype);

//Runtime functions
Audio.prototype.update = update;
Audio.prototype.initialize = initialize;
Audio.prototype.dispose = dispose;
Audio.prototype.toJSON = toJSON;

//Static variables
Audio.listener = new THREE.AudioListener();

//Initialize
function initialize()
{
	var self = this;

	//Load audio file
	var loader = new THREE.XHRLoader(this.manager);
	loader.setResponseType("arraybuffer");
	loader.load(this.file, function(buffer)
	{
		var context = THREE.AudioContext;
		context.decodeAudioData(buffer, function(audioBuffer)
		{
			self.setBuffer(audioBuffer);
		});
	});

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
function update()
{
	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Dipose music
function dispose()
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
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.autoplay = this.autoplay;
	data.object.startTime = this.startTime;
	data.object.playbackRate = this.playbackRate;
	data.object.loop = this.source.loop;

	return data;
}