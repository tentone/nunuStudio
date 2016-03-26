function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);
	this.updateable = true;
	this.name = "directional_light";
	this.icon = "editor/files/icons/lights/directional.png";
}

DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);
DirectionalLight.prototype.update = update;

function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].updateable)
		{
			this.children[i].update();
		}
	}
}
