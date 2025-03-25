import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppViewerComponent } from '../../../../components/app-viewer/app-viewer.component';

@Component({
    selector: 'postprocessing-page',
    templateUrl: './postprocessing.page.html',
    standalone: true,
    imports: [RouterLink, AppViewerComponent]
})
export class PostProcessingPage {}
