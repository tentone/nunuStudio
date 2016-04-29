THREE.Object3D.prototype.icon = "editor/files/icons/tab/scene.png";
THREE.Object3D.prototype.expanded = false;

THREE.Object3D.prototype.update = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};

THREE.Object3D.prototype.initialize = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};
