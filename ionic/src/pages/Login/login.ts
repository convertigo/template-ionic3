import { Component }                                            from '@angular/core';
import {NavParams, LoadingController}                           from 'ionic-angular';
import { C8oRouter }                                            from 'c8ocaf'
import { C8oPage }                                              from 'c8ocaf'
import { DomSanitizer }                                         from '@angular/platform-browser';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login extends C8oPage  {
    constructor(routerProvider : C8oRouter, navParams: NavParams, loadingCtrl: LoadingController, sanitizer: DomSanitizer){
    super(routerProvider, navParams, loadingCtrl, sanitizer)
    }
}
