import {Routes} from "@angular/router";
import {BasicsPage} from "./basics/basics/basics.page";
import {ArPage} from "./basics/ar/ar.page";
import {ShadersPage} from "./basics/shaders/shaders.page";
import {TerrainPage} from "./basics/terrain/terrain.page";
import {PythonPage} from "./basics/python/python.page";
import {CommunicationPage} from "./integration/communication/communication.page";
import {EmbeddingPage} from "./integration/embedding/embedding.page";
import {PlatformerPage} from "./tutorial/platformer/platformer.page";
import {MinecraftPage} from "./tutorial/minecraft/minecraft.page";
import {NetworkingPage} from "./tutorial/networking/networking.page";
import {AnimationPage} from "./basics/animation/animation.page";
import {AudioPage} from "./basics/audio/audio.page";
import {CameraPage} from "./basics/camera/camera.page";
import {GyroscopePage} from "./basics/gyroscope/gyroscope.page";
import {JoystickPage} from "./basics/joystick/joystick.page";
import {MaterialsPage} from "./basics/materials/materials.page";
import {ParticlesPage} from "./basics/particles/particles.page";
import {PhysicsPage} from "./basics/physics/physics.page";
import {PostProcessingPage} from "./basics/post-processing/post-processing.page";
import {RaycasterPage} from "./basics/raycaster/raycaster.page";
import {ScriptPage} from "./basics/script/script.page";
import {TextPage} from "./basics/text/text.page";
import {TimelinePage} from "./basics/timeline/timeline.page";
import {VideoPage} from "./basics/video/video.page";
import {VrPage} from "./basics/vr/vr.page";
import {WaterPage} from "./basics/water/water.page";

export const LearnRoutes: Routes = [
	{
		path: 'learn/basics/animation',
		component: AnimationPage
	},
	{
		path: 'learn/basics/ar',
		component: ArPage
	},
	{
		path: 'learn/basics/audio',
		component: AudioPage
	},
	{
		path: 'learn/basics/basics',
		component: BasicsPage
	},
	{
		path: 'learn/basics/camera',
		component: CameraPage
	},
	{
		path: 'learn/basics/gyroscope',
		component: GyroscopePage
	},
	{
		path: 'learn/basics/joystick',
		component: JoystickPage
	},
	{
		path: 'learn/basics/materials',
		component: MaterialsPage
	},
	{
		path: 'learn/basics/particles',
		component: ParticlesPage
	},
	{
		path: 'learn/basics/physics',
		component: PhysicsPage
	},
	{
		path: 'learn/basics/python',
		component: PythonPage
	},
	{
		path: 'learn/basics/post-processing',
		component: PostProcessingPage
	},
	{
		path: 'learn/basics/raycaster',
		component: RaycasterPage
	},
	{
		path: 'learn/basics/script',
		component: ScriptPage
	},
	{
		path: 'learn/basics/shaders',
		component: ShadersPage
	},
	{
		path: 'learn/basics/terrain',
		component: TerrainPage
	},
	{
		path: 'learn/basics/text',
		component: TextPage
	},
	{
		path: 'learn/basics/timeline',
		component: TimelinePage
	},
	{
		path: 'learn/basics/video',
		component: VideoPage
	},
	{
		path: 'learn/basics/vr',
		component: VrPage
	},
	{
		path: 'learn/basics/water',
		component: WaterPage
	},
	// Integration
	{
		path: 'learn/integration/communication',
		component: CommunicationPage,
	},
	{
		path: 'learn/integration/embedding',
		component: EmbeddingPage
	},
	// Tutorial
	{
		path: 'learn/tutorial/platformer',
		component: PlatformerPage
	},
	{
		path: 'learn/tutorial/networking',
		component: NetworkingPage
	},
	{
		path: 'learn/tutorial/minecraft',
		component: MinecraftPage
	},
];
