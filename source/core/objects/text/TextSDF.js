import {Text} from "troika-three-text";

function TextSDF() 
{
	Text.call(this);

	this.text = "text";
	this.fontSize = 0.1;
	this.color = 0xFFFFFF;
	this.anchorX = "center";
	this.anchorY = "middle";
	this.rotation.set(Math.PI, Math.PI, Math.PI);
	this.sync();
}

TextSDF.prototype = Object.create(Text.prototype);
