import {Locale} from "../../../locale/LocaleManager.js";
import {Video} from "../../../../core/resources/Video.js";
import {Resource} from "../../../../core/resources/Resource.js";
import {Image} from "../../../../core/resources/Image.js";
import {TextSprite} from "../../../../core/objects/text/TextSprite.js";
import {TextMesh} from "../../../../core/objects/text/TextMesh.js";
import {TextBitmap} from "../../../../core/objects/text/TextBitmap.js";
import {SpineAnimation} from "../../../../core/objects/spine/SpineAnimation.js";
import {Script} from "../../../../core/objects/script/Script.js";
import {Scene} from "../../../../core/objects/Scene.js";
import {Program} from "../../../../core/objects/Program.js";
import {PhysicsObject} from "../../../../core/objects/physics/PhysicsObject.js";
import {ParticleEmitter} from "../../../../core/objects/particle/ParticleEmitter.js";
import {Sky} from "../../../../core/objects/misc/Sky.js";
import {InstancedMesh} from "../../../../core/objects/mesh/InstancedMesh.js";
import {LeapMotion} from "../../../../core/objects/device/LeapMotion.js";
import {KinectDevice} from "../../../../core/objects/device/KinectDevice.js";
import {OrbitControls} from "../../../../core/objects/controls/OrbitControls.js";
import {FirstPersonControls} from "../../../../core/objects/controls/FirstPersonControls.js";
import {PerspectiveCamera} from "../../../../core/objects/cameras/PerspectiveCamera.js";
import {OrthographicCamera} from "../../../../core/objects/cameras/OrthographicCamera.js";
import {CubeCamera} from "../../../../core/objects/cameras/CubeCamera.js";
import {TextureInspector} from "./textures/TextureInspector.js";
import {VideoInspector} from "./resources/VideoInspector.js";
import {ResourceInspector} from "./resources/ResourceInspector.js";
import {ImageInspector} from "./resources/ImageInspector.js";
import {GeometryInspector} from "./resources/GeometryInspector.js";
import {AudioInspector} from "./resources/AudioInspector.js";
import {TextSpriteInspector} from "./objects/text/TextSpriteInspector.js";
import {TextMeshInspector} from "./objects/text/TextMeshInspector.js";
import {TextBitmapInspector} from "./objects/text/TextBitmapInspector.js";
import {SpineInspector} from "./objects/spine/SpineInspector.js";
import {ScriptInspector} from "./objects/ScriptInspector.js";
import {SceneInspector} from "./objects/SceneInspector.js";
import {ProgramInspector} from "./objects/ProgramInspector.js";
import {PhysicsInspector} from "./objects/physics/PhysicsInspector.js";
import {ObjectInspector} from "./objects/ObjectInspector.js";
import {SkyInspector} from "./objects/misc/SkyInspector.js";
import {ParticleEmitterInspector} from "./objects/misc/ParticleEmitterInspector.js";
import {CubeCameraInspector} from "./objects/misc/CubeCameraInspector.js";
import {MeshInspector} from "./objects/mesh/MeshInspector.js";
import {InstancedMeshInspector} from "./objects/mesh/InstancedMeshInspector.js";
import {LockedInspector} from "./objects/LockedInspector.js";
import {SpotLightInspector} from "./objects/lights/SpotLightInspector.js";
import {RectAreaLightInspector} from "./objects/lights/RectAreaLightInspector.js";
import {PointLightInspector} from "./objects/lights/PointLightInspector.js";
import {LightProbeInspector} from "./objects/lights/LightProbeInspector.js";
import {HemisphereLightInspector} from "./objects/lights/HemisphereLightInspector.js";
import {DirectionalLightInspector} from "./objects/lights/DirectionalLightInspector.js";
import {AmbientLightInspector} from "./objects/lights/AmbientLightInspector.js";
import {LeapInspector} from "./objects/devices/LeapInspector.js";
import {KinectInspector} from "./objects/devices/KinectInspector.js";
import {OrbitControlsInspector} from "./objects/controls/OrbitControlsInspector.js";
import {FirstPersonControlsInspector} from "./objects/controls/FirstPersonControlsInspector.js";
import {PerspectiveCameraInspector} from "./objects/cameras/PerspectiveCameraInspector.js";
import {OrthographicCameraInspector} from "./objects/cameras/OrthographicCameraInspector.js";
import {AudioEmitterInspector} from "./objects/audio/AudioEmitterInspector.js";
import {MaterialInspector} from "./materials/MaterialInspector.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {Text} from "../../../components/Text.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {Object3D, SkinnedMesh, Mesh, Points, Line, Light, PointLight, RectAreaLight, SpotLight, DirectionalLight, HemisphereLight, LightProbe, Audio, Geometry, BufferGeometry, Material, Texture} from "three";

/**
 * Inspector container is used to display object inspector panels.
 *
 * It is responsible for selection the appropiate panel for the type of object selected.
 *
 * @class InspectorContainer
 * @extends {TabComponent}
 */
function InspectorContainer(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, "Inspector", Global.FILE_PATH + "icons/misc/magnifier.png");

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = "var(--panel-color)";

	/**
	 * Text shown when there is no object select to show on the inspector.
	 *
	 * @attribute emptyText
	 * @type {Text}
	 */
	this.emptyText = new Text(this);
	this.emptyText.allowWordBreak(true);
	this.emptyText.setTextSize(12);
	this.emptyText.setTextColor("var(--color-light)");
	this.emptyText.setText(Locale.nothingToShow);

	this.panel = null;
}

InspectorContainer.prototype = Object.create(TabComponent.prototype);

InspectorContainer.prototype.destroyInspector = function()
{
	if(this.panel !== null)
	{
		this.panel.destroy();
		this.panel = null;
	}

	this.emptyText.setVisibility(true);
};

InspectorContainer.prototype.attach = function(object)
{
	if(this.panel !== null)
	{
		this.panel.attach(object);
		this.panel.updateInspector();
	}
};

InspectorContainer.prototype.isAttached = function(object)
{
	if(this.panel !== null)
	{
		return this.panel.object === object;
	}

	return false;
};

InspectorContainer.prototype.updateObjectsView = function()
{
	if(this.panel !== null)
	{	
		var object = this.panel.object;

		if(object.isObject3D === true && object.parent === null)
		{
			if(!(object instanceof Program))
			{
				this.destroyInspector();
			}
		}
	}
};

InspectorContainer.prototype.updateSelection = function()
{	
	var object = Editor.hasObjectSelected() ? Editor.selection[0] : null;
	
	if(this.panel !== null && this.panel.object === object)
	{
		return;
	}

	this.destroyInspector();

	if(object instanceof Object3D)
	{
		if(object.locked)
		{
			this.panel = new LockedInspector(this, object);
		}
		else if(object instanceof ParticleEmitter)
		{
			this.panel = new ParticleEmitterInspector(this, object);
		}
		else if(object instanceof SpineAnimation)
		{
			this.panel = new SpineInspector(this, object);
		}
		else if(object instanceof InstancedMesh)
		{
			this.panel = new InstancedMeshInspector(this, object);
		}
		else if(object instanceof SkinnedMesh)
		{
			this.panel = new MeshInspector(this, object);
		}
		else if(object instanceof TextSprite)
		{
			this.panel = new TextSpriteInspector(this, object);
		}
		else if(object instanceof TextBitmap)
		{
			this.panel = new TextBitmapInspector(this, object);
		}
		else if(object instanceof TextMesh)
		{
			this.panel = new TextMeshInspector(this, object);
		}
		else if(object instanceof Mesh || object instanceof Points || object instanceof Line)
		{
			this.panel = new MeshInspector(this, object);
		}
		else if(object instanceof Light)
		{
			if(object instanceof PointLight)
			{
				this.panel = new PointLightInspector(this, object);
			}
			else if(object instanceof RectAreaLight)
			{
				this.panel = new RectAreaLightInspector(this, object);
			}
			else if(object instanceof SpotLight)
			{
				this.panel = new SpotLightInspector(this, object);
			}
			else if(object instanceof DirectionalLight)
			{
				this.panel = new DirectionalLightInspector(this, object);
			}
			else if(object instanceof HemisphereLight)
			{
				this.panel = new HemisphereLightInspector(this, object);
			}
			else if(object instanceof LightProbe)
			{
				this.panel = new LightProbeInspector(this, object);
			}
			else
			{
				this.panel = new AmbientLightInspector(this, object);
			}
		}
		else if(object instanceof Sky)
		{
			this.panel = new SkyInspector(this, object);
		}
		else if(object instanceof LeapMotion)
		{
			this.panel = new LeapInspector(this, object);
		}
		else if(object instanceof KinectDevice)
		{
			this.panel = new KinectInspector(this, object);
		}
		else if(object instanceof PerspectiveCamera)
		{
			this.panel = new PerspectiveCameraInspector(this, object);
		}
		else if(object instanceof OrthographicCamera)
		{
			this.panel = new OrthographicCameraInspector(this, object);
		}
		else if(object instanceof CubeCamera)
		{
			this.panel = new CubeCameraInspector(this, object);
		}
		else if(object instanceof Audio)
		{
			this.panel = new AudioEmitterInspector(this, object);
		}
		else if(object instanceof Scene)
		{
			this.panel = new SceneInspector(this, object);
		}
		else if(object instanceof Script)
		{
			this.panel = new ScriptInspector(this, object);
		}
		else if(object instanceof Program)
		{
			this.panel = new ProgramInspector(this, object);
		}
		else if(object instanceof PhysicsObject)
		{
			this.panel = new PhysicsInspector(this, object);
		}
		else if(object instanceof OrbitControls)
		{
			this.panel = new OrbitControlsInspector(this, object);
		}
		else if(object instanceof FirstPersonControls)
		{
			this.panel = new FirstPersonControlsInspector(this, object);
		}
		else
		{
			this.panel = new ObjectInspector(this, object);
		}
	}
	else if(object instanceof Geometry || object instanceof BufferGeometry)
	{
		this.panel = new GeometryInspector(this, object);
	}
	else if(object instanceof Resource)
	{
		if(object instanceof Audio)
		{
			this.panel = new AudioInspector(this, object);
		}
		else if(object instanceof Image)
		{
			this.panel = new ImageInspector(this, object);
		}
		else if(object instanceof Video)
		{
			this.panel = new VideoInspector(this, object);
		}
		else
		{
			this.panel = new ResourceInspector(this, object);
		}
	}
	else if(object instanceof Material)
	{
		this.panel = new MaterialInspector(this, object);
	}
	else if(object instanceof Texture)
	{
		this.panel = new TextureInspector(this, object);
	}

	if(this.panel !== null)
	{
		this.emptyText.setVisibility(false);
		
		this.panel.updateInspector();
		this.panel.size.copy(this.size);
		this.panel.updateInterface();
	}
};

InspectorContainer.prototype.updateValues = function()
{	
	if(this.panel !== null)
	{
		this.panel.updateInspector();
	}
};

InspectorContainer.prototype.updateSize = function()
{	
	TabComponent.prototype.updateSize.call(this);

	this.emptyText.position.x = (this.size.x * 0.1);
	this.emptyText.size.set(this.size.x * 0.8, this.size.y);
	this.emptyText.updateInterface();

	if(this.panel !== null)
	{
		this.panel.size.copy(this.size);
		this.panel.updateInterface();
	}
};

export {InspectorContainer};