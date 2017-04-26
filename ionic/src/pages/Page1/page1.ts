import { Component }                                            from '@angular/core';
import {NavParams }                                             from 'ionic-angular';
import {LoadingController}                                      from 'ionic-angular';
import { C8oRouter }                                            from 'c8ocaf';
import { C8oPage }                                              from 'c8ocaf';
import { DomSanitizer }                                         from '@angular/platform-browser';
import {ChangeDetectorRef, ChangeDetectionStrategy}             from "@angular/core";


@Component({
  selector: 'page-category',
  templateUrl: 'page1.html'
})
export class Page1 extends C8oPage  {
    constructor(routerProvider : C8oRouter, navParams: NavParams, loadingCtrl: LoadingController, sanitizer: DomSanitizer, ref: ChangeDetectorRef){
        super(routerProvider, navParams, loadingCtrl, sanitizer, ref);
    }
}
