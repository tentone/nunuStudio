import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'example-page',
  templateUrl: './example.page.html'
})
export class ExamplePage implements OnInit {
	public app: any;

	public ngOnInit(): void {
		//Create app object
		// @ts-ignore
		this.app = new Nunu.App();

		//Onload enable the vr and fullscreen buttons
		const logo = document.getElementById("logo");
		const onLoad = function () {
			let button = document.getElementById("fullscreen");
			button.style.visibility = "visible";

			//Check if VR is available
			if (this.app.vrAvailable()) {
				button = document.getElementById("vr");
				button.style.visibility = "visible";
			}

			// Check if AR is available
			if (this.app.arAvailable()) {
				button = document.getElementById("ar");
				button.style.visibility = "visible";
			}

			//Remove logo and loading bar
			document.body.removeChild(logo);
		};

		//On progress callback
		const bar = document.getElementById("bar");
		const onProgress = function (event) {
			if (event.lengthComputable) {
				const progress = event.loaded / event.total * 100;
				bar.style.width = progress + "%";
			}
		};

		const parameters = location.search.substring(1).split("&");
		if(parameters.length > 0)
		{
			const entry = unescape(parameters[0].split("=")[1]).replace(new RegExp("\"", "g"), "");

			this.app.loadRunProgram(entry, onLoad, onProgress);
		}
		else
		{
			alert("nunuStudio app file not found!");
		}
	}

	//Resize nunu app (must be called every time the window is resized)
	public resize(): void {
		this.app.resize();
	}

	//Toggle fullscreen mode
	public toggleFullscreen(): void {
		this.app.toggleFullscreen(document.body);
	}

	//Toggle VR mode
	public toggleVR(): void {
		this.app.toggleVR();
	}

	// Toggle AR mode
	public toggleAR(): void {
		this.app.toggleAR();
	}
}
