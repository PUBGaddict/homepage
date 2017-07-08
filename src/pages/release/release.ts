import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ReleaseData } from '../../providers/release-data';

/**
 * Generated class for the ReleasePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-release',
  templateUrl: 'release.html',
})
export class ReleasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public releaseData : ReleaseData) {
    this.releaseData.getReleases().subscribe((data) => {
      debugger;
    }) 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleasePage');
  }

}
