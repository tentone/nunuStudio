import {Component, ElementRef, ViewChild} from '@angular/core';
import {Global} from "../../global";
import {Router} from "../../router";


class HomePageExampleOption {
	public title: string;
	public description: string;
	public file: string;
	public image: string;
}

class HomePageFeatureOption {
	public title: string;
	public description: string;
	public image: string;
}


class HomePageProject {
	public image: string;
	public url: string;
}


@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    standalone: true,
    imports: []
})
export class HomePage {
	public get global(): any { return Global; }

	@ViewChild('canvas', {static: true}) public canvas: ElementRef;

	@ViewChild('bar', {static: true}) public bar: ElementRef;

	// @ts-ignore
	public app: Nunu.App;

	constructor(public router: Router) {
	}

	public ngOnInit(): void {
		// @ts-ignore
		this.app = new Nunu.App(this.canvas.nativeElement);
		this.app.loadRunProgram("examples/nunu.nsp", () => {
			this.bar.nativeElement.parentElement.style.display = "none";
		}, (progress) => {
			this.bar.nativeElement.style.width = progress + "%";
		});

	}

	public ngAfterViewChecked(): void {
		this.app.resize();
	}

	public ngOnDestroy(): void {
		this.app.exit();
	}

	public projects: HomePageProject[] = [
		{
			image: 'assets/logo/threejs.png',
			url: 'https://threejs.org/'
		},
		{
			image: 'assets/logo/codemirror.png',
			url: 'https://codemirror.net/'
		},
		{
			image: 'assets/logo/nwjs.png',
			url: 'https://nwjs.io/'
		},
		{
			image: 'assets/logo/js.jpg',
			url: 'https://www.ecma-international.org/ecma-262/'
		},
		{
			image: 'assets/logo/webgl.png',
			url: 'https://get.webgl.org/'
		},
	];

	public examples: HomePageExampleOption[] = [
		{
			title: 'nunuStudio',
			description: 'nunuStudio physically based rendering home screen demo.',
			file: 'nunu.nsp',
			image: 'nunu.jpg'
		},
		{
			title: 'Pong',
			description: '3D recreation of the classic pong game.',
			file: 'pong.nsp',
			image: 'pong.jpg'
		},
		{
			title: 'Flappy Birds Clone',
			description: 'Clone of the mobile game flappy birds.',
			file: 'flappy.nsp',
			image: 'flappy.jpg'
		},
		{
			title: 'Rollercoaster',
			description: 'A virtual reality rollercoaster ride.',
			file: 'rollercoaster.nsp',
			image: 'rollercoaster.jpg'
		},
		{
			title: 'Spine',
			description: 'Spineboy spine animation example',
			file: 'spine.nsp',
			image: 'spine.jpg'
		},
		{
			title: 'Portal',
			description: 'Portal clone example',
			file: 'portal.nsp',
			image: 'portal.jpg'
		},
		{
			title: 'PBR',
			description: 'Physically based rendering demo using GLTF damaged helmet model.',
			file: 'pbr.nsp',
			image: 'pbr.jpg'
		},
		{
			title: 'Webcam',
			description: 'Camera capture example using WebRTC.',
			file: 'camera.nsp',
			image: 'camera.jpg'
		},
		{
			title: 'Starwars',
			description: 'Star wars tribute with dancing stormtrooper!',
			file: 'starwars.nsp',
			image: 'starwars.jpg'
		},
		{
			title: 'Paint',
			description: '3D planet paint example, mouse to paint the planet.',
			file: 'paint.nsp',
			image: 'paint.jpg'
		},
		{
			title: 'Little Voxel Island',
			description: 'Little voxel island model made by Rick Hoppmann w/ positional audio.',
			file: 'littlevoxelisland.nsp',
			image: 'littlevoxelisland.jpg'
		},
		{
			title: 'Boids',
			description: 'Boids simulation with instanced meshes and post-processing.',
			file: 'boids.nsp',
			image: 'boids.jpg'
		},
		{
			title: 'WebXR',
			description: 'WebXR powered Virtual Reality and Augmented Reality in a single application.',
			file: 'ar.nsp',
			image: 'ar.jpg'
		}
	];

	public features: HomePageFeatureOption[] = [
		{
			title: 'Graphical Editor',
			description: 'Familiar user interface similar to the ones you already know.',
			image: 'assets/screenshot/6.jpg'
		},
		{
			title: '3D Graphics',
			description: 'Graphics powered by three.js with dynamic ligths, shadows, post-processing, etc.',
			image: 'assets/screenshot/8.jpg'
		},
		{
			title: 'Physics',
			description: 'Fully features 3D physics engine powered by cannon.js',
			image: 'assets/screenshot/gif/1.gif'
		},
		{
			title: 'JS Scripts',
			description: 'Easy to learn language, familiar for web and game developers.',
			image: 'assets/screenshot/5.jpg'
		},
		{
			title: '2D Mode',
			description: 'Want 2D? No problem! Switch between 2D and 3D with the click of a button.',
			image: 'assets/screenshot/7.jpg'
		},
		{
			title: 'WebVR',
			description: 'Ready for web virtual reality, on mobile and desktop platforms.',
			image: 'assets/vr.jpg'
		},
		{
			title: 'Advanced materials',
			description: 'Graphical material editor similar to the ones found in 3D design tools.',
			image: 'assets/screenshot/1.jpg'
		},
		{
			title: 'Particles',
			description: 'GPU accelerated particle system powered by SPE.',
			image: 'assets/screenshot/2.jpg'
		},
		{
			title: 'Drag and drop',
			description: 'Drag and drop files into the editor, it just works.',
			image: 'assets/screenshot/gif/2.gif'
		},
		{
			title: 'Spine animations',
			description: 'Create 2D animations using Esoteric spine animation tool and import them to nunuStudio.',
			image: 'assets/screenshot/9.jpg'
		},
		{
			title: 'WebAudio',
			description: 'Audio engine built on top of web audio API with support for positional audio.',
			image: 'assets/screenshot/10.jpg'
		},
		{
			title: 'Multi-platform editor',
			description: 'nunuStudio was build on top of nwjs it works on windows, linux and OS X.',
			image: 'assets/screenshot/3.jpg'
		}
	];
}
