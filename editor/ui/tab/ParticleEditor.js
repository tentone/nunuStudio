"use strict";

function ParticleEditor(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "particle_editor" + ParticleEditor.id;
	ParticleEditor.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Main container
	this.main = new DualDivisionResizable(this.element);
	this.main.tab_position = 0.7;
	this.main.tab_position_min = 0.3;
	this.main.tab_position_max = 0.7;
	this.main.updateInterface();

	//Change main div aspect
	this.main.div_b.style.overflow = "auto";
	this.main.div_b.style.cursor = "default";
	this.main.div_b.style.backgroundColor = Editor.theme.panel_color;

	//Self pointer
	var self = this;

	//----------------------------Particle preview----------------------------
	//Canvas
	this.canvas = new Canvas(this.main.div_a);
	this.canvas.updateInterface();

	//Element atributes
	this.children = [];
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Particle renderer and scene
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = false;
	
	//Particle preview scene
	this.scene = new Scene();
	this.scene.add(new AmbientLight(0xffffff));
	var grid = new THREE.GridHelper(50, 50, 0x888888);
	grid.material.depthWrite = false;
	this.scene.add(grid);
	var axis = new THREE.AxisHelper(50);
	axis.material.depthWrite = false;
	this.scene.add(axis);

	//Particle
	this.particle = null;
	this.particle_runtime = null;

	//Camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y, 0.1, 10000000);
	this.camera_rotation = new THREE.Vector2(0, 0.5);
	this.camera_distance = 5;
	this.updateCamera();

	//-----------------------------Particle parameters------------------------------
	this.form = new Form(this.main.div_b);
	this.form.position.set(10, 8);
	this.form.spacing.set(10, 5);
	
	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.particle !== null)
		{
			self.particle.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture");
	this.form.nextRow();
	this.texture = new ImageBox(this.form.element);
	this.texture.size.set(100, 100);
	this.texture.updateInterface();
	this.texture.setOnChange(function(file)
	{
		self.particle.group.texture = new Texture(file);
		setTimeout(function()
		{
			self.updateRuntimeParticle();
		}, 100);
	});
	this.form.add(this.texture);
	this.form.nextRow();

	//Max particle count
	this.form.addText("Particle count");
	this.maxParticleCount = new NumberBox(this.form.element);
	this.maxParticleCount.size.set(100, 18);
	this.maxParticleCount.setOnChange(function()
	{
		self.particle.group.maxParticleCount = self.maxParticleCount.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.maxParticleCount);
	this.form.nextRow();

	//Blending mode
	this.form.addText("Blending Mode");
	this.blending = new DropdownList(this.form.element);
	this.blending.size.set(120, 18);
	this.blending.addValue("None", THREE.NoBlending);
	this.blending.addValue("Normal", THREE.NormalBlending);
	this.blending.addValue("Additive", THREE.AdditiveBlending);
	this.blending.addValue("Subtractive", THREE.SubtractiveBlending);
	this.blending.addValue("Multiply", THREE.MultiplyBlending);
	this.blending.setOnChange(function()
	{
		self.particle.group.blending = self.blending.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.blending);
	this.form.nextRow();

	//Direction (Time scale)
	this.form.addText("Direction");
	this.direction = new DropdownList(this.form.element);
	this.direction.size.set(100, 18);
	this.direction.addValue("Forward", 1);
	this.direction.addValue("Backward", -1);
	this.direction.setOnChange(function()
	{
		self.particle.emitter.direction = self.direction.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.direction);
	this.form.nextRow();

	//Particle Count
	this.form.addText("Particle rate");
	this.particleCount = new NumberBox(this.form.element);
	this.particleCount.size.set(100, 18);
	this.particleCount.setStep(1);
	this.particleCount.setOnChange(function()
	{
		self.particle.emitter.particleCount = self.particleCount.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.particleCount);
	this.form.nextRow();

	//Particle Duration
	this.form.addText("Duration");
	this.duration = new NumberBox(this.form.element);
	this.duration.size.set(60, 18);
	this.duration.setRange(0, Number.MAX_SAFE_INTEGER);
	this.duration.setOnChange(function()
	{
		var duration = self.duration.getValue();
		if(duration === 0)
		{
			duration = null;
		}
		self.particle.emitter.duration = duration;
		self.updateRuntimeParticle();
	});
	this.form.add(this.duration);
	this.form.nextRow();

	//Emmitter type
	this.form.addText("Emitter Type");
	this.type = new DropdownList(this.form.element);
	this.type.size.set(100, 18);
	this.type.addValue("Box", SPE.distributions.BOX);
	this.type.addValue("Sphere", SPE.distributions.SPHERE);
	this.type.addValue("Disc", SPE.distributions.DISC);
	this.type.setOnChange(function()
	{
		self.particle.emitter.type = self.type.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.type);
	this.form.nextRow();

	//Max age
	this.form.addText("Max Age");
	this.maxAge_value = new NumberBox(this.form.element);
	this.maxAge_value.size.set(60, 18);
	this.maxAge_value.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAge_value.setOnChange(function()
	{
		self.particle.emitter.maxAge.value = self.maxAge_value.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.maxAge_value);
	this.form.addText("+/-");
	this.maxAge_spread = new NumberBox(this.form.element);
	this.maxAge_spread.size.set(60, 18);
	this.maxAge_spread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAge_spread.setOnChange(function()
	{
		self.particle.emitter.maxAge.spread = self.maxAge_spread.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.maxAge_spread);
	this.form.nextRow();

	//Position
	this.form.addText("Position");
	this.position_value = new CoordinatesBox(this.form.element);
	this.position_value.setOnChange(function()
	{
		self.particle.emitter.position.value.copy(self.position_value.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.position_value);
	this.form.addText("+/-");
	this.position_spread = new CoordinatesBox(this.form.element);
	this.position_spread.setOnChange(function()
	{
		self.particle.emitter.position.spread.copy(self.position_spread.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.position_spread);
	this.form.nextRow();

	//Velocity
	this.form.addText("Velocity");
	this.velocity_value = new CoordinatesBox(this.form.element);
	this.velocity_value.setOnChange(function()
	{
		self.particle.emitter.velocity.value.copy(self.velocity_value.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.velocity_value);
	this.form.addText("+/-");
	this.velocity_spread = new CoordinatesBox(this.form.element);
	this.velocity_spread.setOnChange(function()
	{
		self.particle.emitter.velocity.spread.copy(self.velocity_spread.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.velocity_spread);
	this.form.nextRow();

	//Acceleration
	this.form.addText("Acceleration");
	this.acceleration_value = new CoordinatesBox(this.form.element);
	this.acceleration_value.setOnChange(function()
	{
		self.particle.emitter.acceleration.value.copy(self.acceleration_value.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.acceleration_value);
	this.form.addText("+/-");
	this.acceleration_spread = new CoordinatesBox(this.form.element);
	this.acceleration_spread.setOnChange(function()
	{
		self.particle.emitter.acceleration.spread.copy(self.acceleration_spread.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.acceleration_spread);
	this.form.nextRow();

	//Wiggle
	this.form.addText("Wiggle");
	this.wiggle_value = new NumberBox(this.form.element);
	this.wiggle_value.size.set(60, 18);
	this.wiggle_value.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggle_value.setOnChange(function()
	{
		self.particle.emitter.wiggle.value = self.wiggle_value.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.wiggle_value);
	this.form.addText("+/-");
	this.wiggle_spread = new NumberBox(this.form.element);
	this.wiggle_spread.size.set(60, 18);
	this.wiggle_spread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggle_spread.setOnChange(function()
	{
		self.particle.emitter.wiggle.spread = self.wiggle_spread.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.wiggle_spread);
	this.form.nextRow();
	
	//Opacity
	this.form.addText("Opacity");
	this.form.nextRow();
	this.opacity_value = [];
	this.opacity_spread = [];
	function addOpacityValue(index)
	{
		return function()
		{
			self.particle.emitter.opacity.value[index] = self.opacity_value[index].getValue();
			self.updateRuntimeParticle();
		};
	}
	function addOpacitySpread(index)
	{
		return function()
		{
			self.particle.emitter.opacity.spread[index] = self.opacity_spread[index].getValue();
			self.updateRuntimeParticle();
		};
	}
	for(var i = 0; i < 4; i++)
	{
		this.form.addText((25*i + 25) + "%");

		var value = new NumberBox(self.form.element);
		value.size.set(40, 18);
		value.setRange(0, 1.0);
		value.setStep(0.1);
		value.setOnChange(addOpacityValue(i));

		this.opacity_value[i] = value;
		this.form.add(value);
		this.form.addText("+/-");

		var spread = new NumberBox(self.form.element);
		spread.size.set(40, 18);
		spread.setRange(0, 1.0);
		spread.setStep(0.1);
		spread.setOnChange(addOpacitySpread(i));

		this.opacity_spread[i] = spread;
		this.form.add(spread);
		this.form.nextRow();
	}

	//Size
	this.form.addText("Size");
	this.form.nextRow();
	this.size_value = [];
	this.size_spread = [];
	function addSizeValue(index)
	{
		return function()
		{
			self.particle.emitter.size.value[index] = self.size_value[index].getValue();
			self.updateRuntimeParticle();
		};
	}
	function addSizeSpread(index)
	{
		return function()
		{
			self.particle.emitter.size.spread[index] = self.size_spread[index].getValue();
			self.updateRuntimeParticle();
		};
	}
	for(var i = 0; i < 4; i++)
	{
		this.form.addText((25*i + 25) + "%");

		var value = new NumberBox(self.form.element);
		value.size.set(40, 18);
		value.setStep(0.1);
		value.setOnChange(addSizeValue(i));

		this.size_value[i] = value;
		this.form.add(value);
		this.form.addText("+/-");

		var spread = new NumberBox(self.form.element);
		spread.size.set(40, 18);
		spread.setStep(0.1);
		spread.setOnChange(addSizeSpread(i));

		this.size_spread[i] = spread;
		this.form.add(spread);
		this.form.nextRow();
	}

	//Angle
	this.form.addText("Rotation");
	this.form.nextRow();
	this.angle_value = [];
	this.angle_spread = [];
	function addAngleValue(index)
	{
		return function()
		{
			self.particle.emitter.angle.value[index] = self.angle_value[index].getValue();
			self.updateRuntimeParticle();
		};
	}
	function addAngleSpread(index)
	{
		return function()
		{
			self.particle.emitter.angle.spread[index] = self.angle_spread[index].getValue();
			self.updateRuntimeParticle();
		};
	}
	for(var i = 0; i < 4; i++)
	{
		this.form.addText((25*i + 25) + "%");
		
		var value = new NumberBox(self.form.element);
		value.size.set(40, 18);
		value.setStep(0.1);
		value.setOnChange(addAngleValue(i));

		this.angle_value[i] = value;
		this.form.add(value);
		this.form.addText("+/-");

		var spread = new NumberBox(self.form.element);
		spread.size.set(40, 18);
		spread.setStep(0.1);
		spread.setOnChange(addAngleSpread(i));

		this.angle_spread[i] = spread;
		this.form.add(spread);
		this.form.nextRow();
	}

	//Color
	this.form.addText("Color");
	this.form.nextRow();
	this.color_value = [];
	this.color_spread = [];
	function addColorValue(index)
	{
		return function()
		{
			var color = self.color_value[index].getValue();
			self.particle.emitter.color.value[index].r = color.r;
			self.particle.emitter.color.value[index].g = color.g;
			self.particle.emitter.color.value[index].b = color.b;
			self.updateRuntimeParticle();
		};
	}
	function addColorSpread(index)
	{
		return function()
		{
			var color = self.color_spread[index].getValue();
			self.particle.emitter.color.spread[index].x = color.r;
			self.particle.emitter.color.spread[index].y = color.g;
			self.particle.emitter.color.spread[index].z = color.b;
			self.updateRuntimeParticle();
		};
	}
	for(var i = 0; i < 4; i++)
	{
		this.form.addText((25*i + 25) + "%");
		
		var value = new ColorChooser(self.form.element);
		value.size.set(80, 18);
		value.setOnChange(addColorValue(i));

		this.color_value[i] = value;
		this.form.add(value);
		this.form.addText("+/-");

		var spread = new ColorChooser(self.form.element);
		spread.size.set(80, 18);
		spread.setOnChange(addColorSpread(i));

		this.color_spread[i] = spread;
		this.form.add(spread);
		this.form.nextRow();
	}

	//Add element to document
	this.parent.appendChild(this.element);
}

//Particleeditor counter
ParticleEditor.id = 0;

//Functions Prototype
ParticleEditor.prototype.attachParticle = attachParticle;
ParticleEditor.prototype.activate = activate;
ParticleEditor.prototype.destroy = destroy;
ParticleEditor.prototype.update = update;
ParticleEditor.prototype.updateInterface = updateInterface;
ParticleEditor.prototype.updateMetadata = updateMetadata;
ParticleEditor.prototype.updateCamera = updateCamera;
ParticleEditor.prototype.updateRuntimeParticle = updateRuntimeParticle;

//Update container object data
function updateMetadata(container)
{
	if(this.particle !== null)
	{
		container.setName(this.particle.name);
	}
}

//Attach particle to particle editor
function attachParticle(particle)
{
	//Attach particle
	this.particle = particle;

	//Group attributes
	this.name.setText(particle.name);
	this.texture.setImage(particle.group.texture.image.src);
	this.maxParticleCount.setValue(particle.group.maxParticleCount);
	this.blending.setValue(particle.group.blending);
	this.direction.setValue(particle.emitter.direction);

	//Emitter attributes
	this.particleCount.setValue(particle.emitter.particleCount);
	if(particle.emitter.duration !== null)
	{
		this.duration.setValue(particle.emitter.duration);
	}
	else
	{
		this.duration.setValue(0);
	}
	this.type.setValue(particle.emitter.type);
	this.maxAge_value.setValue(particle.emitter.maxAge.value);
	this.maxAge_spread.setValue(particle.emitter.maxAge.spread);
	this.position_value.setValue(particle.emitter.position.value);
	this.position_spread.setValue(particle.emitter.position.spread);
	this.velocity_value.setValue(particle.emitter.velocity.value);
	this.velocity_spread.setValue(particle.emitter.velocity.spread);
	this.acceleration_value.setValue(particle.emitter.acceleration.value);
	this.acceleration_spread.setValue(particle.emitter.acceleration.spread);
	this.wiggle_value.setValue(particle.emitter.wiggle.value);
	this.wiggle_spread.setValue(particle.emitter.wiggle.spread);
	for(var i = 0; i < 4; i++)
	{
		this.opacity_value[i].setValue(particle.emitter.opacity.value[i]);
		this.opacity_spread[i].setValue(particle.emitter.opacity.spread[i]);
		this.size_value[i].setValue(particle.emitter.size.value[i]);
		this.size_spread[i].setValue(particle.emitter.size.spread[i]);
		this.angle_value[i].setValue(particle.emitter.angle.value[i]);
		this.angle_spread[i].setValue(particle.emitter.angle.spread[i]);
		var value = particle.emitter.color.value[i];
		this.color_value[i].setValue(value.r, value.g, value.b);
		var spread = particle.emitter.color.spread[i];
		this.color_spread[i].setValue(spread.x, spread.y, spread.z);
	}

	//Create runtime particle to preview particle
	this.updateRuntimeParticle();
}

//Updates runtime particle to match attached particle
function updateRuntimeParticle()
{
	if(this.particle !== null)
	{
		if(this.particle_runtime !== null)
		{
			this.scene.remove(this.particle_runtime);
		}

		this.particle_runtime = new ObjectLoader().parse(this.particle.toJSON());
		this.particle_runtime.scale.set(1, 1, 1);
		this.particle_runtime.position.set(0, 0, 0);
		this.particle_runtime.rotation.set(0, 0, 0);
		this.particle_runtime.initialize();
		this.scene.add(this.particle_runtime);
	}
}

//Update camera position and rotation from variables
function updateCamera()
{
	//Calculate direction vector
	var cos_angle_y = Math.cos(this.camera_rotation.y);
	var position = new THREE.Vector3(this.camera_distance * Math.cos(this.camera_rotation.x)*cos_angle_y, this.camera_distance * Math.sin(this.camera_rotation.y), this.camera_distance * Math.sin(this.camera_rotation.x)*cos_angle_y);
	this.camera.position.copy(position);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//Activate code editor
function activate()
{
	//Set editor state
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
	
	//Set mouse canvas
	Mouse.canvas = this.canvas.element;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update material editor
function update()
{
	//Update UI elements
	this.main.update();

	//Get mouse input
	if(Mouse.insideCanvas())
	{
		//Move camera
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			this.camera_rotation.x -= 0.003 * Mouse.delta.x;
			this.camera_rotation.y -= 0.003 * Mouse.delta.y;

			//Limit Vertical Rotation to 90 degrees
			var pid2 = 1.57;
			if(this.camera_rotation.y < -pid2)
			{
				this.camera_rotation.y = -pid2;
			}
			else if(this.camera_rotation.y > pid2)
			{
				this.camera_rotation.y = pid2;
			}
		}

		//Camera zoom
		this.camera_distance += Mouse.wheel * 0.005;
		if(this.camera_distance < 0.1)
		{
			this.camera_distance = 0.1;
		}

		this.updateCamera();
	}

	//Update particle and render
	if(this.particle_runtime !== null)
	{
		this.particle_runtime.update();
	}

	//Render editor scene
	this.renderer.render(this.scene, this.camera);
}

//Update division Size
function updateInterface()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update main container
	this.main.visible = this.visible;
	this.main.size.copy(this.size);
	this.main.updateInterface();

	//Update canvas
	this.canvas.visible = this.visible;
	this.canvas.size.set(this.main.div_a.offsetWidth, this.main.div_a.offsetHeight);
	this.canvas.updateInterface();

	//Update renderer and canvas
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.camera.aspect = this.canvas.size.x/this.canvas.size.y
	this.camera.updateProjectionMatrix();

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	//Update form
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
