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
  public map: any;
  public mapname: string;
  public ct = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData) {
    this.mapname = navParams.get("mapname");
    var that = this;
    this.mapData.getMap(this.mapname).subscribe(result => {
      debugger;
      that.ct = result.json().ct;
    });
    
    /*.subscribe((map) => {
      this.map = map;
      //this.nav.setRoot(SelectPage, {map});
    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
  }

  openMapOverview(strategy) {
    this.navCtrl.push(MapOverviewPage, {
      map: this.map, strategy
    });
  }

}
