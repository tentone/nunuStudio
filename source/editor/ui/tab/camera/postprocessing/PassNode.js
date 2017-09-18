"use strict";

function PassNode(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = "#333366";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.borderRadius = "4px";

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 80;
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

	//Render pass
	this.form.addText("Render pass");
	this.form.nextRow();

	//Checkbox
	this.form.addText("Enabled");
	this.enabled = new CheckBox(this.form.element);
	this.enabled.size.set(15, 15);
	this.enabled.setOnChange(function()
	{
		//TODO <ADD CODE HERE>
	});
	this.form.add(this.enabled);
	this.form.nextRow();

	//Up
	this.up = new Button(this.form.element);
	this.up.size.set(50, 18);
	this.up.setText("Up");
	this.form.add(this.up);

	//Down
	this.up = new Button(this.form.element);
	this.up.size.set(50, 18);
	this.up.setText("Down");
	this.form.add(this.up);

	//Delete
	this.up = new Button(this.form.element);
	this.up.size.set(70, 18);
	this.up.setText("Delete");
	this.form.add(this.up);
	this.form.nextRow();

	this.form.updateInterface();
}

//Remove element
PassNode.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update division Size
PassNode.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";
		
		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};