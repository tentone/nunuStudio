import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'basics-page',
    templateUrl: './basics.page.html',
    standalone: true,
    imports: [RouterLink]
})
export class BasicsPage {}
