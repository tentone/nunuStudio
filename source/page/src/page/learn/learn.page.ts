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
					title: '01 Editor Basics',
					description: 'This tutorials introduces the editor UI and some basic features.',
					url: 'learn/basics/01_basics/page.html',
					image: 'learn/basics/01_basics/thumb.png'
				},
				{
					title: '02 First script',
					description: 'This tutorial explains the basics about scripting inside nunuStudio.',
					url: 'learn/basics/02_script/page.html',
					image: 'learn/basics/02_script/thumb.png'
				},
				{
					title: '03 Cameras',
					description: 'This tutorial introduces the different camera types available and how to use them',
					url: 'learn/basics/03_camera/page.html',
					image: 'learn/basics/03_camera/thumb.png'
				},
				{
					title: '04 Materials',
					description: 'This tutorials explains what a material is and what types of materials are available.',
					url: 'learn/basics/04_materials/page.html',
					image: 'learn/basics/04_materials/thumb.png'
				},
				{
					title: '05 Particles',
					description: 'This tutorials introduces particles and the particle editor.',
					url: 'learn/basics/05_particles/page.html',
					image: 'learn/basics/05_particles/thumb.png'
				},
				{
					title: '06 Audio',
					description: 'Audio inside nunuStudio. Effects, positional audio and basic scripting.',
					url: 'learn/basics/06_audio/page.html',
					image: 'learn/basics/06_audio/thumb.png'
				},
				{
					title: '07 Text',
					description: 'Text basics inside nunu, create text objects, import external fonts, control text.',
					url: 'learn/basics/07_text/page.html',
					image: 'learn/basics/07_text/thumb.png'
				},
				{
					title: '08 Physics',
					description: 'How to add, use and control physics objects inside nunuStudio.',
					url: 'learn/basics/08_physics/page.html',
					image: 'learn/basics/08_physics/thumb.png'
				},
				{
					title: '09 Gyroscope',
					description: 'Use gyroscope to control objects and create panoramic visualizations.',
					url: 'learn/basics/09_gyro/page.html',
					image: 'learn/basics/09_gyro/thumb.png'
				},
				{
					title: '10 Virtual Reality',
					description: 'Create a virtual reality project using nunuStudio.',
					url: 'learn/basics/10_vr/page.html',
					image: 'learn/basics/10_vr/thumb.png'
				},
				{
					title: '11 Raycasting',
					description: 'Use a raycaster to interact with 3D objects using the mouse.',
					url: 'learn/basics/11_raycaster/page.html',
					image: 'learn/basics/11_raycaster/thumb.png'
				},
				{
					title: '12 Animation',
					description: 'Guide to create and import 2D and 3D animations into the editor.',
					url: 'learn/basics/12_animation/page.html',
					image: 'learn/basics/12_animation/thumb.png'
				},
				{
					title: '13 Water',
					description: 'Create a 3D water effect using materials and textures.',
					url: 'learn/basics/13_water/page.html',
					image: 'learn/basics/13_water/thumb.png'
				},
				{
					title: '14 Joystick',
					description: 'Use an external library to integrate a onscreen joystick.',
					url: 'learn/basics/14_joystick/page.html',
					image: 'learn/basics/14_joystick/thumb.png'
				},
				{
					title: '15 Timeline',
					description: 'Timeline editor to create animations.',
					url: 'learn/basics/15_timeline/page.html',
					image: 'learn/basics/15_timeline/thumb.png'
				},
				{
					title: '16 Post-processing',
					description: 'Post-procesing camera effects pipeline.',
					url: 'learn/basics/16_postprocessing/page.html',
					image: 'learn/basics/16_postprocessing/thumb.png'
				},
				{
					title: '17 Video',
					description: 'How to import and use video files in nunuStudio.',
					url: 'learn/basics/17_video/page.html',
					image: 'learn/basics/17_video/thumb.png'
				},
				{
					title: '18 Shaders',
					description: 'Build new materials using GLSL shader code.',
					url: 'learn/basics/18_shaders/page.html',
					image: 'learn/basics/18_shaders/thumb.jpg'
				},
				{
					title: '19 Terrain',
					description: 'Learn how to use existing three.js based libraries.',
					url: 'learn/basics/19_terrain/page.html',
					image: 'learn/basics/19_terrain/thumb.jpg'
				}
			]
		},
		{
			title: 'Tutorials',
			description: 'These tutorials will help you to build your first fully functional games and experiences inside nunuStudio with step by step guides. Before starting these i recommend you to first experiment with some of the beginner guides.',
			options: [
				{
					title: '01 Platformer Game',
					description: 'This tutorial will teach you how to create a mario style platformer game.',
					url: 'learn/tutorial/01_platformer/page.html',
					image: 'learn/tutorial/01_platformer/thumb.png'
				},
				{
					title: '02 Multiplayer Shooter',
					description: 'In this tutorial we will explore how to create a networked mutiplayer game using websockets and nodejs.',
					url: 'learn/tutorial/02_networking/page.html',
					image: 'learn/tutorial/02_networking/thumb.png'
				}
			]
		},
		{
			title: 'Integration',
			description: 'These guides will help you to integrate nunuStudio applications inside you webpage, how to tranfer data between the webpage and the application, etc. For these guides more advanced javascript knowledge is required.',
			options: [
				{
					title: '01 Embedding',
					description: 'This guide will help you to embedd nunuStudio applications inside your webpage.',
					url: 'learn/integration/01_embedding/page.html',
					image: 'learn/integration/01_embedding/thumb.png'
				},
				{
					title: '02 Communication',
					description: 'Learn how to tranfer data between your running applications and you webpage.',
					url: 'learn/integration/02_communication/page.html',
					image: 'learn/integration/02_communication/thumb.png'
				}
			]
		}
	];

}
