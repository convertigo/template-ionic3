import { Component }                                            from '@angular/core';
import {NavParams, LoadingController, MenuController}                           from 'ionic-angular';
import { C8oRouter }                                            from 'c8ocaf'
import { C8oPage }                                              from 'c8ocaf'
import { DomSanitizer }                                         from '@angular/platform-browser';
import {ChangeDetectorRef, ChangeDetectionStrategy, Injector}             from "@angular/core";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class Login extends C8oPage  {
    public static nameStatic: string = "Login";
    constructor(routerProvider : C8oRouter, navParams: NavParams, loadingCtrl: LoadingController, sanitizer: DomSanitizer, ref: ChangeDetectorRef, injector: Injector, menuCtrl: MenuController){
        super(routerProvider, navParams, loadingCtrl, sanitizer, ref, injector, menuCtrl);
    }
}
