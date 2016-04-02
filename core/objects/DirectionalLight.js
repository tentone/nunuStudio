function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);

	this.name = "directional_light";
}

DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);
DirectionalLight.prototype.icon = "editor/files/icons/lights/directional.png";
DirectionalLight.prototype.update = update;

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
