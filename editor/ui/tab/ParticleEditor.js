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

	//Set main div B as panel
	this.main.div_b.className = "panel";

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
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: true});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;
	
	//Particle preview scene
	this.scene = new Scene();
	this.scene.add(new PointLight(0x666666));
	this.scene.add(new AmbientLight(0x444444));
	this.scene.add(new THREE.GridHelper(50, 1));
	this.scene.add(new THREE.AxisHelper(50));

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
	this.name = new Textbox(this.form.element);
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
	this.texture = new Imagebox(this.form.element);
	this.texture.size.set(100, 100);
	this.texture.updateInterface();
	this.texture.setOnChange(function(file)
	{
		var texture = new Texture(file);

		//Set particle texture
		self.particle.group.texture = texture;
		self.particle.updateValues();

		//Set runtime particle texture
		self.particle_runtime.group.texture = texture;
		self.particle_runtime.updateValues();
	});
	this.form.add(this.texture);
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
		self.particle.updateValues();

		self.particle_runtime.group.blending = self.blending.getValue();
		self.particle_runtime.updateValues();
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
		var direction = self.direction.getValue();
		self.particle.emitter.direction = direction;
		self.particle_runtime.emitter.direction = direction;
	});
	this.form.add(this.direction);
	this.form.nextRow();

	//Particle Count
	this.form.addText("Particle Count");
	this.particleCount = new Numberbox(this.form.element);
	this.particleCount.size.set(100, 18);
	this.particleCount.setOnChange(function()
	{
		var particleCount = self.particleCount.getValue();
		self.particle.emitter.particleCount = particleCount;
		self.particle_runtime.emitter.particleCount = particleCount;
	});
	this.form.add(this.particleCount);
	this.form.nextRow();

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
ParticleEditor.prototype.updateContainerMetaData = updateContainerMetaData;
ParticleEditor.prototype.updateCamera = updateCamera;

//Update container object data
function updateContainerMetaData(container)
{
	if(this.particle !== null)
	{
		container.setName(this.particle.name);
	}
}

//Attach particle to particle editor
function attachParticle(particle)
{
	//Attached particle
	this.particle = particle;

	//Create particle copy for preview
	this.particle_runtime = new ObjectLoader().parse(particle.toJSON());
	this.particle_runtime.initialize();
	this.particle_runtime.scale.set(1, 1, 1);
	this.particle_runtime.position.set(0, 0, 0);
	this.particle_runtime.updateMatrix();
	this.scene.add(this.particle_runtime);

	//Update form elements from particle data
	this.name.setText(particle.name);
	this.texture.setImage(particle.group.texture.image.src);
	this.blending.setValue(particle.group.blending);
	this.direction.setValue(particle.emitter.direction);
	this.particleCount.setValue(particle.emitter.particleCount);
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
