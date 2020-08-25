import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {TableForm} from "../../../../components/TableForm.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {ButtonText} from "../../../../components/buttons/ButtonText.js";

function PassNode(parent, name)
{
	TableForm.call(this, parent);

	this.element.style.overflow = "hidden"; 
	
	this.defaultTextWidth = 60;
	this.position.set(10, 5);
	this.spacing.set(5, 5);

	// Pass
	this.pass = null;
	this.composer = null;
	this.editor = null;

	// Render pass
	this.addText(name !== undefined ? name : "Pass Node");
	this.nextRow();

	var self = this;

	// Enabled
	this.addText(Locale.enabled);
	this.enabled = new CheckBox(this);
	this.enabled.size.set(18, 18);
	this.enabled.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "enabled", self.enabled.getValue()));
	});
	this.add(this.enabled);
	this.nextRow();

	// Clear
	this.addText(Locale.clear);
	this.clear = new CheckBox(this);
	this.clear.size.set(18, 18);
	this.clear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "clear", self.clear.getValue()));
	});
	this.add(this.clear);
	this.nextRow();

	// Render to screen
	this.addText("Output");
	this.renderToScreen = new CheckBox(this);
	this.renderToScreen.size.set(18, 18);
	this.renderToScreen.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "renderToScreen", self.renderToScreen.getValue()));
	});
	this.add(this.renderToScreen);
	this.nextRow();

	// Up
	this.up = new ButtonText(this);
	this.up.size.set(50, 18);
	this.up.setText("Up");
	this.up.setOnClick(function()
	{
		self.composer.moveBack(self.pass);
		self.editor.updatePostNodes();
	});

	// Down
	this.down = new ButtonText(this);
	this.down.size.set(50, 18);
	this.down.setText("Down");
	this.down.setOnClick(function()
	{
		self.composer.moveForward(self.pass);
		self.editor.updatePostNodes();
	});

	// Delete
	this.delete = new ButtonText(this);
	this.delete.size.set(70, 18);
	this.delete.setText(Locale.delete);
	this.delete.setOnClick(function()
	{
		self.composer.removePass(self.pass);
		self.editor.updatePostNodes();
	});
}

PassNode.prototype = Object.create(TableForm.prototype);

PassNode.passes = {};

PassNode.createPass = function(element, type)
{
	if (PassNode.passes[type] !== undefined)
	{
		return new PassNode.passes[type](element);
	}

	return new PassNode(element, type);
};

PassNode.registerPass = function(type, Constructor)
{
	PassNode.passes[type] = Constructor;
};

PassNode.prototype.setPass = function(pass)
{
	this.pass = pass;

	this.enabled.setValue(pass.enabled);
	this.clear.setValue(pass.clear);
	this.renderToScreen.setValue(pass.renderToScreen);
};

PassNode.prototype.setComposer = function(composer)
{
	this.composer = composer;
};

PassNode.prototype.setEditor = function(editor)
{
	this.editor = editor;

	this.add(this.up);
	this.add(this.down);
	this.add(this.delete);
};

export {PassNode};
