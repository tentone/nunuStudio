import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Router } from './router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Router
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
