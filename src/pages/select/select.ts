import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';

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
  public mapname: string;
  public map = {
    ct: [],
    t: [],
    smoke: [],
    flash: [],
    eco: [],
    teamtactics: []
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData) {
    this.mapname = navParams.get("mapname");
    this.mapData.getMap(this.mapname).subscribe(map => {
      this.map = map;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
  }

  openMapOverview(strategy) {
    debugger;
    this.navCtrl.push(MapOverviewPage, {
      mapname: this.mapname, strategy
    });
  }

}
