"use strict";

function ScenePanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Select scene as default
	this.default = new CheckBox(this.form.element);
	this.default.setText("Default scene");
	this.default.size.set(200, 15);
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var program = self.obj.parent;
			if(self.default.getValue())
			{
				program.default_scene = self.obj.uuid;
			}
			else
			{
				program.default_scene = null;
			}
		}
	});
	this.form.add(this.default);
	this.form.nextRow();

	//Background color
	this.form.addText("Background");
	this.background = new ColorChooser(this.form.element);
	this.background.size.set(80, 18);
	this.background.setValue(0, 0, 0);
	this.background.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			if(self.obj.background === null)
			{
				self.obj.background = new THREE.Color();
			}
			self.obj.background.setHex(self.background.getValueHex());
		}
	});
	this.form.add(this.background);
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
	this.fog_linear_form = new Form(this.form.element);
	this.fog_linear_form.spacing.set(5, 5);

	//Linear fog color
	this.fog_linear_form.addText("Color");
	this.fog_linear_color = new ColorChooser(this.fog_linear_form.element);
	this.fog_linear_color.size.set(80, 18);
	this.fog_linear_color.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			var color = self.fog_linear_color.getValueHex();
			self.fog_exponential_color.setValueHex(color);
			self.obj.fog.color.setHex(color);
		}
	});
	this.fog_linear_form.add(this.fog_linear_color);
	this.fog_linear_form.nextRow();

	//Linear fog near
	this.fog_linear_form.addText("Near");
	this.fog_near = new NumberBox(this.fog_linear_form.element);
	this.fog_near.size.set(60, 18);
	this.fog_near.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog.near = self.fog_near.getValue();
		}
	});
	this.fog_linear_form.add(this.fog_near);
	this.fog_linear_form.nextRow();

	//Linear fog far
	this.fog_linear_form.addText("Far");
	this.fog_far = new NumberBox(this.fog_linear_form.element);
	this.fog_far.size.set(60, 18);
	this.fog_far.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog.far = self.fog_far.getValue();
		}
	});
	this.fog_linear_form.add(this.fog_far);
	this.fog_linear_form.updateInterface();

	//Add linear fog form
	this.form.add(this.fog_linear_form);
	this.form.nextRow();

	//Exponential fog properties
	this.fog_exponential_form = new Form(this.form.element);
	this.fog_exponential_form.spacing.set(5, 5);

	//Exponential fog color
	this.fog_exponential_form.addText("Color");
	this.fog_exponential_color = new ColorChooser(this.fog_exponential_form.element);
	this.fog_exponential_color.size.set(80, 18);
	this.fog_exponential_color.setOnChange(function()
	{
		if(self.obj !== null)
		{	
			var color = self.fog_exponential_color.getValueHex();
			self.fog_linear_color.setValueHex(color);
			self.obj.fog.color.setHex(color);
		}
	});
	this.fog_exponential_form.add(this.fog_exponential_color);
	this.fog_exponential_form.nextRow();

	//Exponential fog density
	this.fog_exponential_form.addText("Density")
	this.fog_density = new NumberBox(this.fog_exponential_form.element);
	this.fog_density.size.set(100, 18);
	this.fog_density.setStep(0.0001);
	this.fog_density.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog.density = self.fog_density.getValue();
		}
	});
	this.fog_exponential_form.add(this.fog_density);
	this.fog_exponential_form.updateInterface();

	//Add exponential fog form
	this.form.add(this.fog_exponential_form);
	this.form.nextRow();

	//Physics world
	this.form.addText("Physics world");
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
}

//Super prototypes
ScenePanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
ScenePanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.default.setValue(this.obj.uuid === this.obj.parent.default_scene);
		
		if(this.obj.fog instanceof THREE.Fog)
		{
			this.fog.setValue(THREE.Fog.LINEAR);
			this.fog_linear_color.setValueHex(this.obj.fog.color.getHex());
			this.fog_near.setValue(this.obj.fog.near);
			this.fog_far.setValue(this.obj.fog.far);
			this.updateForms();
		}
		else if(this.obj.fog instanceof THREE.FogExp2)
		{
			this.fog.setValue(THREE.Fog.EXPONENTIAL);
			this.fog_exponential_color.setValueHex(this.obj.fog.color.getHex());
			this.fog_density.setValue(this.obj.fog.density);
			this.updateForms();
		}
		else
		{
			this.fog.setValue(THREE.Fog.NONE);
			this.updateForms();
		}

		if(this.obj.background !== null)
		{
			this.background.setValue(this.obj.background.r, this.obj.background.g, this.obj.background.b);
		}

		this.gravity.setValue(this.obj.world.gravity.x, this.obj.world.gravity.y, this.obj.world.gravity.z);
	}
}

//Update wich forms should be visible in the panel
ScenePanel.prototype.updateForms = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.fog_linear_form.visible = (this.obj.fog instanceof THREE.Fog) ? true : false;
		this.fog_linear_form.updateInterface();
		this.fog_exponential_form.visible = (this.obj.fog instanceof THREE.FogExp2) ? true : false;
		this.fog_exponential_form.updateInterface();
		this.form.updateInterface();
	}
}
