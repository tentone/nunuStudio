import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePage} from "./page/home/home.page";
import {DownloadPage} from "./page/download/download.page";
import {MenuPage} from "./page/menu.page";
import {LearnPage} from "./page/learn/learn.page";
import {LearnRoutes} from "./page/learn/learn.routes";
import {ExamplePage} from "./page/example/example.page";

const routes: Routes = [
	{
		path: 'example',
		component: ExamplePage,

	},
	{
		path: '',
		component: MenuPage,
		children: [
			{
				path: '',
				component: HomePage
			},
			{
				path: 'download',
				component: DownloadPage
			},
			{
				path: 'learn',
				component: LearnPage,
			}
		// @ts-ignore
		].concat(LearnRoutes)
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class Router { }
