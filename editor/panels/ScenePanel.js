 function ScenePanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name
	var text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(5, 20);
	text.updateInterface();

	this.name = new Textbox(this.element);
	this.name.position.set(45, 10);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateTreeView();
		}
	});

	//Select scene as default
	this.default = new Checkbox(this.element);
	this.default.setText("Default scene");
	this.default.size.set(200, 15);
	this.default.position.set(3, 35);
	this.default.updateInterface();
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var program = self.obj.parent;
			if(self.default.getValue())
			{
				program.initial_scene = self.obj.uuid;
			}
			else
			{
				program.initial_scene = null;
			}
		}
	});

	//Fog
	text = new Text(this.element);
	text.setAlignment(Text.LEFT);
	text.setText("Fog");
	text.position.set(5, 70);
	text.updateInterface();

	this.fog = new DropdownList(this.element);
	this.fog.position.set(45, 60);
	this.fog.size.set(100, 18);
	this.fog.addValue("Off", 0);
	this.fog.addValue("Linear", 1);
	this.fog.addValue("Exponential", 2);
	this.fog.updateInterface();
	this.fog.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.setFogMode(self.fog.getSelectedIndex());
			self.updateElementsVisibility();
		}
	});

	//Fog color
	this.fog_color_text = new Text(this.element);
	this.fog_color_text.setAlignment(Text.LEFT);
	this.fog_color_text.setText("Color");
	this.fog_color_text.position.set(5, 95);
	this.fog_color_text.updateInterface();

	this.fog_color = new ColorChooser(this.element);
	this.fog_color.size.set(80, 18);
	this.fog_color.position.set(45, 85);
	this.fog_color.updateInterface();
	this.fog_color.setOnChange(function()
	{
		if(self.obj !== null)
		{		
			self.obj.fog_color = self.fog_color.getValueHex();
			self.obj.updateFog();
		}
	});

	//Linear fog near
	this.fog_near_text = new Text(this.element);
	this.fog_near_text.setAlignment(Text.LEFT);
	this.fog_near_text.setText("Near");
	this.fog_near_text.position.set(5, 120);
	this.fog_near_text.updateInterface();

	this.fog_near = new Numberbox(this.element);
	this.fog_near.size.set(60, 18);
	this.fog_near.position.set(40, 110);
	this.fog_near.updateInterface();
	this.fog_near.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog_near = self.fog_near.getValue();
			self.obj.updateFog();
		}
	});

	//Exponential fog density
	this.fog_density_text = new Text(this.element);
	this.fog_density_text.setAlignment(Text.LEFT);
	this.fog_density_text.setText("Density");
	this.fog_density_text.position.set(5, 120);
	this.fog_density_text.updateInterface();

	this.fog_density = new Numberbox(this.element);
	this.fog_density.size.set(100, 18);
	this.fog_density.position.set(55, 110);
	this.fog_density.setStep(0.0001);
	this.fog_density.updateInterface();
	this.fog_density.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog_density = self.fog_density.getValue();
			self.obj.updateFog();
		}
	});

	//Linear fog far
	this.fog_far_text = new Text(this.element);
	this.fog_far_text.setAlignment(Text.LEFT);
	this.fog_far_text.setText("Far");
	this.fog_far_text.position.set(5, 145);
	this.fog_far_text.updateInterface();

	this.fog_far = new Numberbox(this.element);
	this.fog_far.size.set(60, 18);
	this.fog_far.position.set(35, 135);
	this.fog_far.updateInterface();
	this.fog_far.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fog_far = self.fog_far.getValue();
			self.obj.updateFog();
		}
	});
}

//Functions Prototype
ScenePanel.prototype = Object.create(Panel.prototype);
ScenePanel.prototype.attachObject = attachObject;
ScenePanel.prototype.updatePanel = updatePanel;
ScenePanel.prototype.updateElementsVisibility = updateElementsVisibility;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.default.setValue(this.obj.uuid === this.obj.parent.initial_scene);

		if(this.obj.fog instanceof THREE.Fog)
		{
			this.fog.setSelectedIndex(Scene.FOG_LINEAR);
		}
		else if(this.obj.fog instanceof THREE.FogExp2)
		{
			this.fog.setSelectedIndex(Scene.FOG_EXPONENTIAL);
		}
		else
		{
			this.fog.setSelectedIndex(Scene.FOG_NONE);
		}
		this.fog_color.setValueHex(this.obj.fog_color);
		this.fog_near.setValue(this.obj.fog_near);
		this.fog_far.setValue(this.obj.fog_far);
		this.fog_density.setValue(this.obj.fog_density);

		this.updateElementsVisibility();
	}
}

//Update wich elements should be visible
function updateElementsVisibility()
{
	if(this.obj.fog !== null)
	{
		this.fog_color_text.visible = true;
		this.fog_color.visible = true;
		if(this.obj.fog instanceof THREE.Fog)
		{
			this.fog_near_text.visible = true;
			this.fog_near.visible = true;
			this.fog_far_text.visible = true;
			this.fog_far.visible = true;
			this.fog_density_text.visible = false;
			this.fog_density.visible = false;
		}
		else if(this.obj.fog instanceof THREE.FogExp2)
		{
			this.fog_near_text.visible = false;
			this.fog_near.visible = false;
			this.fog_far_text.visible = false;
			this.fog_far.visible = false;
			this.fog_density_text.visible = true;
			this.fog_density.visible = true;
		}
	}
	else
	{
		this.fog_color_text.visible = false;
		this.fog_color.visible = false;
		this.fog_near_text.visible = false;
		this.fog_near.visible = false;
		this.fog_far_text.visible = false;
		this.fog_far.visible = false;
		this.fog_density_text.visible = false;
		this.fog_density.visible = false;
	}

	this.fog_color_text.updateInterface();
	this.fog_color.updateInterface();
	this.fog_near_text.updateInterface();
	this.fog_near.updateInterface();
	this.fog_far_text.updateInterface();
	this.fog_far.updateInterface();
	this.fog_density_text.updateInterface();
	this.fog_density.updateInterface();
}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
}
