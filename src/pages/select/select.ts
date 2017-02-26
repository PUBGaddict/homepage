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
  private map: Object;
  private title: String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    this.map = this.navParams.get("map");
    this.title = this.navParams.get("map").title;
    console.log('ionViewDidLoad SelectPage');
  }

  openMapOverview(option) {
    let map = this.map
    this.navCtrl.push(MapOverviewPage, {
      map, option
    });
  }

}
