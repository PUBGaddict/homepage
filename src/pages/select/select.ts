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
    spot : [],
    smoke: [],
    brand: [],
    flash: [],
    eco: [],
    teamtactics: []
  };
  public mapStatistics = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData, public statisticsData : StatisticsData) {
    this.mapName = navParams.get("mapName");
    this.statisticsData.getStatistics(this.mapName).subscribe(statistics => {
      this.mapStatistics = statistics;
    });
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
    if (strategyName in this.mapStatistics) {
      return this.mapStatistics[strategyName] > 0;
    } else {
      return false;
    }
  }
}
