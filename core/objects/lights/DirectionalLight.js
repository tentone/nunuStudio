function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);

	this.name = "directional_light";
}

//Function Prototype
DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);
DirectionalLight.prototype.icon = "editor/files/icons/lights/directional.png";

//Runtime functions
DirectionalLight.prototype.update = update;
DirectionalLight.prototype.initialize = initialize;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
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
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
