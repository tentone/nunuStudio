import {
	AfterViewChecked,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';

@Component({
	selector: 'app-viewer',
	templateUrl: 'app-viewer.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppViewerComponent implements OnInit, OnDestroy, AfterViewChecked {
	@ViewChild('canvas', {static: true}) public canvas: ElementRef;

	@Input() public fname: string;

	@Input() public hideLink: boolean;

	public style: any = {
		width: "70%",
		minWidth: "400px",
		height: "360px"
	};

	// @ts-ignore
	public app: Nunu.App;

	public ngOnInit(): void {
		// @ts-ignore
		this.app = new Nunu.App(this.canvas.nativeElement);
		this.app.loadRunProgram(this.fname);
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
