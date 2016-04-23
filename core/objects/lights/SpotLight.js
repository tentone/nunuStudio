function SpotLight(hex, intensity, distance, angle, exponent, decay)
{
	THREE.SpotLight.call(this, hex, intensity, distance, angle, exponent, decay);

	this.name = "spot_light";
	
	this.castShadow = true;

	this.shadow.mapSize.width = 1024;
	this.shadow.mapSize.height = 1024;
}

//Function Prototype
SpotLight.prototype = Object.create(THREE.SpotLight.prototype);
SpotLight.prototype.icon = "editor/files/icons/lights/spot.png";

//Runtime functions
SpotLight.prototype.initialize = initialize;
SpotLight.prototype.update = update;

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
