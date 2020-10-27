import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Module} from './module';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);
hljs.initHighlightingOnLoad();

platformBrowserDynamic().bootstrapModule(Module);

