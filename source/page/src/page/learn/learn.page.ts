import {Component} from '@angular/core';

class LearnPageOption {
	public title: string;
	public description: string;
	public url: string;
	public image: string;
}

class LearnPageSection {
	public title: string;
	public description: string;
	public options: LearnPageOption[];
}

@Component({
  selector: 'learn-page',
  templateUrl: './learn.page.html'
})
export class LearnPage {
	public sections: LearnPageSection[] = [
		{
			title: 'Getting started',
			description: 'These tutorials introduce the basic contents of the platform, do not require any previous programming knowledge and explore the most basic features of the editor.',
			options: [
				{
					title: 'Editor Basics',
					description: 'This tutorials introduces the editor UI and some basic features.',
					url: '/learn/basics/basics',
					image: './basics/basics/thumb.png'
				},
				{
					title: 'First script',
					description: 'This tutorial explains the basics about scripting inside nunuStudio.',
					url: '/learn/basics/script',
					image: 'learn///thumb.png'
				},
				{
					title: 'Cameras',
					description: 'This tutorial introduces the different camera types available and how to use them',
					url: '/learn/basics/camera',
					image: './basics/camera/thumb.png'
				},
				{
					title: 'Materials',
					description: 'This tutorials explains what a material is and what types of materials are available.',
					url: '/learn/basics/materials',
					image: './basics/materials/thumb.png'
				},
				{
					title: 'Particles',
					description: 'This tutorials introduces particles and the particle editor.',
					url: '/learn/basics/particles',
					image: './basics/particles/thumb.png'
				},
				{
					title: 'Audio',
					description: 'Audio inside nunuStudio. Effects, positional audio and basic scripting.',
					url: '/learn/basics/audio',
					image: './basics/audio/thumb.png'
				},
				{
					title: 'Text',
					description: 'Text basics inside nunu, create text objects, import external fonts, control text.',
					url: '/learn/basics/text',
					image: './basics/text/thumb.png'
				},
				{
					title: 'Physics',
					description: 'How to add, use and control physics objects inside nunuStudio.',
					url: '/learn/basics/physics',
					image: './basics/physics/thumb.png'
				},
				{
					title: 'Gyroscope',
					description: 'Use gyroscope to control objects and create panoramic visualizations.',
					url: '/learn/basics/gyro',
					image: './basics/gyro/thumb.png'
				},
				{
					title: 'Virtual Reality',
					description: 'Create a virtual reality project using nunuStudio.',
					url: '/learn/basics/vr',
					image: './basics/vr/thumb.png'
				},
				{
					title: 'Raycasting',
					description: 'Use a raycaster to interact with 3D objects using the mouse.',
					url: '/learn/basics/raycaster',
					image: './basics/raycaster/thumb.png'
				},
				{
					title: 'Animation',
					description: 'Guide to create and import 2D and 3D animations into the editor.',
					url: '/learn/basics/animation',
					image: './basics/animation/thumb.png'
				},
				{
					title: 'Water',
					description: 'Create a 3D water effect using materials and textures.',
					url: '/learn/basics/water',
					image: './basics/water/thumb.png'
				},
				{
					title: 'Joystick',
					description: 'Use an external library to integrate a onscreen joystick.',
					url: '/learn/basics/joystick',
					image: './basics/joystick/thumb.png'
				},
				{
					title: 'Timeline',
					description: 'Timeline editor to create animations.',
					url: '/learn/basics/timeline',
					image: './basics/timeline/thumb.png'
				},
				{
					title: 'Post-processing',
					description: 'Post-procesing camera effects pipeline.',
					url: '/learn/basics/postprocessing',
					image: './basics/postprocessing/thumb.png'
				},
				{
					title: 'Video',
					description: 'How to import and use video files in nunuStudio.',
					url: '/learn/basics/video',
					image: './basics/video/thumb.png'
				},
				{
					title: 'Shaders',
					description: 'Build new materials using GLSL shader code.',
					url: '/learn/basics/shaders',
					image: 'learn/basics/18_shaders/thumb.jpg'
				},
				{
					title: 'Terrain',
					description: 'Learn how to use existing three.js based libraries.',
					url: '/learn/basics/terrain',
					image: 'learn/basics/19_terrain/thumb.jpg'
				}
			]
		},
		{
			title: 'Tutorials',
			description: 'These tutorials will help you to build your first fully functional games and experiences inside nunuStudio with step by step guides. Before starting these i recommend you to first experiment with some of the beginner guides.',
			options: [
				{
					title: 'Platformer Game',
					description: 'This tutorial will teach you how to create a mario style platformer game.',
					url: '/learn/tutorial/platformer',
					image: './tutorial/platformer/thumb.png'
				},
				{
					title: 'Multiplayer Shooter',
					description: 'In this tutorial we will explore how to create a networked mutiplayer game using websockets and nodejs.',
					url: '/learn/tutorial/networking',
					image: './tutorial/networking/thumb.png'
				}
			]
		},
		{
			title: 'Integration',
			description: 'These guides will help you to integrate nunuStudio applications inside you webpage, how to tranfer data between the webpage and the application, etc. For these guides more advanced javascript knowledge is required.',
			options: [
				{
					title: 'Embedding',
					description: 'This guide will help you to embedd nunuStudio applications inside your webpage.',
					url: '/learn/integration/embedding',
					image: './integration/embedding/thumb.png'
				},
				{
					title: 'Communication',
					description: 'Learn how to tranfer data between your running applications and you webpage.',
					url: '/learn/integration/communication',
					image: './integration/communication/thumb.png'
				}
			]
		}
	];

}
