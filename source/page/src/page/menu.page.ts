import {Component} from '@angular/core';

@Component({
  selector: 'menu-page',
  templateUrl: './menu.page.html'
})
export class MenuPage {
	public options: any[] = [
		{
			label: 'Home',
			route: 'home',
			url: undefined
		},
		{
			label: 'Learn',
			route: 'learn',
			url: undefined
		},
		{
			label: 'Documentation',
			route: undefined,
			url: 'docs'
		},
		{
			label: 'Download',
			route: 'download',
			url: undefined
		},
		{
			label: 'Github',
			route: undefined,
			url: 'https://www.github.com/tentone/nunuStudio'
		},
	]
}
