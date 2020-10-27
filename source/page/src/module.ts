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
import {HighlightModule, HIGHLIGHT_OPTIONS} from 'ngx-highlightjs';

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
		// External
		HighlightModule,
		// Internal
		LearnModule,
		BrowserModule,
		Router
	],
	providers: [
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {
				coreLibraryLoader: () => import('highlight.js/lib/core'),
				lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
				languages: {javascript: () => import('highlight.js/lib/languages/javascript')}
			}
		}
	],
	bootstrap: [AppPage]
})
export class Module {}
