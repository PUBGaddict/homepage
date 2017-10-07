import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PatchnoteData } from '../../providers/patchnote-data';
import { SubmitPage } from '../submit/submit';
import { Http } from '@angular/http';
import { firebaseConfig } from '../../app/app.module';
import { ResultPage } from '../result/result';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'

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
  @ViewChild('searchBar') searchBar: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public patchnoteData : PatchnoteData, private http: Http, public authService : AuthServiceProvider, public toastCtrl: ToastController) {
    if (this.patchNotes.length === 0) {  
      this.patchnoteData.getInitialPatchNotes().then((initialPatchNotes) => {
        this.patchNotes = initialPatchNotes;
      })
    }
  }

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
    if (this.authService.authenticated) {
      this.navCtrl.push(SubmitPage);
    } else {
      this.toastCtrl.create({
        message: "You need to login before submitting new stuff",
        duration: 2500
      }).present();
    }
  }
  search (event) {
    let val = event.target.value;
    var that = this;
    if (val && val.trim() != '' && val.length > 1) {
      // if not yet displaying result page in details section, display it and switch to the other searchinput
      this.searchBar.value = "";
      this.navCtrl.push(ResultPage, { query: val });
      // this.nav.setRoot(ResultPage, { query: val });
    }
  }
}
