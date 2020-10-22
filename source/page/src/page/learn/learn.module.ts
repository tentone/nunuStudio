import {NgModule} from '@angular/core';
import {BasicsPage} from "./basics/basics/basics.page";
import {TerrainPage} from "./basics/terrain/terrain.page";
import {ShadersPage} from "./basics/shaders/shaders.page";
import {PythonPage} from "./basics/python/python.page";
import {ArPage} from "./basics/ar/ar.page";
import {EmbeddingPage} from "./integration/embedding/embedding.page";
import {CommunicationPage} from "./integration/communication/communication.page";
import {PlatformerPage} from "./tutorial/platformer/platformer.page";

@NgModule({
	declarations: [
		// Basics
		BasicsPage,
		ShadersPage,
		TerrainPage,
		PythonPage,
		ArPage,

		// Integration
		CommunicationPage,
		EmbeddingPage,

		// Tutorial
		PlatformerPage,
	]
})
export class LearnModule {}
