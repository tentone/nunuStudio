import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'text-page',
    templateUrl: './text.page.html',
    standalone: true,
    imports: [RouterLink]
})
export class TextPage {}
