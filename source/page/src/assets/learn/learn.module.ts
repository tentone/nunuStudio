import {NgModule} from '@angular/core';
import {BasicsPage} from "./basics/basics/basics.page";
import {TerrainPage} from "./basics/terrain/terrain.page";
import {ShadersPage} from "./basics/shaders/shaders.page";
import {PythonPage} from "./basics/python/python.page";
import {ArPage} from "./basics/ar/ar.page";
import {EmbeddingPage} from "./integration/embedding/embedding.page";
import {CommunicationPage} from "./integration/communication/communication.page";
import {PlatformerPage} from "./tutorial/platformer/platformer.page";
import {ScriptPage} from "./basics/script/script.page";
import {VideoPage} from "./basics/video/video.page";
import {JoystickPage} from "./basics/joystick/joystick.page";
import {TimelinePage} from "./basics/timeline/timeline.page";
import {WaterPage} from "./basics/water/water.page";
import {MinecraftPage} from "./tutorial/minecraft/minecraft.page";
import {NetworkingPage} from "./tutorial/networking/networking.page";
import {AnimationPage} from "./basics/animation/animation.page";
import {AudioPage} from "./basics/audio/audio.page";
import {CameraPage} from "./basics/camera/camera.page";
import {GyroscopePage} from "./basics/gyroscope/gyroscope.page";
import {MaterialsPage} from "./basics/materials/materials.page";
import {ParticlesPage} from "./basics/particles/particles.page";
import {PhysicsPage} from "./basics/physics/physics.page";
import {PostProcessingPage} from "./basics/post-processing/post-processing.page";
import {RaycasterPage} from "./basics/raycaster/raycaster.page";
import {TextPage} from "./basics/text/text.page";
import {VrPage} from "./basics/vr/vr.page";
import {RouterModule} from "@angular/router";

@NgModule({
	imports: [
		RouterModule,
	],
	declarations: [
		// Basics
		BasicsPage,
		ShadersPage,
		TerrainPage,
		PythonPage,
		ArPage,
		ScriptPage,
		VideoPage,
		JoystickPage,
		TimelinePage,
		WaterPage,
		VideoPage,
		AnimationPage,
		AudioPage,
		CameraPage,
		GyroscopePage,
		MaterialsPage,
		ParticlesPage,
		PhysicsPage,
		PostProcessingPage,
		RaycasterPage,
		TerrainPage,
		TextPage,
		VrPage,

		// Integration
		CommunicationPage,
		EmbeddingPage,

		// Tutorial
		PlatformerPage,
		MinecraftPage,
		NetworkingPage
	]
})
export class LearnModule {}
