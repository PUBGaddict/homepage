import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';

/*
  Generated class for the StrategyDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-strategy-detail',
  templateUrl: 'strategy-detail.html'
})
export class StrategyDetailPage {
  @ViewChild('container') container;
  public strategy : any;
  public spot: any;
  public height: any;
  private mapName: string;
  private strategyId: string;
  private intentionName: string;
  private spotId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData) {
    this.mapName = navParams.get("mapName");
    this.strategyId = navParams.get("strategyId");
    this.intentionName = navParams.get("intentionName");
    this.spotId = navParams.get("spotId");
    let that = this;

    this.mapData.getMap(this.mapName).subscribe(map => {
      debugger;
      that.strategy = mapData.getStrategyForIntentionOnMap(map, that.intentionName, that.strategyId);
      that.spot = mapData.getSpotFromStrategy(that.strategy, that.spotId);
    });
  }

  ionViewDidLoad() {
    this.resizeImages();
    console.log('ionViewDidLoad StrategyDetailPage');

    window.addEventListener('resize', this.resizeImages.bind(this));

  }

  resizeImages() {
    this.height = this.container.getNativeElement().offsetWidth/16*8.5;
  }


}
