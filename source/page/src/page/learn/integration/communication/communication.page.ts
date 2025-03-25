import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'communication-page',
    templateUrl: './communication.page.html',
    standalone: true,
    imports: [RouterLink]
})
export class CommunicationPage {}
