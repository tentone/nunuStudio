import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppViewerComponent } from '../../../../components/app-viewer/app-viewer.component';

@Component({
    selector: 'audio-page',
    templateUrl: './audio.page.html',
    standalone: true,
    imports: [RouterLink, AppViewerComponent]
})
export class AudioPage {}
