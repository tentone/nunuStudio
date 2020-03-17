"use strict";

/** 
 * The texture renderer is used to generate preview thumbnails.
 *
 * @class TextureRenderer
 * @extends {PreviewRenderer}
 */
function TextureRenderer()
{
	PreviewRenderer.call(this);

	// Camera
	this.camera = new OrthographicCamera(1, 1, OrthographicCamera.RESIZE_VERTICAL);

	// Material
	this.material = new THREE.MeshBasicMaterial({transparent: true});

	// Plane
	this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), this.material);
	this.plane.position.set(0, 0, -1);
	this.scene.add(this.plane);
}

TextureRenderer.prototype = Object.create(PreviewRenderer.prototype);

TextureRenderer.generateElement = function(texture)
{
	var preview = document.createElement("img");
	TextureRenderer.render(texture, function(url)
	{
		preview.src = url;
	});

	return preview;
};

TextureRenderer.render = function(texture, onRender)
{
	if(TextureRenderer.instance === undefined)
	{
		TextureRenderer.instance = new TextureRenderer();
	}

	TextureRenderer.instance.render(texture, onRender);
};

TextureRenderer.prototype.render = function(texture, onRender)
{
	if(texture.isCubeTexture)
	{
		var cube = new CubemapFlatRenderer(texture, 64/4, 0, 64/8);
		cube.setSize(64, 64);
		cube.render(this.renderer);
		onRender(this.canvas.toDataURL());
	}
	else
	{
		this.material.map = texture;
		this.material.needsUpdate = true;
		this.renderer.render(this.scene, this.camera);
		onRender(this.canvas.toDataURL());
	}
};
