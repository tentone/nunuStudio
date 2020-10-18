import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Router} from './router';
import {AppPage} from './app.page';
import {HomePage} from "./page/home/home.page";
import {DownloadPage} from "./page/download/download.page";
import {MenuPage} from "./page/menu.page";

@NgModule({
	declarations: [
		AppPage,
		MenuPage,
		HomePage,
		DownloadPage
	],
	imports: [
		BrowserModule,
		Router
	],
	providers: [],
	bootstrap: [AppPage]
})
export class Module {}
