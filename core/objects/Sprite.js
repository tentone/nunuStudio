function Sprite(material)
{
	THREE.Sprite.call(this, material);

	this.name = "sprite";
	this.type = "Sprite";
}

//Function Prototype
Sprite.prototype = Object.create(THREE.Sprite.prototype);

//Runtime functions
Sprite.prototype.update = update;
Sprite.prototype.initialize = initialize;

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
