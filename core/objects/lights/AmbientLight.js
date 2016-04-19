function AmbientLight(hex)
{
	THREE.AmbientLight.call(this, hex);
	
	this.name = "ambient_light";
}

//Function Prototype
AmbientLight.prototype = Object.create(THREE.AmbientLight.prototype);
AmbientLight.prototype.icon = "editor/files/icons/lights/ambient.png";

//Runtime functions
AmbientLight.prototype.update = update;
AmbientLight.prototype.initialize = initialize;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize !== undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update State
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update !== undefined)
		{
			this.children[i].update();
		}
	}
}
