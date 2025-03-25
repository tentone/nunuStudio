import {Component} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'menu-page',
    templateUrl: './menu.page.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, RouterOutlet]
})
export class MenuPage {
	public options: any[] = [
		{
			label: 'Home',
			route: '/',
			url: undefined
		},
		{
			label: 'Learn',
			route: '/learn',
			url: undefined
		},
		{
			label: 'Documentation',
			route: undefined,
			url: 'docs'
		},
		{
			label: 'Download',
			route: '/download',
			url: undefined
		},
		{
			label: 'Github',
			route: undefined,
			url: 'https://www.github.com/tentone/nunuStudio'
		},
	]
}
