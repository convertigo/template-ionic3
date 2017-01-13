import { NgModule }				          from '@angular/core';
import { IonicApp, IonicModule }          from 'ionic-angular';
import { DeepLinkConfig } 		          from 'ionic-angular';
import { MyApp } 				          from './app.component';
import {Page1}                            from "../pages/Page1/page1";
import {Page2}                            from "../pages/Page2/page2";
import {Login}                            from "../pages/Login/login";

import { C8oRouter } 			          from '../providers/convertigo.router';
import {C8o} from "../providers/c8o/c8o.service";



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
    IonicModule.forRoot(MyApp, {}, deepLinkConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    Login
  ],
  providers: [C8o, C8oRouter]
})

export class AppModule {}
