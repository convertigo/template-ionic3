import { NgModule, ErrorHandler }		                                      from '@angular/core';
import { BrowserModule }                                                      from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig }           from 'ionic-angular';
import { StatusBar }                                                          from '@ionic-native/status-bar';
import { MyApp } 				                                              from './app.component';
import {Page1}                                                                from "../pages/Page1/page1";
import {Page2}                                                                from "../pages/Page2/page2";
import {Login}                                                                from "../pages/Login/login";

import { C8oRouter } 			                                              from 'c8ocaf';
import {C8o}                                                                  from "c8osdkangular";
import {HttpClientModule}                                                     from "@angular/common/http";



/**
 * configure here the deep links to your pages so that the app can rout directly to the page url
 */
export const deepLinkConfig: DeepLinkConfig = {
	  links: [
        { component: Page1, name: 'Page1', segment: 'Page1' },
        { component: Page2, name: 'Page2', segment: 'Page2' },
        { component: Login, name: 'Login', segment: 'Login' }
	  ]
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    Login
  ],
  imports: [
      BrowserModule,
      HttpClientModule,
    IonicModule.forRoot(MyApp, {}, deepLinkConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [

    MyApp,
    Page1,
    Page2,
    Login
  ],
  providers: [
    StatusBar,
    C8o,
    C8oRouter,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
