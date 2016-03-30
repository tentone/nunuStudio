function Sky()
{
	THREE.DirectionalLight.call(this, 0xffffaa, 0.3);

	this.name = "sky";

	this.castShadow = true;
	
	this.angle = 0;
	this.distance = 5;
	this.day_time = 10; //seconds
}

Sky.prototype = Object.create(THREE.DirectionalLight.prototype);
Sky.prototype.icon = "editor/files/icons/lights/sky.png";
Sky.prototype.updateable = true;
Sky.prototype.update = update;

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
