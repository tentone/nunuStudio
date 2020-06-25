import {Texture} from "../../../../../core/texture/Texture.js";
import {Container} from "../../../../../core/objects/misc/Container.js";
import {OrthographicCamera} from "../../../../../core/objects/cameras/OrthographicCamera.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {Interface} from "../../../Interface.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {TabComponent} from "../../../../components/tabs/TabComponent.js";
import {TableForm} from "../../../../components/TableForm.js";
import {RendererCanvas} from "../../../../components/RendererCanvas.js";
import {VectorBox} from "../../../../components/input/VectorBox.js";
import {TextBox} from "../../../../components/input/TextBox.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {DualContainer} from "../../../../components/containers/DualContainer.js";
import {Component} from "../../../../components/Component.js";
import {Canvas} from "../../../../components/Canvas.js";
import {Scene, RepeatWrapping, Nearest, PlaneBufferGeometry, Mesh, MeshBasicMaterial, ClampToEdgeWrapping, MirroredRepeatWrapping, NearestFilter, LinearFilter, NearestMipMapNearestFilter, NearestMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipMapLinearFilter} from "three";


function TextureEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.texture, Global.FILE_PATH + "icons/misc/image.png");

	var self = this;

	this.texture = null;

	// Canvas
	this.canvas = new RendererCanvas();
	this.canvas.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.mode = (self.camera.aspect > 1) ? OrthographicCamera.RESIZE_HORIZONTAL : OrthographicCamera.RESIZE_VERTICAL;
		self.camera.updateProjectionMatrix();
	});

	// Camera
	this.camera = new OrthographicCamera(1.2, 1, OrthographicCamera.RESIZE_VERTICAL);

	// Scene
	this.scene = new Scene();

	// Background
	var alpha = new Texture(Global.FILE_PATH + "alpha.png");
	alpha.wrapS = RepeatWrapping;
	alpha.wrapT = RepeatWrapping;
	alpha.magFilter = Nearest;
	alpha.minFilter = Nearest;
	alpha.repeat.set(400, 400);
	
	var geometry = new PlaneBufferGeometry(1, 1);

	this.background = new Mesh(geometry, new MeshBasicMaterial({map: alpha}));
	this.background.position.set(0, 0, -2);
	this.background.scale.set(200, 200, 0);
	this.scene.add(this.background);
	
	// Plane geometry
	this.sprite = new Mesh(geometry, new MeshBasicMaterial({transparent: true}));
	this.sprite.position.set(0, 0, -1);
	this.scene.add(this.sprite);

	this.form = new TableForm();
	this.form.setAutoSize(false);
	this.form.addText("Texture Editor");
	this.form.nextRow();

	// Dual division
	this.division = new DualContainer(this);
	this.division.tabPosition = 0.5;
	this.division.tabPositionMin = 0.1;
	this.division.tabPositionMax = 0.9;
	this.division.attachA(this.canvas);
	this.division.attachB(this.form);

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.texture !== null)
		{
			Editor.addAction(new ChangeAction(self.texture, "name", self.name.getText()));
			self.updatePreview();
			Editor.updateObjectsViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	// WrapS
	this.form.addText(Locale.wrapHor);
	this.wrapS = new DropdownList(this.form);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue(Locale.clampEdge, ClampToEdgeWrapping);
	this.wrapS.addValue(Locale.repeat, RepeatWrapping);
	this.wrapS.addValue(Locale.repeatMirror, MirroredRepeatWrapping);
	this.wrapS.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "wrapS", self.wrapS.getValue()));
		self.updatePreview();
	});
	this.form.add(this.wrapS);
	this.form.nextRow();

	// WrapT
	this.form.addText(Locale.wrapVert);
	this.wrapT = new DropdownList(this.form);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue(Locale.clampEdge, ClampToEdgeWrapping);
	this.wrapT.addValue(Locale.repeat, RepeatWrapping);
	this.wrapT.addValue(Locale.repeatMirror, MirroredRepeatWrapping);
	this.wrapT.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "wrapT", self.wrapT.getValue()));
		self.updatePreview();
	});
	this.form.add(this.wrapT);
	this.form.nextRow();

	// Repeat
	this.form.addText(Locale.repeat);
	this.repeat = new VectorBox(this.form);
	this.repeat.setType(VectorBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setStep(0.01);
	this.repeat.setOnChange(function()
	{
		var value = self.repeat.getValue();
		self.texture.repeat.set(value.x, value.y);
		self.updatePreview();
	});
	this.form.add(this.repeat);
	this.form.nextRow();

	// Offset
	this.form.addText(Locale.offset);
	this.offset = new VectorBox(this.form);
	this.offset.setType(VectorBox.VECTOR2);
	this.offset.size.set(120, 18);
	this.offset.setStep(0.01);
	this.offset.setOnChange(function()
	{
		var value = self.offset.getValue();
		self.texture.offset.set(value.x, value.y);
		self.updatePreview();
	});
	this.form.add(this.offset);
	this.form.nextRow();

	// Center
	this.form.addText(Locale.center);
	this.center = new VectorBox(this.form);
	this.center.setType(VectorBox.VECTOR2);
	this.center.size.set(120, 18);
	this.center.setStep(0.01);
	this.center.setOnChange(function()
	{
		var value = self.center.getValue();
		self.texture.center.set(value.x, value.y);
		self.updatePreview();
	});
	this.form.add(this.center);
	this.form.nextRow();

	// Rotation
	this.form.addText(Locale.rotation);
	this.rotation = new NumberBox(this.form);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.1);
	this.rotation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "rotation", self.rotation.getValue()));
		self.updatePreview();
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	// Minification filter
	this.form.addText(Locale.minFilter);
	this.minFilter = new DropdownList(this.form);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue(Locale.nearest, NearestFilter);
	this.minFilter.addValue(Locale.linear, LinearFilter);
	this.minFilter.addValue("MIP Nearest Nearest", NearestMipMapNearestFilter);
	this.minFilter.addValue("MIP Nearest Linear", NearestMipMapLinearFilter);
	this.minFilter.addValue("MIP Linear Nearest", LinearMipMapNearestFilter);
	this.minFilter.addValue("MIP Linear Linear", LinearMipMapLinearFilter);
	this.minFilter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "minFilter", self.minFilter.getValue()));
		self.updatePreview();
	});
	this.form.add(this.minFilter);
	this.form.nextRow();

	// Magnification filter
	this.form.addText(Locale.magFilter);
	this.magFilter = new DropdownList(this.form);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue(Locale.nearest, NearestFilter);
	this.magFilter.addValue(Locale.linear, LinearFilter);
	this.magFilter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "magFilter", self.magFilter.getValue()));
		self.updatePreview();
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	// Premultiply Alpha
	this.form.addText(Locale.premulAlpha);
	this.premultiplyAlpha = new CheckBox(this.form);
	this.premultiplyAlpha.size.set(18, 18);
	this.premultiplyAlpha.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "premultiplyAlpha", self.premultiplyAlpha.getValue()));
		self.updatePreview();
	});
	this.form.add(this.premultiplyAlpha);
	this.form.nextRow();

	// Flip Y
	this.form.addText(Locale.flipY);
	this.flipY = new CheckBox(this.form);
	this.flipY.size.set(18, 18);
	this.flipY.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.texture, "flipY", self.flipY.getValue()));
		self.updatePreview();
	});
	this.form.add(this.flipY);
	this.form.nextRow();
}

TextureEditor.prototype = Object.create(TabComponent.prototype);

// Activate
TextureEditor.prototype.activate = function()
{
	TabComponent.prototype.activate.call(this);
	
	this.updatePreview();

	var texture = this.texture;
	this.name.setText(texture.name);
	this.wrapT.setValue(texture.wrapT);
	this.wrapS.setValue(texture.wrapS);
	this.repeat.setValue(texture.repeat);
	this.offset.setValue(texture.offset);
	this.center.setValue(texture.center);
	this.rotation.setValue(texture.rotation);
	this.magFilter.setValue(texture.magFilter);
	this.minFilter.setValue(texture.minFilter);
	this.premultiplyAlpha.setValue(texture.premultiplyAlpha);
	this.flipY.setValue(texture.flipY);
};

// Destroy
TextureEditor.prototype.destroy = function()
{
	TabComponent.prototype.destroy.call(this);

	this.canvas.destroy();
};

// Update test material
TextureEditor.prototype.updatePreview = function()
{
	this.sprite.material.map.needsUpdate = true;
	this.sprite.material.needsUpdate = true;
}

// Check if texture is attached to tab
TextureEditor.prototype.isAttached = function(texture)
{
	return this.texture === texture;
}

// Update object data
TextureEditor.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		// Set name
		if(this.texture.name !== undefined)
		{
			this.setName(this.texture.name);
			this.name.setText(this.texture.name);
		}

		// If not found close tab
		if(Editor.program.textures[this.texture.uuid] === undefined)
		{
			this.close();
		}
	}
}

// Attach texure
TextureEditor.prototype.attach = function(texture)
{
	this.texture = texture;
	this.sprite.material.map = texture;
	
	this.updateMetadata();
	this.updatePreview();
};

TextureEditor.prototype.update = function()
{
	this.canvas.renderer.render(this.scene, this.camera);
};

TextureEditor.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.division.size.copy(this.size);
	this.division.updateInterface();
};
export {TextureEditor};