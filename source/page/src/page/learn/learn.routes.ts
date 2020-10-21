import {Routes} from "@angular/router";
import {BasicsPage} from "./basics/basics/basics.page";
import {ArPage} from "./basics/ar/ar.page";
import {ShadersPage} from "./basics/shaders/shaders.page";
import {TerrainPage} from "./basics/terrain/terrain.page";
import {PythonPage} from "./basics/python/python.page";
import {CommunicationPage} from "./integration/communication/communication.page";
import {EmbeddingPage} from "./integration/embedding/embedding.page";
import {PlatformerPage} from "./tutorial/platformer/platformer.page";

export const LearnRoutes: Routes = [
	{
		path: 'learn/basics/basics',
		component: BasicsPage
	},
	{
		path: 'learn/basics/ar',
		component: ArPage
	},
	{
		path: 'learn/basics/shaders',
		component: ShadersPage
	},
	{
		path: 'learn/basics/python',
		component: PythonPage
	},
	{
		path: 'learn/basics/terrain',
		component: TerrainPage
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
];
