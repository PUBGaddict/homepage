import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatchnoteData } from '../../providers/patchnote-data';
import { SubmitPage } from '../submit/submit';
import { Http } from '@angular/http';
import { firebaseConfig } from '../../app/app.module';

import * as firebase from 'firebase/app';

/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  public patchNotes = [];
  public patchNotesRepo = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public patchnoteData : PatchnoteData, private http: Http) {
    this.patchnoteData.getInitialPatchNotes().then((initialPatchNotes) => {
      this.patchNotes = initialPatchNotes;
    })
  }

/* 
  signInWithFacebook(): void {
    this.authServiceProvider.signInWithFacebook()
      .then(() => this.onSignInSuccess());
  }

  private onSignInSuccess(): void {
    console.log("Facebook display name ",this.authServiceProvider.displayName());
  } */

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this.patchnoteData.getNextPatchNotes()
    .then(patchNote => {
      this.patchNotes.push(patchNote);
      infiniteScroll.complete();
      console.log('Async operation has ended');
    }).catch(reason => {
      infiniteScroll.complete();
      console.log("No more patchnotes found");
    })
  }

  i = 31;
  addThing () {
    let key = firebase.database().ref("/menu").push().key,
      amount = 1,
      o = {},
      tag = "test" + this.i++;
      o[tag] = {
        key : key,
        amount : amount
      }
      console.log(key + "/" +  amount);
    firebase.database().ref("/menu").update(o);
    //return this.http.post(firebaseConfig.databaseURL + '/lal.json', {test: 5}).subscribe();
  }

  ionViewDidLoad() {
    ga('set', 'page', '/welcome');
    ga('send', 'event', "page", "visit", "welcome");

    console.log('ionViewDidLoad WelcomePage');
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }
}
