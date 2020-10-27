import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Router} from './router';
import {AppPage} from './app.page';
import {HomePage} from "./page/home/home.page";
import {DownloadPage} from "./page/download/download.page";
import {MenuPage} from "./page/menu.page";
import {LearnPage} from "./page/learn/learn.page";
import {LearnModule} from "./page/learn/learn.module";
import {ExamplePage} from "./page/example/example.page";

@NgModule({
	declarations: [
		AppPage,
		MenuPage,
		HomePage,
		DownloadPage,
		ExamplePage,
		LearnPage
	],
	imports: [
		LearnModule,
		BrowserModule,
		Router
	],
	bootstrap: [AppPage]
})
export class Module {}
