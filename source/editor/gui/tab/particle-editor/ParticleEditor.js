"use strict";

/**
 * Particle editor is used to edit particle emitter objects visually.
 *
 * Allows the user to change all the parameters of the emitter.
 */
function ParticleEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.particle, Global.FILE_PATH + "icons/misc/particles.png");

	var self = this;

	// Canvas
	this.canvas = new RendererCanvas();
	this.canvas.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});

	// Mouse
	this.mouse = new Mouse(window, true);
	this.mouse.setCanvas(this.canvas.element);

	// Particle preview
	this.scene = new THREE.Scene();
	this.scene.matrixAutoUpdate = false;
	this.scene.add(new THREE.GridHelper(50, 50, 0x888888));
	this.scene.add(new THREE.AxesHelper(50));

	// Particle
	this.particle = null;

	// Camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x / this.canvas.size.y);
	this.cameraRotation = new THREE.Vector2(0, 0.5);
	this.cameraDistance = 5;
	this.updateCamera();
	this.scene.add(this.camera);

	this.form = new TableForm();
	this.form.setAutoSize(false);

	// Main
	this.main = new DualContainer(this);
	this.main.tabPosition = 0.6;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;
	this.main.attachA(this.canvas);
	this.main.attachB(this.form);

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	// Texture map
	this.form.addText(Locale.texture);
	this.texture = new TextureChooser(this.form);
	this.texture.size.set(100, 100);
	this.texture.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.particle.group, "texture", self.texture.getValue()));
		self.particle.reload();
	});
	this.form.add(this.texture);
	this.form.nextRow();

	// Max particle count
	this.form.addText("Particle Count");
	this.maxParticleCount = new NumberBox(this.form);
	this.maxParticleCount.setStep(1.0);
	this.maxParticleCount.size.set(100, 18);
	this.maxParticleCount.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.group, "maxParticleCount", self.maxParticleCount.getValue()));
		self.particle.reload();
	});
	this.form.add(this.maxParticleCount);
	this.form.nextRow();

	// Blending mode
	this.form.addText(Locale.blendingMode);
	this.blending = new DropdownList(this.form);
	this.blending.size.set(100, 18);
	this.blending.addValue(Locale.none, THREE.NoBlending);
	this.blending.addValue(Locale.normal, THREE.NormalBlending);
	this.blending.addValue(Locale.additive, THREE.AdditiveBlending);
	this.blending.addValue(Locale.subtractive, THREE.SubtractiveBlending);
	this.blending.addValue(Locale.multiply, THREE.MultiplyBlending);
	this.blending.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.group, "blending", self.blending.getValue()));
		self.particle.reload();
	});
	this.form.add(this.blending);
	this.form.nextRow();

	// Direction (Time scale)
	this.form.addText(Locale.direction);
	this.direction = new DropdownList(this.form);
	this.direction.size.set(100, 18);
	this.direction.addValue(Locale.forward, 1);
	this.direction.addValue(Locale.backward, -1);
	this.direction.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter, "direction", self.direction.getValue()));
		self.particle.reload();
	});
	this.form.add(this.direction);
	this.form.nextRow();

	// Particle Count
	this.form.addText("Particle Rate");
	this.particleCount = new NumberBox(this.form);
	this.particleCount.size.set(50, 18);
	this.particleCount.setStep(1);
	this.particleCount.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter, "particleCount", self.particleCount.getValue()));
		self.particle.reload();
	});
	this.form.add(this.particleCount);
	this.form.nextRow();

	// Particle Duration
	this.form.addText(Locale.duration);
	this.duration = new NumberBox(this.form);
	this.duration.size.set(50, 18);
	this.duration.setRange(0, Number.MAX_SAFE_INTEGER);
	this.duration.setOnChange(function()
	{
		var duration = self.duration.getValue();
		if(duration === 0)
		{
			duration = null;
		}

		Editor.addAction(new ChangeAction(self.particle.emitter, "duration", duration));
		self.particle.reload();
	});
	this.form.add(this.duration);
	this.form.nextRow();

	// Emmitter type
	this.form.addText(Locale.emitterType);
	this.type = new DropdownList(this.form);
	this.type.size.set(100, 18);
	this.type.addValue(Locale.box, ParticleDistributions.BOX);
	this.type.addValue(Locale.sphere, ParticleDistributions.SPHERE);
	this.type.addValue(Locale.disc, ParticleDistributions.DISC);
	this.type.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter, "type", self.type.getValue()));
		self.particle.reload();
	});
	this.form.add(this.type);
	this.form.nextRow();

	// Max age
	this.form.addText(Locale.age);
	this.ageRow = new NumberRow(this.form);
	this.ageRow.labelSize = 20;
	this.ageRow.size.set(0, 18);

	this.maxAgeValue = this.ageRow.addValue("F");
	this.maxAgeValue.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAgeValue.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.maxAge, "value", self.maxAgeValue.getValue()));
		self.particle.reload();
	});

	this.maxAgeSpread = this.ageRow.addValue("+/-");
	this.maxAgeSpread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxAgeSpread.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.maxAge, "spread", self.maxAgeSpread.getValue()));
		self.particle.reload();
	});

	this.form.add(this.ageRow);
	this.form.nextRow();

	// Position
	this.form.addText(Locale.position);
	this.form.nextRow();

	this.form.addText(Locale.initial);
	this.positionValue = new VectorBox(this.form);
	this.positionValue.size.set(0, 18);
	this.positionValue.setOnChange(function()
	{
		self.particle.emitter.position.value.copy(self.positionValue.getValue());
		self.particle.reload();
	});
	this.form.add(this.positionValue);
	this.form.nextRow();

	this.form.addText(Locale.variation);
	this.positionSpread = new VectorBox(this.form);
	this.positionSpread.size.set(0, 18);
	this.positionSpread.setOnChange(function()
	{
		self.particle.emitter.position.spread.copy(self.positionSpread.getValue());
		self.particle.reload();
	});
	this.form.add(this.positionSpread);
	this.form.nextRow();

	// Velocity
	this.form.addText(Locale.velocity);
	this.form.nextRow();

	this.form.addText(Locale.initial);
	this.velocityValue = new VectorBox(this.form);
	this.velocityValue.size.set(0, 18);
	this.velocityValue.setOnChange(function()
	{
		self.particle.emitter.velocity.value.copy(self.velocityValue.getValue());
		self.particle.reload();
	});
	this.form.add(this.velocityValue);
	this.form.nextRow();

	this.form.addText(Locale.variation);
	this.velocitySpread = new VectorBox(this.form);
	this.velocitySpread.size.set(0, 18);
	this.velocitySpread.setOnChange(function()
	{
		self.particle.emitter.velocity.spread.copy(self.velocitySpread.getValue());
		self.particle.reload();
	});
	this.form.add(this.velocitySpread);
	this.form.nextRow();

	// Acceleration
	this.form.addText(Locale.acceleration);
	this.form.nextRow();

	this.form.addText(Locale.initial);
	this.accelerationValue = new VectorBox(this.form);
	this.accelerationValue.size.set(0, 18);
	this.accelerationValue.setOnChange(function()
	{
		self.particle.emitter.acceleration.value.copy(self.accelerationValue.getValue());
		self.particle.reload();
	});
	this.form.add(this.accelerationValue);
	this.form.nextRow();

	this.form.addText(Locale.variation);
	this.accelerationSpread = new VectorBox(this.form);
	this.accelerationSpread.size.set(0, 18);
	this.accelerationSpread.setOnChange(function()
	{
		self.particle.emitter.acceleration.spread.copy(self.accelerationSpread.getValue());
		self.particle.reload();
	});
	this.form.add(this.accelerationSpread);
	this.form.nextRow();

	// Wiggle
	this.form.addText(Locale.wiggle);
	this.wiggleRow = new NumberRow(this.form);
	this.wiggleRow.labelSize = 20;
	this.wiggleRow.size.set(0, 18);

	this.wiggleValue = this.wiggleRow.addValue("F");
	this.wiggleValue.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggleValue.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.wiggle, "value", self.wiggleValue.getValue()));
		self.particle.reload();
	});

	this.wiggleSpread = this.wiggleRow.addValue("+/-");
	this.wiggleSpread.setRange(0, Number.MAX_SAFE_INTEGER);
	this.wiggleSpread.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.wiggle, "spread", self.wiggleSpread.getValue()));
		self.particle.reload();
	});

	this.form.add(this.wiggleRow);
	this.form.nextRow();
	
	// Opacity graph
	this.form.addText(Locale.opacity);
	this.opacity = new Graph(this.form);
	this.opacity.size.set(200, 120)
	this.opacity.setOnChange(function(value)
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.opacity, "value", value));
	});
	this.opacity.addGraph("spread", DOMUtils.getCSSVariable("--color-graph"));
	this.opacity.setOnChange(function(value)
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.opacity, "spread", value));
	}, "spread");
	this.form.add(this.opacity);
	this.form.nextRow();

	// Scale
	this.form.addText(Locale.scale);
	this.sizeRow = new NumberRow(this.form);
	this.sizeRow.labelSize = 35;
	this.sizeRow.size.set(0, 18);

	this.scaleMin = this.sizeRow.addValue(Locale.min);
	this.scaleMin.setOnChange(function()
	{
		var min = self.scaleMin.getValue();
		var max = self.scaleMax.getValue();
		self.scale.setRange(min, max);
	});

	this.scaleMax = this.sizeRow.addValue(Locale.max);
	this.scaleMax.setOnChange(function()
	{
		var min = self.scaleMin.getValue();
		var max = self.scaleMax.getValue();
		self.scale.setRange(min, max);
	});

	this.form.add(this.sizeRow);
	this.form.nextRow();

	// Scale graph
	this.form.addText("");
	this.scale = new Graph(this.form);
	this.scale.size.set(200, 120)
	this.scale.setOnChange(function(value)
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.size, "value", value));
	});
	this.scale.addGraph("spread", DOMUtils.getCSSVariable("--color-graph"));
	this.scale.setOnChange(function(value)
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.size, "spread", value));
	}, "spread");
	this.form.add(this.scale);
	this.form.nextRow();

	// Rotation
	this.form.addText(Locale.rotation);
	this.angleRow = new NumberRow(this.form);
	this.angleRow.labelSize = 35;
	this.angleRow.size.set(0, 18);

	this.angleMin = this.angleRow.addValue(Locale.min);
	this.angleMin.setOnChange(function()
	{
		var min = self.angleMin.getValue();
		var max = self.angleMax.getValue();
		self.angle.setRange(min, max);
	});

	this.angleMax = this.angleRow.addValue(Locale.max);
	this.angleMax.setOnChange(function()
	{
		var min = self.angleMin.getValue();
		var max = self.angleMax.getValue();
		self.angle.setRange(min, max);
	});

	this.form.add(this.angleRow);
	this.form.nextRow();

	// Rotation graph
	this.form.addText("");
	this.angle = new Graph(this.form);
	this.angle.size.set(200, 120)
	this.angle.setOnChange(function(value)
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.angle, "value", value));
	});
	this.angle.addGraph("spread", DOMUtils.getCSSVariable("--color-graph"));
	this.angle.setOnChange(function(value)
	{
		Editor.addAction(new ChangeAction(self.particle.emitter.angle, "spread", value));
	}, "spread");
	this.form.add(this.angle);
	this.form.nextRow();

	// Color
	this.form.addText(Locale.color);
	this.form.nextRow();

	this.form.addText(Locale.base);
	this.colorValue = new ColorGradientChooser(this.form);
	this.colorValue.size.set(190, 18);
	this.colorValue.setOnChange(function(color, index)
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.particle.emitter.color.value, index, color.clone()), function()
		{
			self.particle.reload();
		}));
	});
	this.form.add(this.colorValue);
	this.form.nextRow();
	
	this.form.addText(Locale.spread);
	this.colorSpread = new ColorGradientChooser(this.form);
	this.colorSpread.size.set(190, 18);
	this.colorSpread.setOnChange(function(color, index)
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.particle.emitter.color.spread, index, new THREE.Vector3(color.r, color.g, color.b)), function()
		{
			self.particle.reload();
		}));
	});
	this.form.add(this.colorSpread);
	this.form.nextRow();
}

ParticleEditor.prototype = Object.create(TabComponent.prototype);

// Update object data
ParticleEditor.prototype.updateMetadata = function()
{
	if(this.particle !== null)
	{
		this.setName(this.particle.name);
		this.name.setText(this.particle.name);
		
		// Check if object has a parent
		if(this.particle.parent === null)
		{
			this.close();
			return;
		}

		// Check if object exists in parent
		var children = this.particle.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.particle.uuid === children[i].uuid)
			{
				return;
			}
		}

		// If not found close tab
		if(i >= children.length)
		{
			this.close();
		}
	}
};

// Attach particle to particle editor
ParticleEditor.prototype.attach = function(particle)
{
	// Attach particle
	this.particle = particle;
	this.updateMetadata();
	
	// Group attributes
	this.name.setText(particle.name);
	this.texture.setValue(particle.group.texture);
	this.maxParticleCount.setValue(particle.group.maxParticleCount);
	this.blending.setValue(particle.group.blending);
	this.direction.setValue(particle.emitter.direction);

	// Emitter attributes
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

	this.colorValue.setValue(particle.emitter.color.value);

	var colorSpread = [];
	for(var i = 0; i < 4; i++)
	{
		var color = particle.emitter.color.spread[i];
		colorSpread.push(new THREE.Color(color.x, color.y, color.z));
	}
	this.colorSpread.setValue(colorSpread);

	// Create runtime particle to preview particle
	this.particle.reload();
};

// Update camera position and rotation from variables
ParticleEditor.prototype.updateCamera = function()
{
	// Calculate direction vector
	var cosAngleY = Math.cos(this.cameraRotation.y);
	var position = new THREE.Vector3(this.cameraDistance * Math.cos(this.cameraRotation.x) * cosAngleY, this.cameraDistance * Math.sin(this.cameraRotation.y), this.cameraDistance * Math.sin(this.cameraRotation.x)*cosAngleY);
	this.camera.position.copy(position);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
};

ParticleEditor.prototype.isAttached = function(particle)
{
	return this.particle === particle;
};

ParticleEditor.prototype.activate = function()
{
	TabComponent.prototype.activate.call(this);

	this.mouse.create();
};

ParticleEditor.prototype.deactivate = function()
{
	TabComponent.prototype.deactivate.call(this);

	this.mouse.dispose();
};

ParticleEditor.prototype.destroy = function()
{
	TabComponent.prototype.destroy.call(this);
	
	this.mouse.dispose();
	this.canvas.destroy();
};

// Update material editor
ParticleEditor.prototype.update = function()
{
	this.mouse.update();

	if(this.mouse.insideCanvas())
	{
		// Move camera
		if(this.mouse.buttonPressed(Mouse.LEFT))
		{
			this.cameraRotation.x -= 0.003 * this.mouse.delta.x;
			this.cameraRotation.y -= 0.003 * this.mouse.delta.y;

			// Limit Vertical Rotation to 90 degrees
			if(this.cameraRotation.y < -1.57)
			{
				this.cameraRotation.y = -1.57;
			}
			else if(this.cameraRotation.y > 1.57)
			{
				this.cameraRotation.y = 1.57;
			}
		}

		// Camera zoom
		this.cameraDistance += this.mouse.wheel * 0.005;
		if(this.cameraDistance < 0.1)
		{
			this.cameraDistance = 0.1;
		}

		this.updateCamera();
	}
	
	this.particle.matrixWorld.getInverse(this.scene.matrixWorld);

	// Render grid and axis
	this.canvas.renderer.clear(true, true, true);
	this.canvas.renderer.render(this.scene, this.camera);
	this.canvas.renderer.render(this.particle, this.camera);
};

ParticleEditor.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.main.size.copy(this.size);
	this.main.updateInterface();
};
