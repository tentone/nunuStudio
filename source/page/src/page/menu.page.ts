import {Component} from '@angular/core';

@Component({
  selector: 'menu-page',
  templateUrl: './menu.page.html'
})
export class MenuPage {
	public options: any[] = [
		{
			label: 'Home',
			url: 'home'
		},
		{
			label: 'Learn',
			url: 'learn'
		},
		{
			label: 'Documentation',
			url: 'docs'
		},
		{
			label: 'Download',
			url: 'download'
		},
		{
			label: 'Github',
			url: 'https://www.github.com/tentone/nunuStudio'
		},
	]
}
