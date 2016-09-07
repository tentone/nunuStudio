"use strict";

function SpineAnimation(json, atlas, path)
{
	var images = [];
	var texture_atlas = new spine.TextureAtlas(atlas, function(file)
	{
		var image = new Image(path + "\\" + file);
		images.push(image);

		var element = document.createElement("img");
		element.src = image.data;
		element.width = 1024;
		element.height = 1024;

		return new spine.threejs.ThreeJsTexture(element);
	});
	
	var loader = new spine.TextureAtlasAttachmentLoader(texture_atlas);
	var skeleton = new spine.SkeletonJson(loader).readSkeletonData(json);

	THREE.Mesh.call(this);

	this.zOffset = 0.1;
	
	this.skeleton = new spine.Skeleton(skeleton);

	var animation = new spine.AnimationStateData(skeleton);
	this.state = new spine.AnimationState(animation);

	this.batcher = new spine.threejs.MeshBatcher(this);

	var material = new THREE.MeshBasicMaterial();
	material.side = THREE.DoubleSide;
	material.transparent = true;
	this.material = material;

	this.json = json;
	this.atlas = atlas;
	this.images = images;

	this.name = "spine";
	this.type = "SpineAnimation";

	this.frustumCulled = false;
	this.receiveShadow = true;
	this.castShadow = true;

	this.clock = new THREE.Clock();
	
	var mesh = this;
	var clock = this.clock;
	var state = this.state;
	var skeleton = this.skeleton;

	var update = function()
	{
		requestAnimationFrame(update);
		state.update(clock.getDelta());
		state.apply(skeleton);
		skeleton.updateWorldTransform();
		mesh.updateGeometry();
	};
	requestAnimationFrame(update);
}

SpineAnimation.prototype = Object.create(THREE.Mesh.prototype);
SpineAnimation.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];

SpineAnimation.prototype.setAnimation = function(track, name)
{
	this.state.setAnimation(track, name, true);
}

SpineAnimation.prototype.update = function(delta)
{
	/*var state = this.state;
	var skeleton = this.skeleton;
	state.update(delta);
	state.apply(skeleton);
	skeleton.updateWorldTransform();
	this.updateGeometry();*/

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Update mesh geometry from animation state
SpineAnimation.prototype.updateGeometry = function()
{
	var geometry = this.geometry;
	var numVertices = 0;
	var verticesLength = 0;
	var indicesLength = 0;
	var blendMode = null;
	var vertices = null;
	var triangles = null;
	var drawOrder = this.skeleton.drawOrder;
	var batcher = this.batcher;
	batcher.begin();
	
	var z = 0;
	var zOffset = this.zOffset;
	for(var i = 0, n = drawOrder.length; i < n; i++)
	{
		var slot = drawOrder[i];
		var attachment = slot.getAttachment();
		var texture = null;
		if(attachment instanceof spine.RegionAttachment)
		{
			var region = attachment;
			vertices = region.updateWorldVertices(slot, false);
			triangles = SpineAnimation.QUAD_TRIANGLES;
			texture = region.region.renderObject.texture;
		}
		else if(attachment instanceof spine.MeshAttachment)
		{
			var mesh = attachment;
			vertices = mesh.updateWorldVertices(slot, false);
			triangles = mesh.triangles;
			texture = mesh.region.renderObject.texture;
		}
		else
		{
			continue;
		}

		if(texture !== null)
		{
			if(!this.material.map)
			{
				var mat = this.material;
				mat.map = texture.texture;
				mat.needsUpdate = true;
			}
			this.batcher.batch(vertices, triangles, z);
			z += zOffset;
		}
	}
	batcher.end();
}

//Serialize animation data
SpineAnimation.prototype.toJSON = function(meta)
{
	var geometry = this.geometry;
	var material = this.material;
	this.geometry = undefined;
	this.material = undefined;

	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.json = this.json;
	data.object.atlas = this.atlas;

	this.geometry = geometry;
	this.material = material;

	return data;
}