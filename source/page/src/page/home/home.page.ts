import {Component} from '@angular/core';

class HomePageExampleOption {
	public title: string;
	public description: string;
	public file: string;
	public image: string;
}

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html'
})
export class HomePage {
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
}
