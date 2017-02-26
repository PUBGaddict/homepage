import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapOverviewPage } from '../map-overview/map-overview'

/*
  Generated class for the Select page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-select',
  templateUrl: 'select.html'
})
export class SelectPage {
  private sMap: String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    this.sMap = this.navParams.get("sMap");
    console.log('ionViewDidLoad SelectPage');
  }

  openMapOverview(sOption) {
    let sMap = this.sMap
    this.navCtrl.push(MapOverviewPage, {
      sMap, sOption
    });
  }

}
