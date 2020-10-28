import {NgModule} from "@angular/core";
import {AppViewerComponent} from "./app-viewer/app-viewer.component";
import {CommonModule} from "@angular/common";

@NgModule({
	exports: [
		AppViewerComponent
	],
	imports: [
		CommonModule
	],
	declarations: [
		AppViewerComponent
	]
})
export class ComponentsModule {}
