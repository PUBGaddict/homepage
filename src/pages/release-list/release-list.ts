import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReleasePage } from '../release/release';

import { ReleaseData } from '../../providers/release-data';

/**
 * Generated class for the ReleaseListPage page.
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
  }

  private createCandidates(data) {
    this.releaseCandidates = [];
    for(let key in data) {
      if (data.hasOwnProperty(key)) {
        this.releaseCandidates.push(data[key]);
      }
    }
  }

  openReleasePage(releaseCandidate) {
    this.navCtrl.push(ReleasePage, {
      releaseCandidate : releaseCandidate,
      spotId : releaseCandidate.spotId  
    })
  }

  ionViewWillEnter () {
    this.loadReleaseData();
  }

  loadReleaseData () {
    this.releaseData.getReleases().subscribe((data : Response) => {
      this.createCandidates(data);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleaseListPage');
  }

}
