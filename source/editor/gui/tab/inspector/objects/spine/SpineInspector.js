import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Editor} from "../../../../../Editor.js";
import {DropdownList} from "../../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function SpineInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Animation
	this.form.addText(Locale.animation);
	this.animation = new DropdownList(this.form);
	this.animation.size.set(100, 18);
	this.animation.setOnChange(function()
	{
		self.object.setAnimation(0, self.animation.getValue());
	});
	this.form.add(this.animation);
	this.form.nextRow();

	// Skin
	this.form.addText("Skin");
	this.skin = new DropdownList(this.form);
	this.skin.size.set(100, 18);
	this.skin.setOnChange(function()
	{
		self.object.setSkin(self.skin.getValue());
	});
	this.form.add(this.skin);
	this.form.nextRow();

	// Cast shadow
	this.castShadow = new CheckBox(this.form);
	this.form.addText(Locale.castShadows);
	this.castShadow.size.set(18, 18);
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	// Receive shadow
	this.receiveShadow = new CheckBox(this.form);
	this.form.addText(Locale.receiveShadows);
	this.receiveShadow.size.set(18, 18);
	this.receiveShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "receiveShadow", self.receiveShadow.getValue()));
	});
	this.form.add(this.receiveShadow);
	this.form.nextRow();
}

SpineInspector.prototype = Object.create(ObjectInspector.prototype);

// Update panel content from attached object
SpineInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
		
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

export {SpineInspector};