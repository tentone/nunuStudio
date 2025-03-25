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
import {Global} from "../../global";


@Component({
    selector: 'app-viewer',
    templateUrl: 'app-viewer.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: []
})
export class AppViewerComponent implements OnInit, OnDestroy, AfterViewChecked {
	public get global(): any { return Global; }

	@ViewChild('loadingSection', {static: true}) public loadingSection: ElementRef;

	@ViewChild('loading', {static: true}) public loading: ElementRef;

	@ViewChild('canvasSection', {static: true}) public canvasSection: ElementRef;

	@ViewChild('canvas', {static: true}) public canvas: ElementRef;


	@Input() public fname: string;

	@Input() public hideLink: boolean;


	// @ts-ignore
	public app: Nunu.App;

	public ngOnInit(): void {
		// @ts-ignore
		this.app = new Nunu.App(this.canvas.nativeElement);
		this.app.loadRunProgram(this.fname, () => {
			if (this.canvasSection.nativeElement !== null) {
				this.canvasSection.nativeElement.style.display = "block";
			}

			if (this.loadingSection.nativeElement !== null) {
				this.loadingSection.nativeElement.style.display = "none";
			}
		}, (percentage) => {
			if (this.loading.nativeElement !== null) {
				this.loading.nativeElement.style.width = percentage + "%";
			}
		});
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
