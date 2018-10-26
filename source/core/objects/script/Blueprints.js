function VisualScript(nodes) {
	THREE.Group.call(this);

	this.type = "Script";
	this.name = "Visual";
}

VisualScript.prototype = Object.create(THREE.Group.prototype);