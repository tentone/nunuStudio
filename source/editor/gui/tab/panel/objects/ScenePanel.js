"use strict";

function ScenePanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Select scene as default
	this.default = new CheckBox(this.form);
	this.form.addText("Default scene");
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

	//Background color
	this.form.addText(Locale.background);
	this.background = new ColorChooser(this.form);
	this.background.size.set(100, 18);
	this.background.setValue(0, 0, 0);
	this.background.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "background", new THREE.Color(self.background.getValueHex())));
	});
	this.form.add(this.background);
	this.form.nextRow();

	//Background texture
	this.form.addText("");
	this.backgroundTexture = new TextureChooser(this.form);
	this.backgroundTexture.acceptAll = true;
	this.backgroundTexture.size.set(0, 100);
	this.backgroundTexture.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.object, "background", self.backgroundTexture.getValue()));
	});
	this.form.add(this.backgroundTexture);
	this.form.nextRow();

	this.form.addText("");
	this.backgroundTransparent = new ButtonText(this.form);
	this.backgroundTransparent.setText("Set transparent");
	this.backgroundTransparent.size.set(100, 18);
	this.backgroundTransparent.setOnClick(function()
	{
		Editor.addAction(new ChangeAction(self.object, "background", null));
	});
	this.form.add(this.backgroundTransparent);
	this.form.nextRow();

	//Fog
	this.form.addText(Locale.fog);
	this.fog = new DropdownList(this.form);
	this.fog.size.set(100, 18);
	this.fog.addValue(Locale.none, THREE.Fog.NONE);
	this.fog.addValue(Locale.linear, THREE.Fog.LINEAR);
	this.fog.addValue(Locale.exponential, THREE.Fog.EXPONENTIAL);
	this.fog.setOnChange(function()
	{
		self.object.setFogMode(self.fog.getSelectedIndex());
		self.updatePanel();
	});
	this.form.add(this.fog);
	this.form.nextRow();

	//Linear fog properties
	this.fogLinearForm = new TableForm(this.form);
	this.fogLinearForm.spacing.set(5, 5);

	//Linear fog color
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

	//Linear fog near
	this.fogLinearForm.addText(Locale.near);
	this.fogNear = new NumberBox(this.fogLinearForm);
	this.fogNear.size.set(60, 18);
	this.fogNear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.fog, "near", self.fogNear.getValue()));
	});
	this.fogLinearForm.add(this.fogNear);
	this.fogLinearForm.nextRow();

	//Linear fog far
	this.fogLinearForm.addText(Locale.near);
	this.fogFar = new NumberBox(this.fogLinearForm);
	this.fogFar.size.set(60, 18);
	this.fogFar.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.fog, "far", self.fogFar.getValue()));
	});
	this.fogLinearForm.add(this.fogFar);
	this.fogLinearForm.updateInterface();

	//Add linear fog form
	this.form.add(this.fogLinearForm);
	this.form.nextRow();

	//Exponential fog properties
	this.fogExponentialForm = new TableForm(this.form);
	this.fogExponentialForm.spacing.set(5, 5);

	//Exponential fog color
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

	//Exponential fog density
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

	//Add exponential fog form
	this.form.add(this.fogExponentialForm);
	this.form.nextRow();
	
	//Physics world
	this.form.addText(Locale.physics);
	this.form.nextRow();

	//Use physics
	this.form.addText("Use physics");
	this.usePhysics = new CheckBox(this.form);
	this.usePhysics.size.set(18, 18);
	this.usePhysics.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "usePhysics", self.usePhysics.getValue()));
	});
	this.form.add(this.usePhysics);
	this.form.nextRow();

	//Gravity
	this.form.addText("Gravity");
	this.gravity = new VectorBox(this.form);
	this.gravity.setOnChange(function()
	{
		var gravity = self.gravity.getValue();
		self.object.world.gravity.set(gravity.x, gravity.y, gravity.z);
	});
	this.form.add(this.gravity);
	this.form.nextRow();

	this.form.addText("Tolerance");
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

	this.form.addText("Iterations");
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

//Super prototypes
ScenePanel.prototype = Object.create(ObjectPanel.prototype);

//Update panel content from attached object
ScenePanel.prototype.updatePanel = function()
{
	this.default.setValue(this.object.uuid === this.object.parent.defaultScene);
	
	if(this.object.fog instanceof THREE.Fog)
	{
		this.fog.setValue(THREE.Fog.LINEAR);
		this.fogLinearColor.setValueHex(this.object.fog.color.getHex());
		this.fogNear.setValue(this.object.fog.near);
		this.fogFar.setValue(this.object.fog.far);
		this.updateForms();
	}
	else if(this.object.fog instanceof THREE.FogExp2)
	{
		this.fog.setValue(THREE.Fog.EXPONENTIAL);
		this.fogExponentialColor.setValueHex(this.object.fog.color.getHex());
		this.fogDensity.setValue(this.object.fog.density);
		this.updateForms();
	}
	else
	{
		this.fog.setValue(THREE.Fog.NONE);
		this.updateForms();
	}

	if(this.object.background !== null)
	{
		if(this.object.background instanceof THREE.Color)
		{
			this.background.setValue(this.object.background.r, this.object.background.g, this.object.background.b);
		}
		else if(this.object.background instanceof THREE.Texture)
		{
			this.backgroundTexture.setValue(this.object.background);
		}
	}
	else
	{
		this.background.setValue(0, 0, 0);
		this.backgroundTexture.setValue(null);
	}

	this.usePhysics.setValue(this.object.usePhysics);
	this.gravity.setValue(this.object.world.gravity.x, this.object.world.gravity.y, this.object.world.gravity.z);
	this.tolerance.setValue(this.object.world.solver.tolerance);
	this.iterations.setValue(this.object.world.solver.iterations);
};

//Update wich forms should be visible in the panel
ScenePanel.prototype.updateForms = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.fogLinearForm.visible = (this.object.fog instanceof THREE.Fog) ? true : false;
	this.fogLinearForm.updateInterface();

	this.fogExponentialForm.visible = (this.object.fog instanceof THREE.FogExp2) ? true : false;
	this.fogExponentialForm.updateInterface();

	this.form.updateInterface();
};
