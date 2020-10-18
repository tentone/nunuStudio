import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Module} from './module';

platformBrowserDynamic().bootstrapModule(Module).catch(err => console.error(err));
