"use strict";

/** 
 * Renderer configuration object form template.
 *
 * @class RendererConfigurationFormTemplate
 */
function RendererConfigurationFormTemplate(form, object)
{
	FormTemplate.call(this, form, object);

	var self = this;

	/*backend: this.backend,
	autoClear: this.autoClear,
	autoClearColor: this.autoClearColor,
	autoClearDepth: this.autoClearDepth,
	autoClearStencil: this.autoClearStencil,
	antialiasing: this.antialiasing,
	shadows: this.shadows,
	stencil: this.stencil,
	shadowsType: this.shadowsType,
	shadowsAutoUpdate: this.shadowsAutoUpdate,
	toneMapping: this.toneMapping,
	toneMappingExposure: this.toneMappingExposure,
	toneMappingWhitePoint: this.toneMappingWhitePoint,
	sortObjects: this.sortObjects,
	gammaFactor: this.gammaFactor,
	gammaInput: this.gammaInput,
	gammaOutput: this.gammaOutput,
	precision: this.precision,
	alpha: this.alpha,
	premultipliedAlpha: this.premultipliedAlpha,
	preserveDrawingBuffer: this.preserveDrawingBuffer,
	powerPreference: this.powerPreference,
	logarithmicDepthBuffer: this.logarithmicDepthBuffer,
	physicallyCorrectLights: this.physicallyCorrectLights*/

	//Shadows settings
	this.form.addText("Backend").setAltText("Prefered redering backend API to use if available.");
	this.backend = new DropdownList(this.form);
	this.backend.size.set(150, 18);
	this.backend.addValue("WebGL", RendererConfiguration.WEBGL);
	this.backend.addValue("WebGL 2", RendererConfiguration.WEBGL2);
	this.backend.setOnChange(function()
	{
		self.object.backend = self.backend.getValue();
	});
	this.form.add(this.shadowsType);
	this.form.nextRow();


	//Antialiasing
	this.form.addText("Antialiasing").setAltText("Antialiasing can be used to smooth jaged edges.");
	this.antialiasing = new CheckBox(this.form);
	this.antialiasing.size.set(18, 18);
	this.antialiasing.setOnChange(function()
	{

	});
	this.form.add(this.antialiasing);
	this.form.nextRow();

	//Shadows
	this.form.addText(Locale.shadows);
	this.shadows = new CheckBox(this.form);
	this.shadows.size.set(18, 18);
	this.shadows.setOnChange(function()
	{

	});
	this.form.add(this.shadows);
	this.form.nextRow();

	//Shadows settings
	this.form.addText("Shadows type");
	this.shadowsType = new DropdownList(this.form);
	this.shadowsType.size.set(150, 18);
	this.shadowsType.addValue("Basic", THREE.BasicShadowMap);
	this.shadowsType.addValue("PCF", THREE.PCFShadowMap);
	this.shadowsType.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	this.shadowsType.setOnChange(function()
	{
		Editor.settings.render.shadowsType = self.shadowsType.getValue();
	});
	this.form.add(this.shadowsType);
	this.form.nextRow();

	//Tonemapping
	this.form.addText("Tonemapping");
	this.toneMapping = new DropdownList(this.form);
	this.toneMapping.size.set(150, 18);
	this.toneMapping.addValue("None", THREE.NoToneMapping);
	this.toneMapping.addValue("Linear", THREE.LinearToneMapping);
	this.toneMapping.addValue("Reinhard", THREE.ReinhardToneMapping);
	this.toneMapping.addValue("Uncharted", THREE.Uncharted2ToneMapping);
	this.toneMapping.addValue("Cineon", THREE.CineonToneMapping);
	this.toneMapping.addValue("ACES Filmic", THREE.ACESFilmicToneMapping);
	this.toneMapping.setOnChange(function()
	{
		Editor.settings.render.toneMapping = self.toneMapping.getValue();
	});
	this.form.add(this.toneMapping);
	this.form.nextRow();

	//Tonemapping exposure
	this.form.addText("Exposure");
	this.toneMappingExposure = new NumberBox(this.form);
	this.toneMappingExposure.size.set(60, 18);
	this.toneMappingExposure.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingExposure.setStep(0.1);
	this.toneMappingExposure.setOnChange(function()
	{
		Editor.settings.render.toneMappingExposure = self.toneMappingExposure.getValue();
	});
	this.form.add(this.toneMappingExposure);
	this.form.nextRow();

	//Tonemapping whitepoint
	this.form.addText("Whitepoint");
	this.toneMappingWhitePoint = new NumberBox(this.form);
	this.toneMappingWhitePoint.size.set(60, 18);
	this.toneMappingWhitePoint.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingWhitePoint.setStep(0.1);
	this.toneMappingWhitePoint.setOnChange(function()
	{
		Editor.settings.render.toneMappingWhitePoint = self.toneMappingWhitePoint.getValue();
	});
	this.form.add(this.toneMappingWhitePoint);
	this.form.nextRow();
}

RendererConfigurationFormTemplate.prototype = Object.create(FormTemplate.prototype);

RendererConfigurationFormTemplate.prototype.updateValues = function()
{
	
};
