function Audio(listener)
{
	THREE.Object3D.call(this, listener);

	this.name = "audio";
}

//Function Prototype
Audio.prototype = Object.create(THREE.Audio.prototype);
Audio.prototype.icon = "editor/files/icons/assets/audio.png";

//Runtime functions
Audio.prototype.update = update;
Audio.prototype.initialize = initialize;

//Initialize
function initialize()
{
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