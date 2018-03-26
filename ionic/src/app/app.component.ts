import { Component, ViewChild}                              from '@angular/core';
import { Platform, Nav, App}                                from 'ionic-angular';
import { Page1}                                             from "../pages/Page1/page1";
import { Page2}                                             from "../pages/Page2/page2";
import {Login}                                              from "../pages/Login/login";
import {StatusBar}                                          from "@ionic-native/status-bar";

// Convertigo CAF Imports

import { C8oRouter } from 'c8ocaf';
import { C8oRoute, C8oRouteOptions, C8oRouteListener}       from 'c8ocaf'
import { C8oPage}                                           from "c8ocaf";
import { C8o, C8oSettings, C8oLogLevel }                    from "c8osdkangular";
/**
 * Disable comments to run in prod mode
 */

/*import {enableProdMode} from '@angular/core';
enableProdMode();*/

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage = Login;
    pages : Array<{title: string, component: any}>;

    constructor(platform: Platform, statusBar: StatusBar, private c8o: C8o, private router: C8oRouter, private app: App) {
        /**
         * declaring page to show in Menu
         */
        this.pages = [
            { title: 'Page1', component: Page1 },
            { title: 'Page2', component: Page2 }
        ];

        /* ============================================================================================================
           Convertigo Angular Framework (CAF) initialization...
           ============================================================================================================
         * Thanks to Convertigo CAF router we can manage call and navigation :
         *
         * Create a C8orouteOptions in order to define basic and repetitive routes options that will be used in C8oRoute
         * We can define actions such as beforeCall that allow us to run code before the C8o Call
         */

        let tableOptions = new C8oRouteOptions()
            .setBeforeCall(() => {
                //Do what ever has to be done...
            })
            .setAfterCall(()=>{
                //Do what ever has to be done...
            })
            .setDidEnter((page: C8oPage, c8o: C8o) => {
                c8o.log.trace("DidEnter was called from the new routing table and with page : " + page.constructor.name)
            })
            .setDidLeave((page: C8oPage, c8o: C8o) => {
                c8o.log.trace("DidLeave was called from the new routing table and with page : " + page.constructor.name)
            })
            .setTargetAnimate(true)
            .setTargetDuration(250);

        /**
         * Creating severals routes listener that will help us to manage navigation within our app
         *
         * First we assign to our router a new C8oRouteListener.
         *      This route listener is identified by a requestable that we define in the C8oRouteListener constructor.
         * Then we can assign severals C8oRoute to a C8oRouteListener thanks to the addRoute method
         *      Each C8oRoute contains conditions and options that defined action to do in case of match
         *
         */
        this.router.addRouteListener(
            new C8oRouteListener([".Login"])                                        // When a response comes from ".Login" requestable,

                .addRoute(
                    new C8oRoute(
                        (data:any)=>{                                               // and that login == "ok",
                            return data.login == "ok" ? true : false
                        },
                        tableOptions                                                // Use optional routing tables options defined higher,
                    )
                    .setTarget("setRoot", Page1)                                       // and route( set as root on stack to display page) to Page1.
                )
                .addRoute(
                    new C8oRoute(
                        (data:any)=>{
                            return data.login == "ko"                               // If instead login == "ko",
                        }
                    )
                        .setTarget("toast")                                             // Display a Toast with the following options.
                        .setToastMesage("Your login or password is incorrect")
                        .setToastDuration(5000)
                        .setToastPosition("bottom")
                )
                .addFailedRoute(                                                    // When a requestable fails,
                    new C8oRoute(
                        (exception:any)=>{
                            return true                                             // In any case,
                        }
                    )
                        .setTarget("toast")                                             // Display a Toast with the following options.
                        .setToastMesage("No network connection")
                        .setToastDuration(5000)
                        .setToastPosition("bottom")
                )
        )

        //Add any other routes listener here
        /*.addRouteListener(
            new C8oRouteListener(".MyOtherSequence")
                .addRoute(
                    new C8oRoute(
                        (data: any) => {
                            return (data.rows.length > 0) ? true : false
                        }
                    )
                    .setTarget("push", Page2)
            )
        )*/

        /**
         *  Define a C8oSettings Object in order to declare settings to be used in the C8oInit method
         */
        let settings: C8oSettings = new C8oSettings();
        settings
            .setDefaultDatabaseName("myDataBaseName")
            .setEndPoint("http://localhost:18080/convertigo/projects/template_Ionic2")
            .setLogRemote(true)
            .setLogC8o(true)
            .setLogLevelLocal(C8oLogLevel.DEBUG);
        /**
         * Then we assign C8oSettings to our c8o Object with the init method
         */
        this.c8o.init(settings);
        
        /* ============================================================================================================
             End of Convertigo Angular Framework (CAF) initialization...
           ============================================================================================================*/

        platform.ready().then(() => {
            statusBar.styleDefault();
            /**
             * Then we finalize initialization
             */
            this.c8o.finalizeInit().then(()=>{
                // Do stuff
            });
        });

    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        switch(page.title){
            case "Page1" :
                this.app.getActiveNav().setRoot(Page1)
                break;
            case "Page2":
                this.app.getActiveNav().setRoot(Page2)
            break;

        }

    }


}