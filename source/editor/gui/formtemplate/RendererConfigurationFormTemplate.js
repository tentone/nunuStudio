"use strict";

/** 
 * Renderer configuration object form template.
 *
 * Contains all rendering related configurations, to be used booth for editor settings and the program object.
 * 
 * @class RendererConfigurationFormTemplate
 * @extends {FormTemplate}
 */
function RendererConfigurationFormTemplate(form, object)
{
	FormTemplate.call(this, form, object);

	var self = this;

	var updateRenderers = function()
	{
		var tabs = Editor.gui.tab.getActiveTab();

		for(var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];

			if(tab instanceof SceneEditor)
			{
				tab.reloadContext();
			}
		}
	};

	this.form.addText(Locale.backend).setAltText(Locale.hintBackend);
	this.backend = new DropdownList(this.form);
	this.backend.size.set(150, 18);
	this.backend.addValue(Locale.webgl, RendererConfiguration.WEBGL);
	this.backend.addValue(Locale.webgl2, RendererConfiguration.WEBGL2);
	this.backend.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "backend", self.backend.getValue()), updateRenderers));
	});
	this.form.add(this.backend);
	this.form.nextRow();

	//Antialiasing
	this.form.addText(Locale.antialiasing).setAltText(Locale.hintAntialiasing);
	this.antialiasing = new CheckBox(this.form);
	this.antialiasing.size.set(18, 18);
	this.antialiasing.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "antialiasing", self.antialiasing.getValue()), updateRenderers));
	});
	this.form.add(this.antialiasing);
	this.form.nextRow();

	//Alpha
	this.form.addText(Locale.alpha).setAltText(Locale.hintAlpha);
	this.alpha = new CheckBox(this.form);
	this.alpha.size.set(18, 18);
	this.alpha.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "alpha", self.alpha.getValue()), updateRenderers));
	});
	this.form.add(this.alpha);
	this.form.nextRow();

	//Premultiplied Alpha
	this.form.addText(Locale.premultipliedAlpha).setAltText(Locale.hintPremultipliedAlpha);
	this.premultipliedAlpha = new CheckBox(this.form);
	this.premultipliedAlpha.size.set(18, 18);
	this.premultipliedAlpha.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "premultipliedAlpha", self.premultipliedAlpha.getValue()), updateRenderers));
	});
	this.form.add(this.premultipliedAlpha);
	this.form.nextRow();

	//Preserver drawing buffer
	this.form.addText(Locale.preserveDrawingBuffer);
	this.preserveDrawingBuffer = new CheckBox(this.form);
	this.preserveDrawingBuffer.size.set(18, 18);
	this.preserveDrawingBuffer.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "preserveDrawingBuffer", self.preserveDrawingBuffer.getValue()), updateRenderers));
	});
	this.form.add(this.preserveDrawingBuffer);
	this.form.nextRow();

	//Logaritmic depth
	this.form.addText(Locale.physicallyCorrectLights).setAltText(Locale.hintPhysicallyCorrectLights);
	this.physicallyCorrectLights = new CheckBox(this.form);
	this.physicallyCorrectLights.size.set(18, 18);
	this.physicallyCorrectLights.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "physicallyCorrectLights", self.physicallyCorrectLights.getValue()), updateRenderers));
	});
	this.form.add(this.physicallyCorrectLights);
	this.form.nextRow();

	//Logaritmic depth
	this.form.addText(Locale.logarithmicDepthBuffer).setAltText(Locale.hintLogarithmicDepthBuffer);
	this.logarithmicDepthBuffer = new CheckBox(this.form);
	this.logarithmicDepthBuffer.size.set(18, 18);
	this.logarithmicDepthBuffer.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "logarithmicDepthBuffer", self.logarithmicDepthBuffer.getValue()), updateRenderers));
	});
	this.form.add(this.logarithmicDepthBuffer);
	this.form.nextRow();

	//Auto clear
	this.form.addText(Locale.autoClear);
	this.autoClear = new CheckBox(this.form);
	this.autoClear.size.set(18, 18);
	this.autoClear.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "autoClear", self.autoClear.getValue()), updateRenderers));
	});
	this.form.add(this.autoClear);
	this.form.nextRow();

	this.form.addText(Locale.autoClearColor).setAltText(Locale.hintAutoClearColor);
	this.autoClearColor = new CheckBox(this.form);
	this.autoClearColor.size.set(18, 18);
	this.autoClearColor.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "autoClearColor", self.autoClearColor.getValue()), updateRenderers));
	});
	this.form.add(this.autoClearColor);
	this.form.nextRow();

	this.form.addText(Locale.autoClearDepth).setAltText(Locale.hintAutoClearDepth);
	this.autoClearDepth = new CheckBox(this.form);
	this.autoClearDepth.size.set(18, 18);
	this.autoClearDepth.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "autoClearDepth", self.autoClearDepth.getValue()), updateRenderers));
	});
	this.form.add(this.autoClearDepth);
	this.form.nextRow();

	this.form.addText(Locale.autoClearStencil).setAltText(Locale.hintAutoClearStencil);
	this.autoClearStencil = new CheckBox(this.form);
	this.autoClearStencil.size.set(18, 18);
	this.autoClearStencil.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "autoClearStencil", self.autoClearStencil.getValue()), updateRenderers));
	});
	this.form.add(this.autoClearStencil);
	this.form.nextRow();

	this.form.addText(Locale.stencil).setAltText(Locale.hintStencil);
	this.stencil = new CheckBox(this.form);
	this.stencil.size.set(18, 18);
	this.stencil.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "stencil", self.stencil.getValue()), updateRenderers));
	});
	this.form.add(this.stencil);
	this.form.nextRow();


	this.form.addText(Locale.sortObjects).setAltText(Locale.hintSortObjects);
	this.sortObjects = new CheckBox(this.form);
	this.sortObjects.size.set(18, 18);
	this.sortObjects.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "sortObjects", self.sortObjects.getValue()), updateRenderers));
	});
	this.form.add(this.sortObjects);
	this.form.nextRow();


	//Shadows
	this.form.addText(Locale.shadows);
	this.shadows = new CheckBox(this.form);
	this.shadows.size.set(18, 18);
	this.shadows.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "shadows", self.shadows.getValue()), updateRenderers));
	});
	this.form.add(this.shadows);
	this.form.nextRow();

	//Shadows settings
	this.form.addText(Locale.shadowType);
	this.shadowsType = new DropdownList(this.form);
	this.shadowsType.size.set(150, 18);
	this.shadowsType.addValue("Basic", THREE.BasicShadowMap);
	this.shadowsType.addValue("PCF", THREE.PCFShadowMap);
	this.shadowsType.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	this.shadowsType.addValue("VSM", VSMShadowMap);
	this.shadowsType.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "shadowsType", self.shadowsType.getValue()), updateRenderers));
	});
	this.form.add(this.shadowsType);
	this.form.nextRow();

	this.form.addText(Locale.shadowsAutoUpdate).setAltText(Locale.hintShadowsAutoUpdate);
	this.shadowsAutoUpdate = new CheckBox(this.form);
	this.shadowsAutoUpdate.size.set(18, 18);
	this.shadowsAutoUpdate.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "shadowsAutoUpdate", self.shadowsAutoUpdate.getValue()), updateRenderers));
	});
	this.form.add(this.shadowsAutoUpdate);
	this.form.nextRow();

	//Gamma
	this.form.addText(Locale.gammaFactor);
	this.gammaFactor = new NumberBox(this.form);
	this.gammaFactor.size.set(60, 18);
	this.gammaFactor.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.gammaFactor.setStep(0.1);
	this.gammaFactor.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "gammaFactor", self.gammaFactor.getValue()), updateRenderers));
	});
	this.form.add(this.gammaFactor);
	this.form.nextRow()

	//Gamma input
	this.form.addText(Locale.gammaInput);
	this.gammaInput = new CheckBox(this.form);
	this.gammaInput.size.set(18, 18);
	this.gammaInput.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "gammaInput", self.gammaInput.getValue()), updateRenderers));
	});
	this.form.add(this.gammaInput);
	this.form.nextRow();

	//Gamma output
	this.form.addText(Locale.gammaOutput);
	this.gammaOutput = new CheckBox(this.form);
	this.gammaOutput.size.set(18, 18);
	this.gammaOutput.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "gammaOutput", self.gammaOutput.getValue()), updateRenderers));
	});
	this.form.add(this.gammaOutput);
	this.form.nextRow();

	//Power preference
	this.form.addText(Locale.powerPreference).setAltText(Locale.hintPowerPreference);
	this.powerPreference = new DropdownList(this.form);
	this.powerPreference.size.set(150, 18);
	this.powerPreference.addValue(Locale.default, "default");
	this.powerPreference.addValue(Locale.highPerformance, "high-performance");
	this.powerPreference.addValue(Locale.lowPower, "low-power");
	this.powerPreference.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "powerPreference", self.powerPreference.getValue()), updateRenderers));
	});
	this.form.add(this.powerPreference);
	this.form.nextRow();

	//Precision
	this.form.addText(Locale.precision).setAltText(Locale.hintPrecision);
	this.precision = new DropdownList(this.form);
	this.precision.size.set(150, 18);
	this.precision.addValue(Locale.highp, "highp");
	this.precision.addValue(Locale.mediump, "mediump");
	this.precision.addValue(Locale.lowp, "lowp");
	this.precision.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "precision", self.precision.getValue()), updateRenderers));
	});
	this.form.add(this.precision);
	this.form.nextRow();

	//Tonemapping
	this.form.addText(Locale.tonemapping).setAltText(Locale.hintTonemapping);
	this.toneMapping = new DropdownList(this.form);
	this.toneMapping.size.set(150, 18);
	this.toneMapping.addValue(Locale.none, THREE.NoToneMapping);
	this.toneMapping.addValue(Locale.linear, THREE.LinearToneMapping);
	this.toneMapping.addValue("Reinhard", THREE.ReinhardToneMapping);
	this.toneMapping.addValue("Uncharted", THREE.Uncharted2ToneMapping);
	this.toneMapping.addValue("Cineon", THREE.CineonToneMapping);
	this.toneMapping.addValue("ACES Filmic", THREE.ACESFilmicToneMapping);
	this.toneMapping.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "toneMapping", self.toneMapping.getValue()), updateRenderers));
	});
	this.form.add(this.toneMapping);
	this.form.nextRow();

	//Tonemapping exposure
	this.form.addText(Locale.exposure);
	this.toneMappingExposure = new NumberBox(this.form);
	this.toneMappingExposure.size.set(60, 18);
	this.toneMappingExposure.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingExposure.setStep(0.1);
	this.toneMappingExposure.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "toneMappingExposure", self.toneMappingExposure.getValue()), updateRenderers));
	});
	this.form.add(this.toneMappingExposure);
	this.form.nextRow();

	//Tonemapping whitepoint
	this.form.addText(Locale.whitepoint);
	this.toneMappingWhitePoint = new NumberBox(this.form);
	this.toneMappingWhitePoint.size.set(60, 18);
	this.toneMappingWhitePoint.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingWhitePoint.setStep(0.1);
	this.toneMappingWhitePoint.setOnChange(function()
	{
		Editor.addAction(new CallbackAction(new ChangeAction(self.object, "toneMappingWhitePoint", self.toneMappingWhitePoint.getValue()), updateRenderers));
	});
	this.form.add(this.toneMappingWhitePoint);
	this.form.nextRow();
}

RendererConfigurationFormTemplate.prototype = Object.create(FormTemplate.prototype);

RendererConfigurationFormTemplate.prototype.updateValues = function()
{
	this.backend.setValue(this.object.backend);
	this.autoClear.setValue(this.object.autoClear);
	this.autoClearColor.setValue(this.object.autoClearColor);
	this.autoClearDepth.setValue(this.object.autoClearDepth);
	this.autoClearStencil.setValue(this.object.autoClearStencil);
	this.antialiasing.setValue(this.object.antialiasing);
	this.shadows.setValue(this.object.shadows);
	this.stencil.setValue(this.object.stencil);
	this.shadowsType.setValue(this.object.shadowsType);
	this.shadowsAutoUpdate.setValue(this.object.shadowsAutoUpdate);
	this.toneMapping.setValue(this.object.toneMapping);
	this.toneMappingExposure.setValue(this.object.toneMappingExposure);
	this.toneMappingWhitePoint.setValue(this.object.toneMappingWhitePoint);
	this.sortObjects.setValue(this.object.sortObjects);
	this.gammaFactor.setValue(this.object.gammaFactor);
	this.gammaInput.setValue(this.object.gammaInput);
	this.gammaOutput.setValue(this.object.gammaOutput);
	this.precision.setValue(this.object.precision);
	this.alpha.setValue(this.object.alpha);
	this.premultipliedAlpha.setValue(this.object.premultipliedAlpha);
	this.preserveDrawingBuffer.setValue(this.object.preserveDrawingBuffer);
	this.powerPreference.setValue(this.object.powerPreference);
	this.logarithmicDepthBuffer.setValue(this.object.logarithmicDepthBuffer);
	this.physicallyCorrectLights.setValue(this.object.physicallyCorrectLights);
};
