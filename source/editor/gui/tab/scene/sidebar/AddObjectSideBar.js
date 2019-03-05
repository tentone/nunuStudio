"use strict";

function AddObjectSideBar(parent)
{
	var size = 40;
	var position = 210;

	//Add Text
	var add = new Text(parent);
	add.setText("Add");
	add.size.set(40, 20);
	add.position.set(0, position);
	add.updateInterface();
	position += add.size.y;

	//Add Models
	var addModel = new ButtonDrawer(parent);
	addModel.setImage(Editor.FILE_PATH + "icons/models/models.png");
	addModel.size.set(size, size);
	addModel.position.set(0, position);
	addModel.optionsSize.set(size, size);
	addModel.updateInterface();
	position += size;

	//Cube
	addModel.addOption(Editor.FILE_PATH + "icons/models/cube.png", function()
	{
		var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cube";
		Editor.addObject(model);
	}, Locale.cube);

	//Cylinder
	addModel.addOption(Editor.FILE_PATH + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cylinder";
		Editor.addObject(model);
	}, Locale.cylinder);

	//Sphere
	addModel.addOption(Editor.FILE_PATH + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "sphere";
		Editor.addObject(model);
	}, Locale.sphere);

	//Torus Knot
	addModel.addOption(Editor.FILE_PATH + "icons/models/torusknot.png", function()
	{
		var geometry = new THREE.TorusKnotBufferGeometry(1, 0.4, 128, 96, 2, 3);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus knot";
		Editor.addObject(model);
	}, Locale.torusKnot);
	
	//Torus
	addModel.addOption(Editor.FILE_PATH + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus";
		Editor.addObject(model);
	}, Locale.torus);

	//Cone
	addModel.addOption(Editor.FILE_PATH + "icons/models/cone.png", function()
	{
		var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cone";
		Editor.addObject(model);
	}, Locale.cone);

	//Tetrahedron
	addModel.addOption(Editor.FILE_PATH + "icons/models/pyramid.png", function()
	{
		var geometry = new THREE.TetrahedronBufferGeometry(1, 0);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "tetrahedron";
		Editor.addObject(model);
	}, "Tetrahedron");

	//Dodecahedron
	addModel.addOption(Editor.FILE_PATH + "icons/models/dodecahedron.png", function()
	{
		var geometry = new THREE.DodecahedronBufferGeometry(1, 0);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "dodecahedron";
		Editor.addObject(model);
	}, "Dodecahedron");

	//Plane
	addModel.addOption(Editor.FILE_PATH + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "plane";
		Editor.addObject(model);
	}, "Plane");

	//Circle
	addModel.addOption(Editor.FILE_PATH + "icons/models/circle.png", function()
	{
		var geometry = new THREE.CircleBufferGeometry(1, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "circle";
		Editor.addObject(model);
	}, "Cicle");

	//Ring
	addModel.addOption(Editor.FILE_PATH + "icons/models/ring.png", function()
	{
		var geometry = new THREE.RingBufferGeometry(1, 5, 32, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "ring";
		Editor.addObject(model);
	}, "Ring");

	//Parametric
	/*addModel.addOption(Editor.FILE_PATH + "icons/models/spline.png", function()
	{
		var klein = function (v, u, optionalTarget)
		{
			var result = optionalTarget || new THREE.Vector3();

			u *= Math.PI;
			v *= 2 * Math.PI;

			u = u * 2;
			var x, y, z;
			if (u < Math.PI)
			{
				x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
				z = - 8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
			}
			else
			{
				x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
				z = - 8 * Math.sin(u);
			}

			y = - 2 * (1 - Math.cos(u) / 2) * Math.sin(v);

			return result.set(x, y, z);
		};

		var geometry = new THREE.ParametricGeometry(klein, 25, 25);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "parametric";
		Editor.addObject(model);
	}, "Parametric");*/

	//Text
	var addText = new ButtonDrawer(parent);
	addText.setImage(Editor.FILE_PATH + "icons/text/text.png");
	addText.size.set(size, size);
	addText.position.set(0, position);
	addText.optionsSize.set(size, size);
	addText.updateInterface();
	position += size;

	addText.addOption(Editor.FILE_PATH + "icons/text/text.png", function()
	{
		var model = new TextMesh("text", Editor.defaultMaterial, Editor.defaultFont);
		Editor.addObject(model);
	}, "Text Mesh");

	if(Nunu.developmentMode())
	{
		addText.addOption(Editor.FILE_PATH + "icons/text/text.png", function()
		{
			var text = new TextBitmap(
			{
				font: JSON.parse(FileSystem.readFile(Editor.FILE_PATH + "sdf/roboto-bold.json")),
				text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
				width: 500,
				align: TextBitmap.CENTER,
				letterSpacing: 3,
				color: 0xFFFFFF
			}, new Texture(Editor.FILE_PATH + "sdf/roboto-bold.png"), TextBitmap.SDF);
			text.scale.set(0.001, 0.001, 0.001);

			Editor.addObject(text);
		}, "Text Bitmap");

		addText.addOption(Editor.FILE_PATH + "icons/text/text.png", function()
		{
			//TODO <ADD CODE HERE>
		}, "Text Sprite");
	}

	//Add lights
	var addLight = new ButtonDrawer(parent);
	addLight.setImage(Editor.FILE_PATH + "icons/lights/point.png");
	addLight.size.set(size, size);
	addLight.position.set(0, position);
	addLight.optionsSize.set(size, size);
	addLight.updateInterface();
	position += size;

	//Point Light
	addLight.addOption(Editor.FILE_PATH + "icons/lights/point.png", function()
	{
		Editor.addObject(new PointLight(0x444444));
	}, "Point Light");

	//Ambient Light
	addLight.addOption(Editor.FILE_PATH + "icons/lights/ambient.png", function()
	{
		Editor.addObject(new AmbientLight(0x444444));
	}, "Ambient Light");

	//Spot Light
	addLight.addOption(Editor.FILE_PATH + "icons/lights/spot.png", function()
	{
		Editor.addObject(new SpotLight(0x444444));
	}, "Spot Light");

	//Directional Light
	addLight.addOption(Editor.FILE_PATH + "icons/lights/directional.png", function()
	{
		Editor.addObject(new DirectionalLight(0x444444));
	}, "Directional Light");

	//Hemisphere Light
	addLight.addOption(Editor.FILE_PATH + "icons/lights/hemisphere.png", function()
	{
		Editor.addObject(new HemisphereLight(0x444444));
	}, "Hemisphere Light");

	//RectArea Light
	addLight.addOption(Editor.FILE_PATH + "icons/lights/rectarea.png", function()
	{
		Editor.addObject(new RectAreaLight(0x444444, 100, 1, 1));
	}, "RectArea Light");

	//Sky
	addLight.addOption(Editor.FILE_PATH + "icons/lights/sky.png", function()
	{
		Editor.addObject(new Sky());
	}, "Sky");

	//Add camera
	var addCamera = new ButtonDrawer(parent);
	addCamera.setImage(Editor.FILE_PATH + "icons/camera/camera.png");
	addCamera.optionsPerLine = 2;
	addCamera.size.set(size, size);
	addCamera.position.set(0, position);
	addCamera.optionsSize.set(size, size);
	addCamera.updateInterface();
	position += size;

	//Perspective camera
	addCamera.addOption(Editor.FILE_PATH + "icons/camera/prespective.png", function()
	{
		Editor.addObject(new PerspectiveCamera(60, 1));
	}, "Perspective Camera");

	//Orthographic camera
	addCamera.addOption(Editor.FILE_PATH + "icons/camera/orthographic.png", function()
	{
		Editor.addObject(new OrthographicCamera(3, 2, OrthographicCamera.RESIZE_HORIZONTAL));
	}, "Orthographic Camera");

	//Add script
	var addScript = new ButtonDrawer(parent);
	addScript.setImage(Editor.FILE_PATH + "icons/script/script.png");
	addScript.size.set(size, size);
	addScript.position.set(0, position);
	addScript.optionsSize.set(size, size);
	addScript.updateInterface();
	position += size;

	//Javascript script
	addScript.addOption(Editor.FILE_PATH + "icons/script/script.png", function()
	{
		Editor.addObject(new Script());
	}, "Javascript Script");

	//Effects
	var addEffects = new ButtonDrawer(parent);
	addEffects.setImage(Editor.FILE_PATH + "icons/misc/particles.png");
	addEffects.size.set(size, size);
	addEffects.position.set(0, position);
	addEffects.optionsSize.set(size, size);
	addEffects.updateInterface();
	position += size;

	//Sprite
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/sprite.png", function()
	{
		Editor.addObject(new Sprite(Editor.defaultSpriteMaterial));
	}, "Sprite");

	//Particle emitter
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/particles.png", function()
	{
		var particle = new ParticleEmitter()
		particle.texture = Editor.defaultTextureParticle;
		particle.reload();
		Editor.addObject(particle);
	}, "Particle Emitter");

	//Container
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/container.png", function()
	{
		Editor.addObject(new Container());
	}, "Container");

	//Cube Camera
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/probe.png", function()
	{
		Editor.addObject(new CubeCamera());
	}, "Cube Camera")

	//Audio
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/audio.png", function()
	{
		Editor.addObject(new AudioEmitter(Editor.defaultAudio));
	}, "Audio");

	//Positional Audio
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/audio_positional.png", function()
	{
		Editor.addObject(new PositionalAudio(Editor.defaultAudio));
	}, "Positional Audio");

	//Lens flare
	addEffects.addOption(Editor.FILE_PATH + "icons/misc/flare.png", function()
	{
		var lensFlare = new LensFlare();

		lensFlare.addFlare(Editor.defaultTextureLensFlare[0], 700, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 60, 0.6);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 70, 0.7);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 120, 0.9);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 70, 1.0);

		Editor.addObject(lensFlare);
	}, "Lens flare");

	if(Nunu.developmentMode())
	{
		//Reflector
		addEffects.addOption(Editor.FILE_PATH + "icons/misc/mirror.png", function()
		{
			var object = new THREE.Reflector(new THREE.PlaneBufferGeometry());

			Editor.addObject(object);
		}, "Reflector");

		//Refractor
		addEffects.addOption(Editor.FILE_PATH + "icons/misc/waves.png", function()
		{
			var object = new THREE.Refractor(new THREE.PlaneBufferGeometry());
			Editor.addObject(object);
		}, "Refractor");
	}

	//Physics
	var addPhysics = new ButtonDrawer(parent);
	addPhysics.setImage(Editor.FILE_PATH + "icons/misc/physics.png");
	addPhysics.optionsPerLine = 3;
	addPhysics.size.set(size, size);
	addPhysics.position.set(0, position);
	addPhysics.optionsSize.set(size, size);
	addPhysics.updateInterface();
	position += size;

	//Physics box
	addPhysics.addOption(Editor.FILE_PATH + "icons/models/cube.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
		obj.name = "box";
		Editor.addObject(obj);
	}, Locale.box);

	//Physics sphere
	addPhysics.addOption(Editor.FILE_PATH + "icons/models/sphere.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Sphere(1.0));
		obj.name = "sphere";
		Editor.addObject(obj);
	}, Locale.sphere);

	//Physics Cylinder
	addPhysics.addOption(Editor.FILE_PATH + "icons/models/cylinder.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
		obj.name = "cylinder";
		Editor.addObject(obj);
	}, Locale.cylinder);

	//Physics Plane
	addPhysics.addOption(Editor.FILE_PATH + "icons/models/plane.png", function()
	{
		var obj = new PhysicsObject();
		obj.rotation.x = -Math.PI / 2;
		obj.body.addShape(new CANNON.Plane());
		obj.body.type = CANNON.Body.KINEMATIC;
		obj.name = "ground";
		Editor.addObject(obj);
	}, "Ground");

	//Physics Particle
	addPhysics.addOption(Editor.FILE_PATH + "icons/models/point.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Particle());
		obj.name = "particle";
		Editor.addObject(obj);
	}, "Particle");

	//Add device
	var addControls = new ButtonDrawer(parent);
	addControls.setImage(Editor.FILE_PATH + "icons/misc/controller.png");
	addControls.optionsPerLine = 3;
	addControls.size.set(size, size);
	addControls.position.set(0, position);
	addControls.optionsSize.set(size, size);
	addControls.updateInterface();
	position += size;

	//Orbit controls
	addControls.addOption(Editor.FILE_PATH + "icons/misc/orbit.png", function()
	{
		Editor.addObject(new OrbitControls());
	}, "Orbit Controls");

	//FPS controls
	addControls.addOption(Editor.FILE_PATH + "icons/misc/crosshair.png", function()
	{
		Editor.addObject(new FirstPersonControls());
	}, "First Person Controls");

	//Leap Hand
	addControls.addOption(Editor.FILE_PATH + "icons/hw/leap.png", function()
	{
		Editor.addObject(new LeapMotion());
	}, "Leap Motion");

	//Kinect Skeleton
	addControls.addOption(Editor.FILE_PATH + "icons/hw/kinect.png", function()
	{
		Editor.addObject(new KinectDevice());
	}, "Microsoft Kinect");
}
