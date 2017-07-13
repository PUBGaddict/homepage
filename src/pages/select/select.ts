import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';
import { StatisticsData } from '../../providers/statistics-data';

import { MapOverviewPage } from '../map-overview/map-overview'
import { SubmitPage } from '../submit/submit'

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
  public mapStatistics = {
    ct : 0,
    t : 0,
    smoke : 0,
    flash : 0,
    eco : 0,
    teamtactics : 0
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData, public statisticsData : StatisticsData) {
    this.mapName = navParams.get("mapName");
    this.statisticsData.getStatistics(this.mapName).subscribe(statistics => {
      this.mapStatistics = Object.assign(this.mapStatistics, statistics);
    });

    /*this.mapData.getMap(this.mapName).subscribe(map => {
      debugger;
      this.map = map;
    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
    ga('set', 'page', '/select');
    ga('send', 'event', "page", "visit", "select");
    ga('send', 'event', "map", "selected", this.mapName);
  }

  openMapOverview(strategyId) {
    this.navCtrl.push(MapOverviewPage, {
      mapName: this.mapName,
      strategyId
    });
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }

  getRowVisibility(strategyName) {
    return !!this.mapStatistics[strategyName];
  }
}
