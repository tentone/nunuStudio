function TextTexture()
{
	this.text = "TEXT";
	
	this.canvas = document.createElement("canvas");
	this.canvas.width = 128;
	this.canvas.height = 128;

	this.context2d = this.canvas.getContext("2d");
	this.context2d.font = "Normal 60px Arial";
	this.context2d.textAlign = "center";
	this.context2d.fillStyle = "rgba(255, 255, 255, 1)";
	this.context2d.fillText("text", this.canvas.width/2, this.canvas.height/2);

	THREE.CanvasTexture.call(this, this.canvas);
	this.needsUpdate = true;
}

//Functions prototype
TextTexture.prototype = Object.create(THREE.CanvasTexture.prototype);
TextTexture.prototype.update = update;

//Update texture
function update(){}
