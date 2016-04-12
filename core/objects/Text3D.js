function Text3D(text, font , material)
{
	THREE.Mesh.call(this, new THREE.TextGeometry(text, {font: font}), material);
	
	this.name = "text";
	this.type = "Text3D";
	
	this.font = font;
	this.text = text;

	this.scale.set(0.01, 0.01, 0.01);
	/*this.updateMatrix();
	this.geometry.applyMatrix(this.matrix);

	this.position.set(0, 0, 0);
	this.rotation.set(0, 0, 0);
	this.scale.set(1, 1, 1);
	this.updateMatrix();*/
}

//Function Prototype
Text3D.prototype = Object.create(THREE.Mesh.prototype);
Text3D.prototype.icon = "editor/files/icons/models/text.png";

//Runtime functions
Text3D.prototype.initialize = initialize;
Text3D.prototype.update = update;

//Auxiliar Functions
Text3D.prototype.setText = setText;

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

//Set Text
function setText(text)
{
	this.text = text;
	this.geometry = new THREE.TextGeometry(this.text, {font: this.font});
}