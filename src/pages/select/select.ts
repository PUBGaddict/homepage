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
  public map: any;/*
  public strategies_t: any;
  public strategies_ct: any;
  public strategies_smoke: any;
  public strategies_flash: any;
  public strategies_eco: any;
  public strategies_teamtactics: any;*/

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.map = navParams.get("map");
/*    this.strategies_t = this.map.t;
*/  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
  }

  openMapOverview(option) {
    this.navCtrl.push(MapOverviewPage, {
      map: this.map, option
    });
  }

}
