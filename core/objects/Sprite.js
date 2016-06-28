function Sprite(material)
{
	THREE.Sprite.call(this, material);

	this.name = "sprite";
	this.type = "Sprite";
}

//Function Prototype
Sprite.prototype = Object.create(THREE.Sprite.prototype);

//Runtime functions
Sprite.prototype.initialize = initialize;
Sprite.prototype.update = update;
Sprite.prototype.dispose = dispose;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update state
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Dipose sprite
function dispose()
{
	//Dipose material
	this.material.dispose();

	//Dipose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}
