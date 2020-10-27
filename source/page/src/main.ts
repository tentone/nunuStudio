import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Module} from './module';
import "jquery/dist/jquery.js";
import "bootstrap/dist/bootstrap.js";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('python', python);
hljs.initHighlightingOnLoad();

platformBrowserDynamic().bootstrapModule(Module);

