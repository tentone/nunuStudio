import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'minecraft-page',
    templateUrl: './minecraft.page.html',
    standalone: true,
    imports: [RouterLink]
})
export class MinecraftPage {}
