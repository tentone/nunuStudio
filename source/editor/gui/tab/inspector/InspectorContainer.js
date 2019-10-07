"use strict";

/**
 * Inspector container is used to display object inspector panels.
 *
 * It is responsible for selection the appropiate panel for the type of object selected.
 *
 * @class InspectorContainer
 * @extends {TabElement}
 */
function InspectorContainer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Inspector", Global.FILE_PATH + "icons/misc/magnifier.png");

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	/**
	 * Text shown when there is no object select to show on the inspector.
	 *
	 * @attribute emptyText
	 * @type {Text}
	 */
	this.emptyText = new Text(this);
	this.emptyText.allowWordBreak(true);
	this.emptyText.setTextSize(12);
	this.emptyText.setTextColor("#FFFFFF");
	this.emptyText.setText(Locale.nothingToShow);

	this.panel = null;
}

InspectorContainer.prototype = Object.create(TabElement.prototype);

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

	if(object instanceof THREE.Object3D)
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
		else if(object instanceof THREE.SkinnedMesh)
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
		else if(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line)
		{
			this.panel = new MeshInspector(this, object);
		}
		else if(object instanceof THREE.Light)
		{
			if(object instanceof THREE.PointLight)
			{
				this.panel = new PointLightInspector(this, object);
			}
			else if(object instanceof THREE.RectAreaLight)
			{
				this.panel = new RectAreaLightInspector(this, object);
			}
			else if(object instanceof THREE.SpotLight)
			{
				this.panel = new SpotLightInspector(this, object);
			}
			else if(object instanceof THREE.DirectionalLight)
			{
				this.panel = new DirectionalLightInspector(this, object);
			}
			else if(object instanceof THREE.HemisphereLight)
			{
				this.panel = new HemisphereLightInspector(this, object);
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
		else if(object instanceof THREE.Audio)
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
	else if(object instanceof THREE.Geometry)
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
	else if(object instanceof THREE.Material)
	{
		this.panel = new MaterialInspector(this, object);
	}
	else if(object instanceof THREE.Texture)
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
	TabElement.prototype.updateSize.call(this);

	this.emptyText.position.x = (this.size.x * 0.1);
	this.emptyText.size.set(this.size.x * 0.8, this.size.y);
	this.emptyText.updateInterface();

	if(this.panel !== null)
	{
		this.panel.size.copy(this.size);
		this.panel.updateInterface();
	}
};
