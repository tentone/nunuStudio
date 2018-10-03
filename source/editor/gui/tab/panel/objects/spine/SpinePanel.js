"use strict";

function SpinePanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Animation
	this.form.addText("Animation");
	this.animation = new DropdownList(this.form);
	this.animation.size.set(100, 18);
	this.animation.setOnChange(function()
	{
		self.object.setAnimation(0, self.animation.getValue());
	});
	this.form.add(this.animation);
	this.form.nextRow();

	//Skin
	this.form.addText("Skin");
	this.skin = new DropdownList(this.form);
	this.skin.size.set(100, 18);
	this.skin.setOnChange(function()
	{
		self.object.setSkin(self.skin.getValue());
	});
	this.form.add(this.skin);
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form);
	this.form.addText("Cast Shadow");
	this.castShadow.size.set(18, 18);
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Receive shadow
	this.receiveShadow = new CheckBox(this.form);
	this.form.addText("React Shadow");
	this.receiveShadow.size.set(18, 18);
	this.receiveShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();
}

SpinePanel.prototype = Object.create(ObjectPanel.prototype);

//Update panel content from attached object
SpinePanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
		
	this.animation.clearValues();
	this.skin.clearValues();
	
	var animations = this.object.getAnimations();
	for(var i = 0; i < animations.length; i++)
	{
		this.animation.addValue(animations[i].name, animations[i].name);
	}

	var skins = this.object.getSkins();
	for(var i = 0; i < skins.length; i++)
	{
		this.skin.addValue(skins[i].name, skins[i].name);
	}

	this.animation.setValue(this.object.animation);
	this.skin.setValue(this.object.skin);
	this.castShadow.setValue(this.object.castShadow);
	this.receiveShadow.setValue(this.object.receiveShadow);
};
