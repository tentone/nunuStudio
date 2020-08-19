import {Locale} from "../../../../locale/LocaleManager.js";
import {Texture} from "../../../../../core/texture/Texture.js";
import {TextSprite} from "../../../../../core/objects/text/TextSprite.js";
import {TextMesh} from "../../../../../core/objects/text/TextMesh.js";
import {TextBitmap} from "../../../../../core/objects/text/TextBitmap.js";
import {Sprite} from "../../../../../core/objects/sprite/Sprite.js";
import {Script} from "../../../../../core/objects/script/Script.js";
import {PhysicsObject} from "../../../../../core/objects/physics/PhysicsObject.js";
import {ParticleEmitter} from "../../../../../core/objects/particle/ParticleEmitter.js";
import {Sky} from "../../../../../core/objects/misc/Sky.js";
import {LensFlare} from "../../../../../core/objects/misc/LensFlare.js";
import {HTMLView} from "../../../../../core/objects/misc/HTMLView.js";
import {Group} from"../../../../../core/objects/misc/Group.js";
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
import {Box, Vec3, Sphere, Cylinder, Plane, Body, Particle} from "cannon";
import {BoxBufferGeometry, CylinderBufferGeometry, SphereBufferGeometry, TorusKnotBufferGeometry, TorusBufferGeometry, ConeBufferGeometry, PlaneBufferGeometry, CircleBufferGeometry, RingBufferGeometry, IcosahedronBufferGeometry, TetrahedronBufferGeometry, OctahedronBufferGeometry, DodecahedronBufferGeometry} from "three";

/**
 * Side bar is used to add more nodes to the node editor graph.
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
	 * List of object placing buttons.
	 *
	 * @attribute buttons
	 * @type {Array}
	 */	
	this.buttons = [];

	this.createObject();

	this.add = new Text(this);
	this.add.setText(Locale.add);
	this.add.size.set(40, 20);
	this.add.position.set(0, 5);
	this.add.updateInterface();

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
	while(y < this.size.y - 2 * size && i < this.buttons.length)
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

	if(this.size.y < 250)
	{
		this.more.setVisibility(false);
	}
	else
	{
		if(i < this.buttons.length)
		{
			this.more.clear();
			this.more.optionsSize.set(size, size);
			this.more.size.set(size, size);
			this.more.position.set(0, y);
			this.more.visible = true;

			while(i < this.buttons.length)
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
 * @method create
 */
SideBar.prototype.createObject = function()
{
	var self = this;

	// Events
	var events = new ButtonDrawer(this);
	events.setImage(Global.FILE_PATH + "icons/models/models.png");
	this.buttons.push(events);

	// Initialization
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// TODO <ADD CODE HERE>
    }, Locale.initialization);
    
    // Update
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// TODO <ADD CODE HERE>
	}, Locale.update);
    
    // Resize
	events.addOption(Global.FILE_PATH + "icons/models/cube.png", function()
	{
		// TODO <ADD CODE HERE>
    }, Locale.resize);
    
	events.updateOptions();
};

export {SideBar};