//Texture image
function Texture(url)
{
	//Create video element
	this.img = document.createElement("img");
	this.img.src = url;

	//Create Texture part of object
	THREE.Texture.call(this, this.img);	
}

//Functions prototype
Texture.prototype = Object.create(THREE.Texture.prototype);
Texture.prototype.update = update;
Texture.prototype.dispose = dispose;

//Update texture
function update(){}

//Dispose texture
function dipose()
{
	THREE.Texture.prototype.toJSON.call(this);
}