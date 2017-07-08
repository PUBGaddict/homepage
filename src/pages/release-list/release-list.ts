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
  selector: 'page-release-list',
  templateUrl: 'release-list.html',
})
export class ReleaseListPage {

  public releaseCandidates = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public releaseData : ReleaseData) {
    this.releaseData.getReleases().subscribe((data : Response[]) => {
      this.createCandidates(data);
    });
  }

  private createCandidates(data) {
    this.releaseCandidates = [];
    for(let key in data[0]) {
      if (data[0].hasOwnProperty(key) && data[1].hasOwnProperty(key)) {
        this.releaseCandidates.push(Object.assign(data[0][key],data[1][key],{spotId:key}));
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleaseListPage');
  }

}
