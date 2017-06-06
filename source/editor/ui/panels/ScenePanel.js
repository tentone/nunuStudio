"use strict";

function ScenePanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Select scene as default
	this.default = new CheckBox(this.form.element);
	this.form.addText("Default scene");
	this.default.size.set(15, 15);
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var program = self.obj.parent;
			if(self.default.getValue())
			{
				program.defaultScene = self.obj.uuid;
			}
			else
			{
				program.defaultScene = null;
			}
		}
	});
	this.form.add(this.default);
	this.form.nextRow();

	//Background color
	this.form.addText("Background");
	this.background = new ColorChooser(this.form.element);
	this.background.size.set(100, 18);
	this.background.setValue(0, 0, 0);
	this.background.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			self.obj.background = new THREE.Color(self.background.getValueHex());
		}
	});
	this.form.add(this.background);
	this.form.nextRow();

	//Background texture
	this.form.addText("");
	this.backgroundTexture = new TextureChooser(this.form.element);
	this.backgroundTexture.acceptAll = true;
	this.backgroundTexture.setOnChange(function(file)
	{
		if(self.obj !== null)
		{	
			self.obj.background = self.backgroundTexture.getValue();
		}
	});
	this.form.add(this.backgroundTexture);
	this.form.nextRow();

	//Fog
	this.form.addText("Fog");
	this.fog = new DropdownList(this.form.element);
	this.fog.size.set(100, 20);
	this.fog.addValue("None", THREE.Fog.NONE);
	this.fog.addValue("Linear", THREE.Fog.LINEAR);
	this.fog.addValue("Exponential", THREE.Fog.EXPONENTIAL);
	this.fog.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.setFogMode(self.fog.getSelectedIndex());
			self.updatePanel();
		}
	});
	this.form.add(this.fog);
	this.form.nextRow();

	//Linear fog properties
	this.fogLinearForm = new Form(this.form.element);
	this.fogLinearForm.spacing.set(5, 5);

	//Linear fog color
	this.fogLinearForm.addText("Color");
	this.fogLinearColor = new ColorChooser(this.fogLinearForm.element);
	this.fogLinearColor.size.set(80, 18);
	this.fogLinearColor.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			var color = self.fogLinearColor.getValueHex();
			self.fogExponentialColor.setValueHex(color);
			self.obj.fog.color.setHex(color);
		}
	});
	this.fogLinearForm.add(this.fogLinearColor);
	this.fogLinearForm.nextRow();

	//Linear fog near
	this.fogLinearForm.addText("Near");
	this.fogNear = new NumberBox(this.fogLinearForm.element);
	this.fogNear.size.set(60, 18);
	this.fogNear.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog.near = self.fogNear.getValue();
		}
	});
	this.fogLinearForm.add(this.fogNear);
	this.fogLinearForm.nextRow();

	//Linear fog far
	this.fogLinearForm.addText("Far");
	this.fogFar = new NumberBox(this.fogLinearForm.element);
	this.fogFar.size.set(60, 18);
	this.fogFar.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog.far = self.fogFar.getValue();
		}
	});
	this.fogLinearForm.add(this.fogFar);
	this.fogLinearForm.updateInterface();

	//Add linear fog form
	this.form.add(this.fogLinearForm);
	this.form.nextRow();

	//Exponential fog properties
	this.fogExponentialForm = new Form(this.form.element);
	this.fogExponentialForm.spacing.set(5, 5);

	//Exponential fog color
	this.fogExponentialForm.addText("Color");
	this.fogExponentialColor = new ColorChooser(this.fogExponentialForm.element);
	this.fogExponentialColor.size.set(80, 18);
	this.fogExponentialColor.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			var color = self.fogExponentialColor.getValueHex();
			self.fogLinearColor.setValueHex(color);
			self.obj.fog.color.setHex(color);
		}
	});
	this.fogExponentialForm.add(this.fogExponentialColor);
	this.fogExponentialForm.nextRow();

	//Exponential fog density
	this.fogExponentialForm.addText("Density")
	this.fogDensity = new NumberBox(this.fogExponentialForm.element);
	this.fogDensity.size.set(100, 18);
	this.fogDensity.setStep(0.0001);
	this.fogDensity.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog.density = self.fogDensity.getValue();
		}
	});
	this.fogExponentialForm.add(this.fogDensity);
	this.fogExponentialForm.updateInterface();

	//Add exponential fog form
	this.form.add(this.fogExponentialForm);
	this.form.nextRow();
	
	//Physics world
	this.form.addText("Physics");
	this.form.nextRow();

	//Gravity
	this.form.addText("Gravity");
	this.gravity = new CoordinatesBox(this.form.element);
	this.gravity.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var gravity = self.gravity.getValue();
			self.obj.world.gravity.set(gravity.x, gravity.y, gravity.z);
		}
	});
	this.form.add(this.gravity);
	this.form.nextRow();

	this.form.addText("Tolerance");
	this.tolerance = new NumberBox(this.form.element);
	this.tolerance.size.set(50, 18);
	this.tolerance.setRange(0, 1000);
	this.tolerance.setStep(0.01);
	this.tolerance.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.world.solver.tolerance = self.tolerance.getValue();
		}
	});
	this.form.add(this.tolerance);
	this.form.nextRow();

	this.form.addText("Iterations");
	this.iterations = new NumberBox(this.form.element);
	this.iterations.size.set(50, 18);
	this.iterations.setRange(0, 1000);
	this.iterations.setStep(1);
	this.iterations.setOnChange(function()
	{
		if(self.iterations !== null)
		{
			self.obj.world.solver.iterations = self.iterations.getValue();
		}
	});
	this.form.add(this.iterations);
	this.form.nextRow();
}

//Super prototypes
ScenePanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
ScenePanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.default.setValue(this.obj.uuid === this.obj.parent.defaultScene);
		
		if(this.obj.fog instanceof THREE.Fog)
		{
			this.fog.setValue(THREE.Fog.LINEAR);
			this.fogLinearColor.setValueHex(this.obj.fog.color.getHex());
			this.fogNear.setValue(this.obj.fog.near);
			this.fogFar.setValue(this.obj.fog.far);
			this.updateForms();
		}
		else if(this.obj.fog instanceof THREE.FogExp2)
		{
			this.fog.setValue(THREE.Fog.EXPONENTIAL);
			this.fogExponentialColor.setValueHex(this.obj.fog.color.getHex());
			this.fogDensity.setValue(this.obj.fog.density);
			this.updateForms();
		}
		else
		{
			this.fog.setValue(THREE.Fog.NONE);
			this.updateForms();
		}

		if(this.obj.background !== null)
		{
			if(this.obj.background instanceof THREE.Color)
			{
				this.background.setValue(this.obj.background.r, this.obj.background.g, this.obj.background.b);
			}
			else if(this.obj.background instanceof THREE.Texture)
			{
				this.backgroundTexture.setValue(this.obj.background);
			}
		}

		this.gravity.setValue(this.obj.world.gravity.x, this.obj.world.gravity.y, this.obj.world.gravity.z);
		this.tolerance.setValue(this.obj.world.solver.tolerance);
		this.iterations.setValue(this.obj.world.solver.iterations);
	}
};

//Update wich forms should be visible in the panel
ScenePanel.prototype.updateForms = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.fogLinearForm.visible = (this.obj.fog instanceof THREE.Fog) ? true : false;
		this.fogLinearForm.updateInterface();
		this.fogExponentialForm.visible = (this.obj.fog instanceof THREE.FogExp2) ? true : false;
		this.fogExponentialForm.updateInterface();
		this.form.updateInterface();
	}
};
