import {Text} from "troika-three-text";

class TextSDF extends Text
{
	constructor()
	{
		super();

		this.text = "text";
		this.fontSize = 0.1;
		this.color = 0xFFFFFF;
		this.anchorX = "center";
		this.anchorY = "middle";
		this.rotation.set(Math.PI, Math.PI, Math.PI);
		this.sync();
	}
}
