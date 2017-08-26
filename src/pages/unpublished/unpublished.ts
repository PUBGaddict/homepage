import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';
import { StrategyDetailPage } from '../strategy-detail/strategy-detail'

/**
 * Generated class for the UnpublishedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-unpublished',
  templateUrl: 'unpublished.html',
})
export class UnpublishedPage {

  spots : Array<any> = [];

  constructor(public mapData: MapData, public navCtrl: NavController, public navParams: NavParams) {
    this.mapData.getUnpublishedSpots().subscribe(spots => {
      let aspots = Object.keys(spots).map(key=>spots[key]);      
      this.spots = aspots;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnpublishedPage');
  }

  spotSelected (spot) {
    this.navCtrl.push(StrategyDetailPage, {
      mapName: spot.mapName,
      strategy: spot.strategy,
      spotId : spot.id
    });
  }

}
