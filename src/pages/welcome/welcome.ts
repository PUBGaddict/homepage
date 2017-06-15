import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatchnoteData } from '../../providers/patchnote-data';

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
  public patchNotes;

  constructor(public navCtrl: NavController, public navParams: NavParams, public patchnoteData : PatchnoteData) {
    this.patchnoteData.getPatchnotes().subscribe(patchNotes => {
      this.patchNotes = patchNotes;
    });
  }

  ionViewDidLoad() {
    ga('set', 'page', '/welcome');
    ga('send', 'event', "page", "visit", "welcome");

    console.log('ionViewDidLoad WelcomePage');
  }

}
