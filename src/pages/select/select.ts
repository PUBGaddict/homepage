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
  public mapName: string = "";
  public map = {
    ct: [],
    t: [],
    smoke: [],
    flash: [],
    eco: [],
    teamtactics: []
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData) {
    this.mapName = navParams.get("mapName");
    this.mapData.getMap(this.mapName).subscribe(map => {
      this.map = map;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
  }

  openMapOverview(strategyId, intentionName) {
    this.navCtrl.push(MapOverviewPage, {
      mapName: this.mapName,
      strategyId,
      intentionName
    });
  }

  getRowVisibility(strategyName) {
    if (this.map[strategyName] && this.map[strategyName].length > 0) {
      for (let strategy of this.map[strategyName]) {
        if (strategy.spots.length > 0) {
          return true;
        } 
      }
    } 
    return false;
  }
}
