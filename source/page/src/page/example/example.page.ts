import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'example-page',
  templateUrl: './example.page.html'
})
export class ExamplePage implements OnInit {
	@ViewChild('canvas', {static: true}) public canvas: ElementRef;
	@ViewChild('bar', {static: true}) public bar: ElementRef;

	// @ts-ignore
	public app: Nunu.App;

	public ngOnInit(): void {
		const parameters = location.search.substring(1).split("&");
		if (parameters.length > 0)
		{
			let entry: string = unescape(parameters[0].split("=")[1]).replace(new RegExp("\"", "g"), "");

			// @ts-ignore
			this.app = new Nunu.App(this.canvas.nativeElement);
			this.app.loadRunProgram(entry, undefined, (progress, event) => {
				this.bar.nativeElement.style.width = progress + "%";
			});
		}
	}

	public ngAfterViewChecked(): void {
		this.app.resize();
	}

	public ngOnDestroy(): void {
		this.app.exit();
	}

	public toggleVR(): void {
		if (this.app.vrAvailable()) {
			this.app.toggleVR();
		}
	}

	public toggleFullscreen(): void {
		this.app.toggleFullscreen();
	}
}
