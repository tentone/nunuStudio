function VisualScript(nodes) {
	THREE.Group.call(this);

	this.type = "Script";
	this.name = "Visual";

	this.nodes = (nodes !== undefined) ? nodes : {};
}

VisualScript.prototype = Object.create(THREE.Group.prototype);

VisualScript.prototype.setNodes = function(nodes) {
	if (nodes !== undefined) {
		this.nodes = nodes;
	}
}