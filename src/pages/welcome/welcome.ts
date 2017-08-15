import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatchnoteData } from '../../providers/patchnote-data';
import { SubmitPage } from '../submit/submit';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
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
  public userName : string = "" ;
  public currentUser : firebase.User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public patchnoteData : PatchnoteData, public authServiceProvider : AuthServiceProvider, public afAuth: AngularFireAuth) {
    this.patchnoteData.getInitialPatchNotes().then((initialPatchNotes) => {
      this.patchNotes = initialPatchNotes;
    })
    afAuth.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
      this.userName = user.email;
    });
  }

  logout () {
    this.authServiceProvider.logoutUser();
  }

  login () {
    this.navCtrl.push(LoginPage);
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

  ionViewDidLoad() {
    ga('set', 'page', '/welcome');
    ga('send', 'event', "page", "visit", "welcome");

    console.log('ionViewDidLoad WelcomePage');
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }
}
