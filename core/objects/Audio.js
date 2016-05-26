function Audio()
{
	THREE.Audio.call(this, Audio.listener);

	this.name = "audio";
	this.type = "Audio";

	this.autoplay = false;
	this.file = "data/evil_angel.ogg";
}

//Function Prototype
Audio.prototype = Object.create(THREE.Audio.prototype);
Audio.prototype.icon = "editor/files/icons/assets/audio.png";

//Runtime functions
Audio.prototype.update = update;
Audio.prototype.initialize = initialize;

//Static variables
Audio.listener = new THREE.AudioListener();

//Initialize
function initialize()
{
	//Load audio file
	var self = this;
	var loader = new THREE.AudioLoader();
	loader.load(this.file, function(buffer)
	{
		self.setBuffer(buffer);
		if(self.autoplay)
		{
			self.play();
		}
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
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.autoplay = this.autoplay;
	data.startTime = this.startTime;
	data.playbackRate = this.playbackRate;

	return data;
}