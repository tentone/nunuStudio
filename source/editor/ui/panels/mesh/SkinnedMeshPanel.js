"use strict";

function SkinnedMeshPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Animation
	this.form.addText("Animation");
	this.animation = new DropdownList(this.form.element);
	this.animation.size.set(140, 18);
	this.animation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.initialAnimation = self.animation.getValue();
		}
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
		if(self.obj !== null)
		{
			self.obj.animationSpeed = self.animationSpeed.getValue();
		}
	});
	this.form.add(this.animationSpeed);
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadow");
	this.castShadow.size.set(15, 15);
	this.castShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
updateControls
			self.obj.castShadow = self.castShadow.getValue();
		}
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.receiveShadow = new CheckBox(this.form.element);
	this.form.addText("React Shadow");
	this.receiveShadow.size.set(15, 15);
	this.receiveShadow.setOnChange(function()
	{
		if(self.obj !== null)
		{
updateControls
			self.obj.receiveShadow = self.receiveShadow.getValue();
		}
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();

	//Geometry
	this.geometry = GeometryForm.create(this.form, this.obj);

	//Update form
	this.form.updateInterface();
}

//Super prototypes
SkinnedMeshPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
SkinnedMeshPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
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
		this.castShadow.setValue(this.obj.castShadow);
		this.receiveShadow.setValue(this.obj.receiveShadow);
	}
};
