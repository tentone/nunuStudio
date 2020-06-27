import {RenderPass} from "../../../../core/postprocessing/RenderPass.js";
import {UnrealBloomPass} from "../../../../core/postprocessing/pass/UnrealBloomPass.js";
import {TechnicolorPass} from "../../../../core/postprocessing/pass/TechnicolorPass.js";
import {SSAOPass} from "../../../../core/postprocessing/pass/SSAOPass.js";
import {SSAONOHPass} from "../../../../core/postprocessing/pass/SSAONOHPass.js";
import {SobelPass} from "../../../../core/postprocessing/pass/SobelPass.js";
import {HueSaturationPass} from "../../../../core/postprocessing/pass/HueSaturationPass.js";
import {FilmPass} from "../../../../core/postprocessing/pass/FilmPass.js";
import {DotScreenPass} from "../../../../core/postprocessing/pass/DotScreenPass.js";
import {CopyPass} from "../../../../core/postprocessing/pass/CopyPass.js";
import {ColorifyPass} from "../../../../core/postprocessing/pass/ColorifyPass.js";
import {BokehPass} from "../../../../core/postprocessing/pass/BokehPass.js";
import {BloomPass} from "../../../../core/postprocessing/pass/BloomPass.js";
import {FXAAPass} from "../../../../core/postprocessing/pass/antialiasing/FXAAPass.js";
import {AfterimagePass} from "../../../../core/postprocessing/pass/AfterimagePass.js";
import {AdaptiveToneMappingPass} from "../../../../core/postprocessing/pass/AdaptiveToneMappingPass.js";
import {ChangeAction} from "../../../history/action/ChangeAction.js";
import {PassNode} from "./postprocessing/PassNode.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {TableForm} from "../../../components/TableForm.js";
import {RendererCanvas} from "../../../components/RendererCanvas.js";
import {TextBox} from "../../../components/input/TextBox.js";
import {DualContainer} from "../../../components/containers/DualContainer.js";
import {ButtonText} from "../../../components/buttons/ButtonText.js";

function CameraEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, "camera", Global.FILE_PATH + "icons/camera/camera.png");

	var self = this;

	this.camera = null;
	
	// Canvas
	this.canvas = new RendererCanvas(undefined, Editor.getRendererConfig());

	this.form = new TableForm();
	this.form.setAutoSize(false);

	// Main
	this.main = new DualContainer(this);
	this.main.tabPosition = 0.6;
	this.main.attachA(this.canvas);
	this.main.attachB(this.form);

	// Camera
	this.form.addText(Locale.camera);
	this.form.nextRow();

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.camera !== null)
		{
			Editor.addAction(new ChangeAction(self.camera, "name", self.name.getText()));
			Editor.updateObjectsViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	this.form.addText(Locale.postProcessing);
	this.form.nextRow();

	var addRenderPassButton = function(name, PassConstructor)
	{
		var button = new ButtonText(self.form);
		button.size.set(100, 18);
		button.text.setText(name);
		button.setOnClick(function()
		{
			var pass = new PassConstructor();

			var composer = self.camera.composer;
			pass.renderToScreen = true;
			for(var i = 0; i < composer.passes.length; i++)
			{
				composer.passes[i].renderToScreen = false;
			}
			
			self.camera.composer.addPass(pass);
			self.updatePostNodes();
		});
		self.form.add(button);
	};


	addRenderPassButton(Locale.render, RenderPass);
	addRenderPassButton("FXAA", FXAAPass);
	addRenderPassButton("Colorify", ColorifyPass);
	self.form.nextRow();
	addRenderPassButton("Unreal Bloom", UnrealBloomPass);
	addRenderPassButton("Bloom", BloomPass);
	addRenderPassButton("Hue & Saturation", HueSaturationPass);
	self.form.nextRow();
	addRenderPassButton("SSAO NOH", SSAONOHPass);
	addRenderPassButton("Bokeh", BokehPass);
	addRenderPassButton("Technicolor", TechnicolorPass);
	self.form.nextRow();
	addRenderPassButton("Film", FilmPass);
	addRenderPassButton("Dot Screen", DotScreenPass);
	addRenderPassButton("Sobel", SobelPass);
	self.form.nextRow();
	addRenderPassButton("SSAO", SSAOPass);
	addRenderPassButton(Locale.copy, CopyPass);
	addRenderPassButton("Adaptive Tone Mapping", AdaptiveToneMappingPass);
	self.form.nextRow();
	addRenderPassButton("After image", AfterimagePass);
	self.form.nextRow();
	
	this.postNodes = new TableForm(this.form);
	this.form.add(this.postNodes);
	this.form.nextRow();
}

CameraEditor.prototype = Object.create(TabComponent.prototype);

// Activate
CameraEditor.prototype.activate = function()
{
	TabComponent.prototype.activate.call(this);

	this.name.setText(this.camera.name);
	this.updatePostNodes();
};

// Update post processing nodes
CameraEditor.prototype.updatePostNodes = function()
{
	this.postNodes.removeAll();

	var passes = this.camera.composer.passes;
	for(var i = 0; i < passes.length; i++)
	{
		var node = PassNode.createPass(this.postNodes.element, passes[i].type);
		node.setPass(passes[i]);
		node.setComposer(this.camera.composer);
		node.setEditor(this);

		this.postNodes.add(node);
		this.postNodes.nextRow();
	}
	
	this.postNodes.updateInterface();
	this.form.updateInterface();
};

// Destroy
CameraEditor.prototype.destroy = function()
{
	TabComponent.prototype.destroy.call(this);

	this.canvas.destroy();
};

// Update tab state
CameraEditor.prototype.update = function()
{
	if(this.camera !== null)
	{
		this.camera.aspect = this.canvas.size.x / this.canvas.size.y;
		this.camera.updateProjectionMatrix();
		this.camera.resize(this.canvas.size.x, this.canvas.size.y);
		this.camera.render(this.canvas.renderer, this.camera.getScene());
	}
};

// Update tab metadata
CameraEditor.prototype.updateMetadata = function()
{
	if(this.camera !== null)
	{
		this.setName(this.camera.name);
		this.name.setText(this.camera.name);

		// Check if object has a parent
		if(this.camera.parent === null)
		{
			this.close();
			return;
		}

		// Check if object exists in parent
		var children = this.camera.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.camera.uuid === children[i].uuid)
			{
				return;
			}
		}

		// If not found close tab
		if(i >= children.length)
		{
			this.close();
		}
	}
};

CameraEditor.prototype.attach = function(camera)
{
	this.camera = camera;

	this.updateMetadata();
};

CameraEditor.prototype.isAttached = function(camera)
{
	return this.camera === camera;
};

CameraEditor.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.main.size.copy(this.size);
	this.main.updateInterface();
};
export {CameraEditor};