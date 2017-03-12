"use strict";

function ParticleEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Particle", "editor/files/icons/effects/particles.png");

	//Main container
	this.main = new DualDivisionResizable(this.element);
	this.main.tabPosition = 0.6;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;

	//Change main div aspect
	this.main.divB.style.overflow = "auto";
	this.main.divB.style.cursor = "default";
	this.main.divB.style.backgroundColor = Editor.theme.panelColor;

	//Self pointer
	var self = this;

	//Canvas
	this.canvas = new Canvas(this.main.divA);

	//Element atributes
	this.children = [];

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = false;
	
	//Particle preview
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
	this.particleRuntime = null;

	//Camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y);
	this.cameraRotation = new THREE.Vector2(0, 0.5);
	this.cameraDistance = 5;
	this.updateCamera();

	//Form
	this.form = new Form(this.main.divB);
	this.form.defaultTextWidth = 80;
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
	this.texture = new TextureChooser(this.form.element);
	this.texture.size.set(100, 100);
	this.texture.setOnChange(function(file)
	{
		self.particle.group.texture = self.texture.getValue();
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
	this.maxParticleCount.setStep(1.0);
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
	this.blending.size.set(100, 18);
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
	this.particleCount.size.set(50, 18);
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
	this.duration.size.set(50, 18);
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
	this.maxAgeValue = new NumberBox(this.form.element);
	this.maxAgeValue.size.set(60, 18);
	this.maxAgeValue.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAgeValue.setOnChange(function()
	{
		self.particle.emitter.maxAge.value = self.maxAgeValue.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.maxAgeValue);
	this.form.addText("+/-", true);
	this.maxAgeSpread = new NumberBox(this.form.element);
	this.maxAgeSpread.size.set(60, 18);
	this.maxAgeSpread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAgeSpread.setOnChange(function()
	{
		self.particle.emitter.maxAge.spread = self.maxAgeSpread.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.maxAgeSpread);
	this.form.nextRow();

	//Position
	this.form.addText("Position");
	this.form.nextRow();

	this.form.addText("Initial");
	this.positionValue = new CoordinatesBox(this.form.element);
	this.positionValue.setOnChange(function()
	{
		self.particle.emitter.position.value.copy(self.positionValue.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.positionValue);
	this.form.nextRow();

	this.form.addText("Variation");
	this.positionSpread = new CoordinatesBox(this.form.element);
	this.positionSpread.setOnChange(function()
	{
		self.particle.emitter.position.spread.copy(self.positionSpread.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.positionSpread);
	this.form.nextRow();

	//Velocity
	this.form.addText("Velocity");
	this.form.nextRow();

	this.form.addText("Initial");
	this.velocityValue = new CoordinatesBox(this.form.element);
	this.velocityValue.setOnChange(function()
	{
		self.particle.emitter.velocity.value.copy(self.velocityValue.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.velocityValue);
	this.form.nextRow();

	this.form.addText("Variation");
	this.velocitySpread = new CoordinatesBox(this.form.element);
	this.velocitySpread.setOnChange(function()
	{
		self.particle.emitter.velocity.spread.copy(self.velocitySpread.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.velocitySpread);
	this.form.nextRow();

	//Acceleration
	this.form.addText("Acceleration");
	this.form.nextRow();

	this.form.addText("Initial");
	this.accelerationValue = new CoordinatesBox(this.form.element);
	this.accelerationValue.setOnChange(function()
	{
		self.particle.emitter.acceleration.value.copy(self.accelerationValue.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.accelerationValue);
	this.form.nextRow();

	this.form.addText("Variation");
	this.accelerationSpread = new CoordinatesBox(this.form.element);
	this.accelerationSpread.setOnChange(function()
	{
		self.particle.emitter.acceleration.spread.copy(self.accelerationSpread.getValue());
		self.updateRuntimeParticle();
	});
	this.form.add(this.accelerationSpread);
	this.form.nextRow();

	//Wiggle
	this.form.addText("Wiggle");
	this.wiggleValue = new NumberBox(this.form.element);
	this.wiggleValue.size.set(60, 18);
	this.wiggleValue.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggleValue.setOnChange(function()
	{
		self.particle.emitter.wiggle.value = self.wiggleValue.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.wiggleValue);
	this.form.addText("+/-", true);
	this.wiggleSpread = new NumberBox(this.form.element);
	this.wiggleSpread.size.set(60, 18);
	this.wiggleSpread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggleSpread.setOnChange(function()
	{
		self.particle.emitter.wiggle.spread = self.wiggleSpread.getValue();
		self.updateRuntimeParticle();
	});
	this.form.add(this.wiggleSpread);
	this.form.nextRow();
	
	//Opacity
	this.form.addText("Opacity");
	this.form.nextRow();
	this.opacity = new Graph(this.form.element);
	this.opacity.size.set(200, 120)
	this.opacity.setOnChange(function(value)
	{
		self.particle.emitter.opacity.value = value;
		self.particleRuntime.emitter.opacity.value = value;
	});
	this.opacity.addGraph("spread", "#AAAAAA");
	this.opacity.setOnChange(function(value)
	{
		self.particle.emitter.opacity.spread = value;
		self.particleRuntime.emitter.opacity.spread = value;
	}, "spread");
	this.form.add(this.opacity);
	this.form.nextRow();

	//Size
	this.form.addText("Scale");
	this.form.nextRow();
	this.scale = new Graph(this.form.element);
	this.scale.size.set(200, 120)
	this.scale.setOnChange(function(value)
	{
		self.particle.emitter.size.value = value;
		self.particleRuntime.emitter.size.value = value;
	});
	this.scale.addGraph("spread", "#AAAAAA");
	this.scale.setOnChange(function(value)
	{
		self.particle.emitter.size.spread = value;
		self.particleRuntime.emitter.size.spread = value;
	}, "spread");
	this.form.add(this.scale);
	this.form.nextRow();
	this.form.addText("Min", true);
	this.scaleMin = new NumberBox(this.form.element);
	this.scaleMin.size.set(50, 18);
	this.scaleMin.setOnChange(function()
	{
		var min = self.scaleMin.getValue();
		var max = self.scaleMax.getValue();
		self.scale.setRange(min, max);
	});
	this.form.add(this.scaleMin);
	this.form.addText("Max", true);
	this.scaleMax = new NumberBox(this.form.element);
	this.scaleMax.size.set(50, 18);
	this.scaleMax.setOnChange(function()
	{
		var min = self.scaleMin.getValue();
		var max = self.scaleMax.getValue();
		self.scale.setRange(min, max);
	});
	this.form.add(this.scaleMax);
	this.form.nextRow();

	//Angle
	this.form.addText("Rotation");
	this.form.nextRow();
	this.angle = new Graph(this.form.element);
	this.angle.size.set(200, 120)
	this.angle.setOnChange(function(value)
	{
		self.particle.emitter.angle.value = value;
		self.particleRuntime.emitter.angle.value = value;
	});
	this.angle.addGraph("spread", "#AAAAAA");
	this.angle.setOnChange(function(value)
	{
		self.particle.emitter.angle.spread = value;
		self.particleRuntime.emitter.angle.spread = value;
	}, "spread");
	this.form.add(this.angle);
	this.form.nextRow();
	this.form.addText("Min", true);
	this.angleMin = new NumberBox(this.form.element);
	this.angleMin.size.set(50, 18);
	this.angleMin.setOnChange(function()
	{
		var min = self.angleMin.getValue();
		var max = self.angleMax.getValue();
		self.angle.setRange(min, max);
	});
	this.form.add(this.angleMin);
	this.form.addText("Max", true);
	this.angleMax = new NumberBox(this.form.element);
	this.angleMax.size.set(50, 18);
	this.angleMax.setOnChange(function()
	{
		var min = self.angleMin.getValue();
		var max = self.angleMax.getValue();
		self.angle.setRange(min, max);
	});
	this.form.add(this.angleMax);
	this.form.nextRow();

	//Color
	this.form.addText("Color");
	this.form.nextRow();
	this.colorValue = [];
	this.colorSpread = [];

	function addColorValue(index)
	{
		return function()
		{
			var color = self.colorValue[index].getValue();
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
			var color = self.colorSpread[index].getValue();
			self.particle.emitter.color.spread[index].x = color.r;
			self.particle.emitter.color.spread[index].y = color.g;
			self.particle.emitter.color.spread[index].z = color.b;
			self.updateRuntimeParticle();
		};
	}
	
	for(var i = 0; i < 4; i++)
	{
		this.form.addText((25*i + 25) + "%", true);
		
		var value = new ColorChooser(self.form.element);
		value.size.set(80, 18);
		value.setOnChange(addColorValue(i));

		this.colorValue[i] = value;
		this.form.add(value);
		this.form.addText("+/-", true);

		var spread = new ColorChooser(self.form.element);
		spread.size.set(80, 18);
		spread.setOnChange(addColorSpread(i));

		this.colorSpread[i] = spread;
		this.form.add(spread);
		this.form.nextRow();
	}
}

ParticleEditor.prototype = Object.create(TabElement.prototype);

//Update object data
ParticleEditor.prototype.updateMetadata = function()
{
	if(this.particle !== null)
	{
		var particle = this.particle;

		this.setName(particle.name);

		//Check if particle exists in program
		var found = false;
		Editor.program.traverse(function(obj)
		{
			if(obj.uuid === particle.uuid)
			{
				found = true;
			}
		});

		//If not found close tab
		if(!found)
		{
			this.close();
		}
	}
}

//Attach particle to particle editor
ParticleEditor.prototype.attach = function(particle)
{
	//Attach particle
	this.particle = particle;
	this.updateMetadata();
	
	//Group attributes
	this.name.setText(particle.name);
	this.texture.setValue(particle.group.texture);
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
	this.maxAgeValue.setValue(particle.emitter.maxAge.value);
	this.maxAgeSpread.setValue(particle.emitter.maxAge.spread);
	this.positionValue.setValue(particle.emitter.position.value);
	this.positionSpread.setValue(particle.emitter.position.spread);
	this.velocityValue.setValue(particle.emitter.velocity.value);
	this.velocitySpread.setValue(particle.emitter.velocity.spread);
	this.accelerationValue.setValue(particle.emitter.acceleration.value);
	this.accelerationSpread.setValue(particle.emitter.acceleration.spread);
	this.wiggleValue.setValue(particle.emitter.wiggle.value);
	this.wiggleSpread.setValue(particle.emitter.wiggle.spread);

	this.opacity.setValue(particle.emitter.opacity.value);
	this.opacity.setValue(particle.emitter.opacity.spread, "spread");

	this.scale.setValue(particle.emitter.size.value);
	this.scale.setValue(particle.emitter.size.spread, "spread");
	this.scaleMin.setValue(this.scale.min);
	this.scaleMax.setValue(this.scale.max);

	this.angle.setValue(particle.emitter.angle.value);
	this.angle.setValue(particle.emitter.angle.spread, "spread");
	this.angleMin.setValue(this.angle.min);
	this.angleMax.setValue(this.angle.max);

	for(var i = 0; i < 4; i++)
	{
		var value = particle.emitter.color.value[i];
		this.colorValue[i].setValue(value.r, value.g, value.b);
		var spread = particle.emitter.color.spread[i];
		this.colorSpread[i].setValue(spread.x, spread.y, spread.z);
	}

	//Create runtime particle to preview particle
	this.updateRuntimeParticle();
}

//Check if particle is attached to tab
ParticleEditor.prototype.isAttached = function(particle)
{
	return this.particle === particle;
}

//Updates runtime particle to match attached particle
ParticleEditor.prototype.updateRuntimeParticle = function()
{
	if(this.particle !== null)
	{
		if(this.particleRuntime !== null)
		{
			this.scene.remove(this.particleRuntime);
		}

		this.particleRuntime = new ObjectLoader().parse(this.particle.toJSON());
		this.particleRuntime.visible = true;
		this.particleRuntime.scale.set(1, 1, 1);
		this.particleRuntime.position.set(0, 0, 0);
		this.particleRuntime.rotation.set(0, 0, 0);
		this.particleRuntime.initialize();
		this.scene.add(this.particleRuntime);
	}
}

//Update camera position and rotation from variables
ParticleEditor.prototype.updateCamera = function()
{
	//Calculate direction vector
	var cosAngleY = Math.cos(this.cameraRotation.y);
	var position = new THREE.Vector3(this.cameraDistance * Math.cos(this.cameraRotation.x)*cosAngleY, this.cameraDistance * Math.sin(this.cameraRotation.y), this.cameraDistance * Math.sin(this.cameraRotation.x)*cosAngleY);
	this.camera.position.copy(position);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//Activate code editor
ParticleEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);
		
	//Set editor state
	
	Editor.resetEditingFlags();
	
	//Set mouse canvas
	Editor.mouse.setCanvas(this.canvas.element);
}

//Update material editor
ParticleEditor.prototype.update = function()
{
	//Graphs
	this.opacity.update();
	this.scale.update();
	this.angle.update();
	
	//Get mouse input
	if(Editor.mouse.insideCanvas())
	{
		//Move camera
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			this.cameraRotation.x -= 0.003 * Editor.mouse.delta.x;
			this.cameraRotation.y -= 0.003 * Editor.mouse.delta.y;

			//Limit Vertical Rotation to 90 degrees
			var pid2 = 1.57;
			if(this.cameraRotation.y < -pid2)
			{
				this.cameraRotation.y = -pid2;
			}
			else if(this.cameraRotation.y > pid2)
			{
				this.cameraRotation.y = pid2;
			}
		}

		//Camera zoom
		this.cameraDistance += Editor.mouse.wheel * 0.005;
		if(this.cameraDistance < 0.1)
		{
			this.cameraDistance = 0.1;
		}

		this.updateCamera();
	}

	//Update particle and render
	if(this.particleRuntime !== null)
	{
		this.particleRuntime.update();
	}

	//Render editor scene
	this.renderer.render(this.scene, this.camera);
}

//Update division Size
ParticleEditor.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Main container
		this.main.visible = this.visible;
		this.main.size.copy(this.size);
		this.main.updateInterface();

		//Canvas
		this.canvas.visible = this.visible;
		this.canvas.size.set(this.main.divA.offsetWidth, this.main.divA.offsetHeight);
		this.canvas.updateInterface();

		//Renderer and canvas
		this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
		this.camera.aspect = this.canvas.size.x/this.canvas.size.y
		this.camera.updateProjectionMatrix();

		//Children
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].visible = this.visible;
			this.children[i].updateInterface();
		}

		//Form
		this.form.visible = this.visible;
		this.form.updateInterface();

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
}
