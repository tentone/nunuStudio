"use strict";

function PanelContainer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Inspector", Editor.filePath + "icons/misc/magnifier.png");

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.panel = null;
}

PanelContainer.prototype = Object.create(TabElement.prototype);

PanelContainer.prototype.destroyPanel = function()
{
	if(this.panel !== null)
	{
		this.panel.destroy();
		this.panel = null;
	}
};

PanelContainer.prototype.attach = function(object)
{
	if(this.panel !== null)
	{
		this.panel.attach(object);
		this.panel.updatePanel();
	}
};

PanelContainer.prototype.isAttached = function(object)
{
	if(this.panel !== null)
	{
		return this.panel.obj === object;
	}

	return false;
};

PanelContainer.prototype.updateObjectsView = function()
{
	if(this.panel !== null)
	{	
		var object = this.panel.obj;

		if(object.isObject3D === true && object.parent === null)
		{
			this.destroyPanel();
		}
	}
};

PanelContainer.prototype.updateSelection = function()
{	
	var object = Editor.hasObjectSelected() ? Editor.selection[0] : null;
	
	if(this.panel !== null && this.panel.obj === object)
	{
		return;
	}

	this.destroyPanel();

	if(object instanceof THREE.Object3D)
	{
		if(object.locked)
		{
			this.panel = new LockedPanel(this, object);
		}
		else if(object instanceof SpineAnimation)
		{
			this.panel = new SpinePanel(this, object);
		}
		else if(object instanceof THREE.SkinnedMesh)
		{
			this.panel = new MeshPanel(this, object);
		}
		else if(object instanceof Text3D)
		{
			this.panel = new Text3DPanel(this, object);
		}
		else if(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line)
		{
			this.panel = new MeshPanel(this, object);
		}
		else if(object instanceof THREE.Light)
		{
			if(object instanceof THREE.PointLight)
			{
				this.panel = new PointLightPanel(this, object);
			}
			else if(object instanceof THREE.RectAreaLight)
			{
				this.panel = new RectAreaLightPanel(this, object);
			}
			else if(object instanceof THREE.SpotLight)
			{
				this.panel = new SpotLightPanel(this, object);
			}
			else if(object instanceof THREE.DirectionalLight)
			{
				this.panel = new DirectionalLightPanel(this, object);
			}
			else if(object instanceof THREE.HemisphereLight)
			{
				this.panel = new HemisphereLightPanel(this, object);
			}
			else
			{
				this.panel = new AmbientLightPanel(this, object);
			}
		}
		else if(object instanceof ParticleEmitter)
		{
			this.panel = new ParticleEmitterPanel(this, object);
		}
		else if(object instanceof Sky)
		{
			this.panel = new SkyPanel(this, object);
		}
		else if(object instanceof LeapMotion)
		{
			this.panel = new LeapPanel(this, object);
		}
		else if(object instanceof KinectDevice)
		{
			this.panel = new KinectPanel(this, object);
		}
		else if(object instanceof PerspectiveCamera)
		{
			this.panel = new PerspectiveCameraPanel(this, object);
		}
		else if(object instanceof OrthographicCamera)
		{
			this.panel = new OrthographicCameraPanel(this, object);
		}
		else if(object instanceof CubeCamera)
		{
			this.panel = new CubeCameraPanel(this, object);
		}
		else if(object instanceof THREE.Audio)
		{
			this.panel = new AudioEmitterPanel(this, object);
		}
		else if(object instanceof Scene)
		{
			this.panel = new ScenePanel(this, object);
		}
		else if(object instanceof Script)
		{
			this.panel = new ScriptPanel(this, object);
		}
		else if(object instanceof Program)
		{
			this.panel = new ProgramPanel(this, object);
		}
		else if(object instanceof PhysicsObject)
		{
			this.panel = new PhysicsPanel(this, object);
		}
		else if(object instanceof OrbitControls)
		{
			this.panel = new OrbitControlsPanel(this, object);
		}
		else if(object instanceof FirstPersonControls)
		{
			this.panel = new FirstPersonControlsPanel(this, object);
		}
		else
		{
			this.panel = new ObjectPanel(this, object);
		}
	}
	else if(object instanceof Resource)
	{
		if(object instanceof Audio)
		{
			this.panel = new AudioPanel(this, object);
		}
		else if(object instanceof Image)
		{
			this.panel = new ImagePanel(this, object);
		}
		else if(object instanceof Video)
		{
			this.panel = new VideoPanel(this, object);
		}
		else
		{
			this.panel = new ResourcePanel(this, object);
		}
	}
	else if(object instanceof THREE.Material)
	{
		this.panel = new MaterialPanel(this, object);
	}
	else if(object instanceof THREE.Texture)
	{
		this.panel = new TexturePanel(this, object);
	}

	if(this.panel !== null)
	{
		this.panel.updatePanel();
		this.panel.size.copy(this.size);
		this.panel.updateInterface();
	}
};

PanelContainer.prototype.updateValues = function()
{	
	if(this.panel !== null)
	{
		this.panel.updatePanel();
	}
};

PanelContainer.prototype.updateSize = function()
{	
	TabElement.prototype.updateSize.call(this);

	if(this.panel !== null)
	{
		this.panel.size.copy(this.size);
		this.panel.updateInterface();
	}
};
