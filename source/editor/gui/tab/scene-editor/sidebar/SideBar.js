import {Box, Vec3, Sphere, Cylinder, Plane, Body, Particle} from "cannon";
import {BoxBufferGeometry, CylinderBufferGeometry, SphereBufferGeometry, TorusKnotBufferGeometry, TorusBufferGeometry, ConeBufferGeometry, PlaneBufferGeometry, CircleBufferGeometry, RingBufferGeometry, IcosahedronBufferGeometry, TetrahedronBufferGeometry, OctahedronBufferGeometry, DodecahedronBufferGeometry} from "three";
import {Locale} from "../../../../locale/LocaleManager.js";
import {Texture} from "../../../../../core/texture/Texture.js";
import {TextSprite} from "../../../../../core/objects/text/TextSprite.js";
import {TextMesh} from "../../../../../core/objects/text/TextMesh.js";
import {TextBitmap} from "../../../../../core/objects/text/TextBitmap.js";
import {Sprite} from "../../../../../core/objects/sprite/Sprite.js";
import {Script} from "../../../../../core/objects/script/Script.js";
import {NodeScript} from "../../../../../core/objects/script/NodeScript.js";
import {PhysicsObject} from "../../../../../core/objects/physics/PhysicsObject.js";
import {ParticleEmitter} from "../../../../../core/objects/particle/ParticleEmitter.js";
import {Sky} from "../../../../../core/objects/misc/Sky.js";
import {LensFlare} from "../../../../../core/objects/misc/LensFlare.js";
import {HTMLView} from "../../../../../core/objects/misc/HTMLView.js";
import {Group} from "../../../../../core/objects/misc/Group.js";
import {Mesh} from "../../../../../core/objects/mesh/Mesh.js";
import {SpotLight} from "../../../../../core/objects/lights/SpotLight.js";
import {RectAreaLight} from "../../../../../core/objects/lights/RectAreaLight.js";
import {PointLight} from "../../../../../core/objects/lights/PointLight.js";
import {LightProbe} from "../../../../../core/objects/lights/LightProbe.js";
import {HemisphereLight} from "../../../../../core/objects/lights/HemisphereLight.js";
import {DirectionalLight} from "../../../../../core/objects/lights/DirectionalLight.js";
import {AmbientLight} from "../../../../../core/objects/lights/AmbientLight.js";
import {OrbitControls} from "../../../../../core/objects/controls/OrbitControls.js";
import {FirstPersonControls} from "../../../../../core/objects/controls/FirstPersonControls.js";
import {PerspectiveCamera} from "../../../../../core/objects/cameras/PerspectiveCamera.js";
import {OrthographicCamera} from "../../../../../core/objects/cameras/OrthographicCamera.js";
import {CubeCamera} from "../../../../../core/objects/cameras/CubeCamera.js";
import {PositionalAudio} from "../../../../../core/objects/audio/PositionalAudio.js";
import {AudioEmitter} from "../../../../../core/objects/audio/AudioEmitter.js";
import {TerrainBufferGeometry} from "../../../../../core/geometries/TerrainBufferGeometry.js";
import {RoundedBoxBufferGeometry} from "../../../../../core/geometries/RoundedBoxBufferGeometry.js";
import {ParametricBufferGeometry} from "../../../../../core/geometries/ParametricBufferGeometry.js";
import {CapsuleBufferGeometry} from "../../../../../core/geometries/CapsuleBufferGeometry.js";
import {FileSystem} from "../../../../../core/FileSystem.js";
import {AddResourceAction} from "../../../../history/action/resources/AddResourceAction.js";
import {SceneEditor} from "../SceneEditor.js";
import {Global} from "../../../../Global.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {Component} from "../../../../components/Component.js";
import {ButtonDrawer} from "../../../../components/buttons/ButtonDrawer.js";
import {PythonScript} from "../../../../../core/objects/script/PythonScript.js";

/**
 * Side bar is presented in the editor to add more objects to the scene.
 *
 * @class SideBar
 * @extends {Component}
 */
function SideBar(parent)
{
	Component.call(this, parent, "div");

	this.preventDragEvents();

	this.setStyle("overflow", "visible");
	this.setStyle("backgroundColor", "var(--bar-color)");

	/**
	 * Scene editor to where this sidebar is attached.
	 *
	 * @attribute editor
	 * @type {SceneEditor}
	 */
	this.editor = parent;

	/**
	 * List of object placing buttons.
	 *
	 * @attribute buttons
	 * @type {Array}
	 */
	this.buttons = [];

	this.createObject();

	this.addText = new Text(this);
	this.addText.setText(Locale.add);
	this.addText.size.set(40, 20);
	this.addText.position.set(0, 5);
	this.addText.updateInterface();

	/**
	 * More button is displayed when there is no space for the buttons placed in the side bar.
	 *
	 * @attribute more
	 * @type {ButtonDrawer}
	 */
	this.more = new ButtonDrawer(this);
	this.more.setImage(Global.FILE_PATH + "icons/misc/more.png");
	this.more.optionsPerLine = 1;
}

SideBar.prototype = Object.create(Component.prototype);

SideBar.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);

	var size = this.size.x;
	var y = 30, i = 0;

	// Update buttons size
	while (y < this.size.y - 2 * size && i < this.buttons.length)
	{
		this.buttons[i].attachTo(this);
		this.buttons[i].size.set(size, size);
		this.buttons[i].position.set(0, y);
		this.buttons[i].optionsSize.set(size, size);
		this.buttons[i].visible = true;
		this.buttons[i].updateInterface();

		i++;
		y += size;
	}

	if (this.size.y < 250)
	{
		this.more.setVisibility(false);
	}
	else
	{
		if (i < this.buttons.length)
		{
			this.more.clear();
			this.more.optionsSize.set(size, size);
			this.more.size.set(size, size);
			this.more.position.set(0, y);
			this.more.visible = true;

			while (i < this.buttons.length)
			{
				this.more.insertOption(this.buttons[i]);
				i++;
			}

			this.more.updateOptions();
			this.more.updateInterface();
		}
		else
		{
			this.more.setVisibility(false);
		}
	}
};

/**
 * Create the icons to add objects to the scene.
 *
 * @method createObject
 */
SideBar.prototype.createObject = function()
{
	var self = this;

	// Add Models
	var models = new ButtonDrawer(this);
	models.setImage(Global.FILE_PATH + "icons/models/models.png");
	this.buttons.push(models);

	// Cube
	models.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		var geometry = new BoxBufferGeometry(1, 1, 1);
		geometry.name = "cube";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cube";

		Editor.addObject(model, self.editor.scene);
	}, Locale.cube);

	// Cylinder
	models.addOption(Global.FILE_PATH + "icons/models/cylinder.png", function()
	{
		var geometry = new CylinderBufferGeometry(1, 1, 2, 32);
		geometry.name = "cylinder";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cylinder";

		Editor.addObject(model, self.editor.scene);
	}, Locale.cylinder);

	// Sphere
	models.addOption(Global.FILE_PATH + "icons/models/sphere.png", function()
	{
		var geometry = new SphereBufferGeometry(1, 32, 32);
		geometry.name = "sphere";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "sphere";

		Editor.addObject(model, self.editor.scene);
	}, Locale.sphere);

	// Torus Knot
	models.addOption(Global.FILE_PATH + "icons/models/torusknot.png", function()
	{
		var geometry = new TorusKnotBufferGeometry(1, 0.4, 128, 96, 2, 3);
		geometry.name = "torusknot";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus knot";

		Editor.addObject(model, self.editor.scene);
	}, Locale.torusKnot);

	// Torus
	models.addOption(Global.FILE_PATH + "icons/models/torus.png", function()
	{
		var geometry = new TorusBufferGeometry(1, 0.5, 16, 96);
		geometry.name = "torus";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus";
		Editor.addObject(model, self.editor.scene);
	}, Locale.torus);

	// Cone
	models.addOption(Global.FILE_PATH + "icons/models/cone.png", function()
	{
		var geometry = new ConeBufferGeometry(1, 2, 32);
		geometry.name = "cone";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cone";

		Editor.addObject(model, self.editor.scene);
	}, Locale.cone);

	// Plane
	models.addOption(Global.FILE_PATH + "icons/models/plane.png", function()
	{
		var geometry = new PlaneBufferGeometry(1, 1);
		geometry.name = "plane";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "plane";
		Editor.addObject(model, self.editor.scene);
	}, Locale.plane);

	// Circle
	models.addOption(Global.FILE_PATH + "icons/models/circle.png", function()
	{
		var geometry = new CircleBufferGeometry(1, 32);
		geometry.name = "circle";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "circle";
		Editor.addObject(model, self.editor.scene);
	}, Locale.circle);

	// Ring
	models.addOption(Global.FILE_PATH + "icons/models/ring.png", function()
	{
		var geometry = new RingBufferGeometry(1, 5, 32, 1);
		geometry.name = "ring";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "ring";

		Editor.addObject(model, self.editor.scene);
	}, Locale.ring);

	// Icosahedron
	models.addOption(Global.FILE_PATH + "icons/models/icosahedron.png", function()
	{
		var geometry = new IcosahedronBufferGeometry(1, 0);
		geometry.name = "icosahedron";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "icosahedron";
		Editor.addObject(model, self.editor.scene);
	}, Locale.icosahedron);

	// Tetrahedron
	models.addOption(Global.FILE_PATH + "icons/models/pyramid.png", function()
	{
		var geometry = new TetrahedronBufferGeometry(1, 0);
		geometry.name = "tetrahedron";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "tetrahedron";
		Editor.addObject(model, self.editor.scene);
	}, Locale.tetrahedron);

	// Octahedron
	models.addOption(Global.FILE_PATH + "icons/models/octahedron.png", function()
	{
		var geometry = new OctahedronBufferGeometry(1, 0);
		geometry.name = "octahedron";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "octahedron";
		Editor.addObject(model, self.editor.scene);
	}, Locale.octahedron);

	// Dodecahedron
	models.addOption(Global.FILE_PATH + "icons/models/dodecahedron.png", function()
	{
		var geometry = new DodecahedronBufferGeometry(1, 0);
		geometry.name = "dodecahedron";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "dodecahedron";
		Editor.addObject(model, self.editor.scene);
	}, Locale.dodecahedron);

	// Capsule
	models.addOption(Global.FILE_PATH + "icons/models/capsule.png", function()
	{
		var geometry = new CapsuleBufferGeometry(0.5, 0.5, 1.0, 32, 1, 8, 8);
		geometry.name = "capsule";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "capsule";

		Editor.addObject(model, self.editor.scene);
	}, Locale.capsule);

	// Rounded box
	models.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		var geometry = new RoundedBoxBufferGeometry(1, 1, 1, 0.1, 8);
		geometry.name = "box";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "box";

		Editor.addObject(model, self.editor.scene);
	}, Locale.roundedBox);

	// Terrain
	models.addOption(Global.FILE_PATH + "icons/models/terrain.png", function()
	{
		Editor.addAction(new AddResourceAction(Editor.defaultImageTerrain, Editor.program, "images"));

		var geometry = new TerrainBufferGeometry(10, 10, 100, 100, 5, Editor.defaultImageTerrain);
		geometry.name = "terrain";

		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "terrain";

		Editor.addObject(model, self.editor.scene);
	}, Locale.terrain);

	// Parametric
	models.addOption(Global.FILE_PATH + "icons/models/spline.png", function()
	{
		var klein = `u *= Math.PI;
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

return target.set(x, y, z);`;

		var geometry = new ParametricBufferGeometry(klein, 25, 25);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "parametric";
		Editor.addObject(model, self.editor.scene);
	}, Locale.parametric);

	models.updateOptions();

	// Text
	var text = new ButtonDrawer(this);
	text.setImage(Global.FILE_PATH + "icons/text/text.png");
	this.buttons.push(text);

	text.addOption(Global.FILE_PATH + "icons/text/textmesh.png", function()
	{
		Editor.addObject(new TextMesh("text", Editor.defaultMaterial, Editor.defaultFont), self.editor.scene);
	}, Locale.textMesh);

	text.addOption(Global.FILE_PATH + "icons/text/text.png", function()
	{
		var texture = new Texture(Global.FILE_PATH + "sdf/roboto-bold.png");
		var object = new TextBitmap(
			{
				font: JSON.parse(FileSystem.readFile(Global.FILE_PATH + "sdf/roboto-bold.json")),
				text: "text",
				width: 500,
				align: TextBitmap.CENTER,
				letterSpacing: 3,
				color: 0xFFFFFF
			}, texture, TextBitmap.SDF);

		Editor.addObject(object, self.editor.scene);
	}, Locale.textBitmap);

	text.addOption(Global.FILE_PATH + "icons/text/textcanvas.png", function()
	{
		Editor.addObject(new TextSprite("text"), self.editor.scene);
	}, Locale.textSprite);

	text.updateOptions();

	// Add lights
	var lights = new ButtonDrawer(this);
	lights.setImage(Global.FILE_PATH + "icons/lights/point.png");
	this.buttons.push(lights);

	// Point Light
	lights.addOption(Global.FILE_PATH + "icons/lights/point.png", function()
	{
		Editor.addObject(new PointLight(0x444444), self.editor.scene);
	}, Locale.pointLight);

	// Ambient Light
	lights.addOption(Global.FILE_PATH + "icons/lights/ambient.png", function()
	{
		Editor.addObject(new AmbientLight(0x444444), self.editor.scene);
	}, Locale.ambientLight);

	// Spot Light
	lights.addOption(Global.FILE_PATH + "icons/lights/spot.png", function()
	{
		Editor.addObject(new SpotLight(0x444444), self.editor.scene);
	}, Locale.spotLight);

	// Directional Light
	lights.addOption(Global.FILE_PATH + "icons/lights/directional.png", function()
	{
		Editor.addObject(new DirectionalLight(0x444444), self.editor.scene);
	}, Locale.directionalLight);

	// Hemisphere Light
	lights.addOption(Global.FILE_PATH + "icons/lights/hemisphere.png", function()
	{
		Editor.addObject(new HemisphereLight(0x444444), self.editor.scene);
	}, Locale.hemisphereLight);

	// RectArea Light
	lights.addOption(Global.FILE_PATH + "icons/lights/rectarea.png", function()
	{
		Editor.addObject(new RectAreaLight(0x444444, 100, 1, 1), self.editor.scene);
	}, Locale.rectAreaLight);

	// Probe
	lights.addOption(Global.FILE_PATH + "icons/misc/probe.png", function()
	{
		Editor.addObject(new LightProbe(), self.editor.scene);
	}, Locale.lighProbe);

	// Sky
	lights.addOption(Global.FILE_PATH + "icons/lights/sky.png", function()
	{
		Editor.addObject(new Sky(), self.editor.scene);
	}, Locale.sky);

	lights.updateOptions();

	// Add camera
	var cameras = new ButtonDrawer(this);
	cameras.setImage(Global.FILE_PATH + "icons/camera/camera.png");
	this.buttons.push(cameras);

	// Perspective camera
	cameras.addOption(Global.FILE_PATH + "icons/camera/prespective.png", function()
	{
		Editor.addObject(new PerspectiveCamera(60, 1), self.editor.scene);
	}, Locale.perspectiveCamera);

	// Orthographic camera
	cameras.addOption(Global.FILE_PATH + "icons/camera/orthographic.png", function()
	{
		Editor.addObject(new OrthographicCamera(3, 2, OrthographicCamera.RESIZE_HORIZONTAL), self.editor.scene);
	}, Locale.orthographicCamera);

	cameras.updateOptions();

	// Add script
	var scripts = new ButtonDrawer(this);
	scripts.setImage(Global.FILE_PATH + "icons/script/script.png");
	this.buttons.push(scripts);

	// Javascript script
	scripts.addOption(Global.FILE_PATH + "icons/script/javascript.png", function()
	{
		Editor.addObject(new Script(), self.editor.scene);
	}, Locale.javascript);

	// Python script
	scripts.addOption(Global.FILE_PATH + "icons/script/python.png", function()
	{
		Editor.addObject(new PythonScript(), self.editor.scene);
	}, Locale.python);

	if (DEVELOPMENT)
	{
		// Node Graph script
		scripts.addOption(Global.FILE_PATH + "icons/script/workflow.png", function()
		{
			Editor.addObject(new NodeScript(), self.editor.scene);
		}, Locale.nodeGraph);
	}

	scripts.updateOptions();

	// Effects
	var effects = new ButtonDrawer(this);
	effects.setImage(Global.FILE_PATH + "icons/misc/particles.png");
	this.buttons.push(effects);

	// Sprite
	effects.addOption(Global.FILE_PATH + "icons/misc/sprite.png", function()
	{
		Editor.addObject(new Sprite(Editor.defaultSpriteMaterial), self.editor.scene);
	}, Locale.sprite);

	// Particle emitter
	effects.addOption(Global.FILE_PATH + "icons/misc/particles.png", function()
	{
		var particle = new ParticleEmitter();
		particle.texture = Editor.defaultTextureParticle;
		particle.reload();
		Editor.addObject(particle, self.editor.scene);
	}, Locale.particleEmitter);

	// Container
	effects.addOption(Global.FILE_PATH + "icons/misc/container.png", function()
	{
		Editor.addObject(new Group(), self.editor.scene);
	}, Locale.container);

	// Cube Camera
	effects.addOption(Global.FILE_PATH + "icons/misc/probe.png", function()
	{
		Editor.addObject(new CubeCamera(), self.editor.scene);
	}, Locale.cubeCamera);

	// Audio
	effects.addOption(Global.FILE_PATH + "icons/misc/audio.png", function()
	{
		Editor.addObject(new AudioEmitter(Editor.defaultAudio), self.editor.scene);
	}, Locale.audio);

	// Positional Audio
	effects.addOption(Global.FILE_PATH + "icons/misc/audio_positional.png", function()
	{
		Editor.addObject(new PositionalAudio(Editor.defaultAudio), self.editor.scene);
	}, Locale.positionalAudio);

	// Lens flare
	effects.addOption(Global.FILE_PATH + "icons/misc/flare.png", function()
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

		Editor.addObject(lensFlare, self.editor.scene);
	}, Locale.lensFlare);

	if (DEVELOPMENT)
	{
		effects.addOption(Global.FILE_PATH + "icons/platform/web.png", function()
		{
			Editor.addObject(new HTMLView("https://www.google.com/"), self.editor.scene);
		}, Locale.htmlView);
	}

	effects.updateOptions();

	// Physics
	var physics = new ButtonDrawer(this);
	physics.setImage(Global.FILE_PATH + "icons/misc/physics.png");
	this.buttons.push(physics);

	// Physics box
	physics.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		var object = new PhysicsObject();
		object.body.addShape(new Box(new Vec3(0.5, 0.5, 0.5)));
		object.name = "box";
		Editor.addObject(object, self.editor.scene);
	}, Locale.box);

	// Physics sphere
	physics.addOption(Global.FILE_PATH + "icons/models/sphere.png", function()
	{
		var object = new PhysicsObject();
		object.body.addShape(new Sphere(1.0));
		object.name = "sphere";
		Editor.addObject(object, self.editor.scene);
	}, Locale.sphere);

	// Physics Cylinder
	physics.addOption(Global.FILE_PATH + "icons/models/cylinder.png", function()
	{
		var object = new PhysicsObject();
		object.body.addShape(new Cylinder(1.0, 1.0, 2.0, 8));
		object.name = "cylinder";
		Editor.addObject(object, self.editor.scene);
	}, Locale.cylinder);

	// Physics Plane
	physics.addOption(Global.FILE_PATH + "icons/models/plane.png", function()
	{
		var object = new PhysicsObject();
		object.rotation.x = -Math.PI / 2;
		object.body.addShape(new Plane());
		object.body.type = Body.KINEMATIC;
		object.name = "ground";
		Editor.addObject(object, self.editor.scene);
	}, Locale.ground);

	// Physics Particle
	physics.addOption(Global.FILE_PATH + "icons/models/point.png", function()
	{
		var object = new PhysicsObject();
		object.body.addShape(new Particle());
		object.name = "particle";
		Editor.addObject(object, self.editor.scene);
	}, Locale.particle);

	physics.updateOptions();

	// Add device
	var controls = new ButtonDrawer(this);
	controls.setImage(Global.FILE_PATH + "icons/misc/controller.png");
	this.buttons.push(controls);

	// Orbit controls
	controls.addOption(Global.FILE_PATH + "icons/misc/orbit.png", function()
	{
		Editor.addObject(new OrbitControls(), self.editor.scene);
	}, Locale.orbitControls);

	// FPS controls
	controls.addOption(Global.FILE_PATH + "icons/misc/crosshair.png", function()
	{
		Editor.addObject(new FirstPersonControls(), self.editor.scene);
	}, Locale.firstPersonControls);

	controls.updateOptions();
};

export {SideBar};
