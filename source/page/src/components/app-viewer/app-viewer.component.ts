import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'app-viewer',
	templateUrl: 'app-viewer.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppViewerComponent implements OnInit, OnDestroy {
	@ViewChild('canvas', {static: true}) public canvas: ElementRef;

	@Input() public fname: string;

	// @ts-ignore
	public app: Nunu.App;

	public ngOnInit(): void {
		// @ts-ignore
		this.app = new Nunu.App(this.canvas.nativeElement);
		this.app.loadRunProgram(this.fname, () => {
			// Fullscreen Button
			const fs = this.createButton("Fullscreen");
			fs.onclick = () => {
				this.app.toggleFullscreen();
			};
			this.canvas.nativeElement.parentElement.appendChild(fs);

			// VR Button
			setTimeout(() =>
			{
				if (this.app.vrAvailable())
				{
					const vr = this.createButton("Enter VR");
					vr.onclick = () => {
						this.app.toggleVR();
					};
					this.canvas.nativeElement.parentElement.appendChild(vr);
				}
			}, 1000);
		});

		this.resize();
		this.canvas.nativeElement.onresize = () => {
			this.resize();
		};
	}

	public ngOnDestroy(): void {
		this.app.exit();
	}

	public resize(): void {
		// @ts-ignore
		if (Nunu.Nunu.isFullscreen()) {
			this.canvas.nativeElement.width = window.innerWidth;
			this.canvas.nativeElement.height = window.innerHeight;
		} else {
			this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
			this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
		}

		this.app.resize();
	}

	public createButton(text): HTMLElement {
		const button = document.createElement("div");
		button.style.backgroundColor = "#333333";
		button.style.color = "#FFFFFF";
		button.style.height = "30px";
		button.style.lineHeight = "30px";
		button.style.borderRadius = "5px";
		button.style.marginTop = "2px";
		button.style.marginLeft = "40%";
		button.style.width = "20%";
		button.style.verticalAlign = "middle";
		button.style.textAlign = "center";
		button.style.cursor = "pointer";

		const span = document.createElement("span");
		button.appendChild(span);

		const b = document.createElement("b");
		b.innerHTML = text;
		span.appendChild(b);

		button.onmouseenter = function()
		{
			button.style.backgroundColor = "#666666";
		};
		button.onmouseleave = function()
		{
			button.style.backgroundColor = "#333333";
		};

		return button;
	}
}
