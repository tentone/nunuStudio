import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "./ObjectInspector.js";
import {Editor} from "../../../../Editor.js";
import {TableForm} from "../../../../components/TableForm.js";
import {VectorBox} from "../../../../components/input/VectorBox.js";
import {TextureChooser} from "../../../../components/input/TextureChooser.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CubeTextureBox} from "../../../../components/input/CubeTextureBox.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {ButtonText} from "../../../../components/buttons/ButtonText.js";
import {Color, Fog, FogExp2, Texture} from "three";

function SceneInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Select scene as default
	this.default = new CheckBox(this.form);
	this.form.addText(Locale.defaultScene);
	this.default.size.set(18, 18);
	this.default.setOnChange(function()
	{
		if(self.object !== null)
		{
			var program = self.object.parent;
			
			if(self.default.getValue())
			{
				Editor.addAction(new ChangeAction(program, "defaultScene",  self.object.uuid));
			}
			else
			{
				Editor.addAction(new ChangeAction(program, "defaultScene",  null));
			}
		}
	});
	this.form.add(this.default);
	this.form.nextRow();

	// Background color
	this.form.addText(Locale.background);
	this.background = new ColorChooser(this.form);
	this.background.size.set(100, 18);
	this.background.setValue(0, 0, 0);
	this.background.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "background", new Color(self.background.getValueHex())));
	});
	this.form.add(this.background);
	this.form.nextRow();

	// Background texture
	this.form.addText("");
	this.backgroundTexture = new TextureChooser(this.form);
	this.backgroundTexture.acceptAll = true;
	this.backgroundTexture.size.set(0, 100);
	this.backgroundTexture.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "background", self.backgroundTexture.getValue()));
	});
	this.form.add(this.backgroundTexture);
	this.form.nextRow();

	this.form.addText("");
	this.backgroundTransparent = new ButtonText(this.form);
	this.backgroundTransparent.setText(Locale.setTransparent);
	this.backgroundTransparent.size.set(100, 18);
	this.backgroundTransparent.setOnClick(function()
	{
		Editor.addAction(new ChangeAction(self.object, "background", null));
	});
	this.form.add(this.backgroundTransparent);
	this.form.nextRow();

	// Environment map
	this.form.addText(Locale.environmentMap);
	this.environment = new CubeTextureBox(this.form);
	this.environment.size.set(0, 100);
	this.environment.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "environment", self.environment.getValue()));
	});
	this.form.add(this.environment);
	this.form.nextRow();

	// Fog
	this.form.addText(Locale.fog);
	this.fog = new DropdownList(this.form);
	this.fog.size.set(100, 18);
	this.fog.addValue(Locale.none, Fog.NONE);
	this.fog.addValue(Locale.linear, Fog.LINEAR);
	this.fog.addValue(Locale.exponential, Fog.EXPONENTIAL);
	this.fog.setOnChange(function()
	{
		self.object.setFogMode(self.fog.getSelectedIndex());
		self.updateInspector();
	});
	this.form.add(this.fog);
	this.form.nextRow();

	// Linear fog properties
	this.fogLinearForm = new TableForm(this.form);
	this.fogLinearForm.spacing.set(5, 5);

	// Linear fog color
	this.fogLinearForm.addText(Locale.color);
	this.fogLinearColor = new ColorChooser(this.fogLinearForm);
	this.fogLinearColor.size.set(80, 18);
	this.fogLinearColor.setOnChange(function()
	{
		var color = self.fogLinearColor.getValueHex();
		self.fogExponentialColor.setValueHex(color);
		self.object.fog.color.setHex(color);
	});
	this.fogLinearForm.add(this.fogLinearColor);
	this.fogLinearForm.nextRow();

	// Linear fog near
	this.fogLinearForm.addText(Locale.near);
	this.fogNear = new NumberBox(this.fogLinearForm);
	this.fogNear.size.set(60, 18);
	this.fogNear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.fog, "near", self.fogNear.getValue()));
	});
	this.fogLinearForm.add(this.fogNear);
	this.fogLinearForm.nextRow();

	// Linear fog far
	this.fogLinearForm.addText(Locale.near);
	this.fogFar = new NumberBox(this.fogLinearForm);
	this.fogFar.size.set(60, 18);
	this.fogFar.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.fog, "far", self.fogFar.getValue()));
	});
	this.fogLinearForm.add(this.fogFar);
	this.fogLinearForm.updateInterface();

	// Add linear fog form
	this.form.add(this.fogLinearForm);
	this.form.nextRow();

	// Exponential fog properties
	this.fogExponentialForm = new TableForm(this.form);
	this.fogExponentialForm.spacing.set(5, 5);

	// Exponential fog color
	this.fogExponentialForm.addText(Locale.color);
	this.fogExponentialColor = new ColorChooser(this.fogExponentialForm);
	this.fogExponentialColor.size.set(80, 18);
	this.fogExponentialColor.setOnChange(function()
	{
		var color = self.fogExponentialColor.getValueHex();
		self.fogLinearColor.setValueHex(color);
		self.object.fog.color.setHex(color);
	});
	this.fogExponentialForm.add(this.fogExponentialColor);
	this.fogExponentialForm.nextRow();

	// Exponential fog density
	this.fogExponentialForm.addText(Locale.density)
	this.fogDensity = new NumberBox(this.fogExponentialForm);
	this.fogDensity.size.set(100, 18);
	this.fogDensity.setStep(0.0001);
	this.fogDensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.fog, "density", self.fogDensity.getValue()));
	});
	this.fogExponentialForm.add(this.fogDensity);
	this.fogExponentialForm.updateInterface();

	// Add exponential fog form
	this.form.add(this.fogExponentialForm);
	this.form.nextRow();
	
	// Physics world
	this.form.addText(Locale.physics);
	this.form.nextRow();

	// Use physics
	this.form.addText(Locale.usePhysics);
	this.usePhysics = new CheckBox(this.form);
	this.usePhysics.size.set(18, 18);
	this.usePhysics.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "usePhysics", self.usePhysics.getValue()));
	});
	this.form.add(this.usePhysics);
	this.form.nextRow();

	// Gravity
	this.form.addText(Locale.gravity);
	this.gravity = new VectorBox(this.form);
	this.gravity.setOnChange(function()
	{
		var gravity = self.gravity.getValue();
		self.object.world.gravity.set(gravity.x, gravity.y, gravity.z);
	});
	this.form.add(this.gravity);
	this.form.nextRow();

	this.form.addText(Locale.tolerance);
	this.tolerance = new NumberBox(this.form);
	this.tolerance.size.set(50, 18);
	this.tolerance.setRange(0, 1000);
	this.tolerance.setStep(0.01);
	this.tolerance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.world.solver, "tolerance", self.tolerance.getValue()));
	});
	this.form.add(this.tolerance);
	this.form.nextRow();

	this.form.addText(Locale.iterations);
	this.iterations = new NumberBox(this.form);
	this.iterations.size.set(50, 18);
	this.iterations.setRange(0, 1000);
	this.iterations.setStep(1);
	this.iterations.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.world.solver, "iterations", self.iterations.getValue()));
	});
	this.form.add(this.iterations);
	this.form.nextRow();
}

// Super prototypes
SceneInspector.prototype = Object.create(ObjectInspector.prototype);

// Update panel content from attached object
SceneInspector.prototype.updateInspector = function()
{
	this.default.setValue(this.object.uuid === this.object.parent.defaultScene);
	
	if(this.object.fog instanceof Fog)
	{
		this.fog.setValue(Fog.LINEAR);
		this.fogLinearColor.setValueHex(this.object.fog.color.getHex());
		this.fogNear.setValue(this.object.fog.near);
		this.fogFar.setValue(this.object.fog.far);
		this.updateForms();
	}
	else if(this.object.fog instanceof FogExp2)
	{
		this.fog.setValue(Fog.EXPONENTIAL);
		this.fogExponentialColor.setValueHex(this.object.fog.color.getHex());
		this.fogDensity.setValue(this.object.fog.density);
		this.updateForms();
	}
	else
	{
		this.fog.setValue(Fog.NONE);
		this.updateForms();
	}

	if(this.object.background !== null)
	{
		if(this.object.background instanceof Color)
		{
			this.background.setValue(this.object.background.r, this.object.background.g, this.object.background.b);
		}
		else if(this.object.background instanceof Texture)
		{
			this.backgroundTexture.setValue(this.object.background);
		}
	}
	else
	{
		this.background.setValue(0, 0, 0);
		this.backgroundTexture.setValue(null);
	}

	this.environment.setValue(this.object.environment);
	this.usePhysics.setValue(this.object.usePhysics);
	this.gravity.setValue(this.object.world.gravity.x, this.object.world.gravity.y, this.object.world.gravity.z);
	this.tolerance.setValue(this.object.world.solver.tolerance);
	this.iterations.setValue(this.object.world.solver.iterations);
};

// Update wich forms should be visible in the panel
SceneInspector.prototype.updateForms = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.fogLinearForm.visible = (this.object.fog instanceof Fog) ? true : false;
	this.fogLinearForm.updateInterface();

	this.fogExponentialForm.visible = (this.object.fog instanceof FogExp2) ? true : false;
	this.fogExponentialForm.updateInterface();

	this.form.updateInterface();
};

export {SceneInspector};