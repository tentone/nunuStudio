import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { Router } from './router';
import { AppPage } from './app.page';
import { importProvidersFrom } from '@angular/core';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('python', python);
hljs.initHighlightingOnLoad();

bootstrapApplication(AppPage, {
    providers: [importProvidersFrom(BrowserModule, Router)]
});

