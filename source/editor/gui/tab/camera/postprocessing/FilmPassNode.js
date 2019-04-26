"use strict";

function FilmPassNode(parent)
{
	PassNode.call(this, parent, "Film");

	var self = this;

	this.addText("Grayscale");
	this.grayscale = new CheckBox(this);
	this.grayscale.size.set(18, 18);
	this.grayscale.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "grayscale", self.grayscale.getValue()));
	});
	this.add(this.grayscale);
	this.nextRow();

	this.addText("Noise");
	this.noiseIntensity = new NumberBox(this);
	this.noiseIntensity.size.set(60, 18);
	this.noiseIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "noiseIntensity", self.noiseIntensity.getValue()));
	});
	this.add(this.noiseIntensity);
	this.nextRow();

	this.addText(Locale.intensity);
	this.scanlinesIntensity = new NumberBox(this);
	this.scanlinesIntensity.size.set(60, 18);
	this.scanlinesIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "scanlinesIntensity", self.scanlinesIntensity.getValue()));
	});
	this.add(this.scanlinesIntensity);
	this.nextRow();

	this.addText("Scanlines");
	this.scanlinesCount = new NumberBox(this);
	this.scanlinesCount.size.set(60, 18);
	this.scanlinesCount.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "scanlinesCount", self.scanlinesCount.getValue()));
	});
	this.add(this.scanlinesCount);
	this.nextRow();
}

FilmPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("Film", FilmPassNode);

FilmPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.grayscale.setValue(pass.grayscale);
	this.noiseIntensity.setValue(pass.noiseIntensity);
	this.scanlinesIntensity.setValue(pass.scanlinesIntensity);
	this.scanlinesCount.setValue(pass.scanlinesCount);
};