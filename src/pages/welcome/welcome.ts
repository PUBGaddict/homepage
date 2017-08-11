import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatchnoteData } from '../../providers/patchnote-data';
import { SubmitPage } from '../submit/submit';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public patchnoteData : PatchnoteData) {
    this.patchnoteData.getPatchnotes().subscribe(patchNotes => {
      this.patchNotesRepo = patchNotes.reverse();
      this.patchNotes.push(patchNotes.pop());
      this.patchNotes.push(patchNotes.pop());
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    if (this.patchNotesRepo.length === 0) {
      infiniteScroll.complete();
      return;
    }
    setTimeout(() => {
      this.patchNotes.push(this.patchNotesRepo.pop());

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 200);
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
