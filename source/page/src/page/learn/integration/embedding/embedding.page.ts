import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'embedding-page',
    templateUrl: './embedding.page.html',
    standalone: true,
    imports: [RouterLink]
})
export class EmbeddingPage {}
