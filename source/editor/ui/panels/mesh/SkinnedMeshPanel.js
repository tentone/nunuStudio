"use strict";

function SkinnedMeshPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Animation
	this.form.addText("Animation");
	this.animation = new DropdownList(this.form.element);
	this.animation.size.set(140, 18);
	this.animation.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "initialAnimation", self.animation.getValue()));
	});
	this.form.add(this.animation);
	this.form.nextRow();

	//Animation Speed
	this.form.addText("Speed");
	this.animationSpeed = new NumberBox(this.form.element);
	this.animationSpeed.size.set(60, 18);
	this.animationSpeed.setStep(0.01);
	this.animationSpeed.setRange(0, Number.MAX_SAFE_INTEGER);
	this.animationSpeed.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "animationSpeed", self.animationSpeed.getValue()));
	});
	this.form.add(this.animationSpeed);
	this.form.nextRow();

	//Geometry
	this.geometry = GeometryForm.create(this.form, this.obj);

}

//Super prototypes
SkinnedMeshPanel.prototype = Object.create(ObjectPanel.prototype);

//Update panel content from attached object
SkinnedMeshPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	if(this.geometry !== null)
	{
		this.geometry.updateValues();
	}

	this.animation.addValue("none", -1);

	var animations = this.obj.animations;
	for(var i = 0; i < animations.length; i++)
	{
		this.animation.addValue(animations[i].name, i);
	}

	this.animation.setValue(this.obj.initialAnimation);
	this.animationSpeed.setValue(this.obj.animationSpeed);
};
