import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotData } from '../../providers/spot-data';
import { StatisticsData } from '../../providers/statistics-data';

import { StrategyDetailPage } from '../strategy-detail/strategy-detail'
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
  public category: string = "";
  public spots: Array<any> = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public spotData: SpotData, public statisticsData : StatisticsData) {
    this.category = navParams.get("category");
    this.spotData.getSpotsForTag(this.category).then((spots: any[]) => {
      this.spots = spots;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
    ga('set', 'page', '/select');
    ga('send', 'event', "page", "visit", "select");
    ga('send', 'event', "spot", "selected", this.category);
    
  }

  openSpot(spotId) {
   this.navCtrl.push(StrategyDetailPage, {spotId})
  }

  getThumbnail(spot) {
    if (spot.strategy === 'gfycat') {
      return "https://thumbs.gfycat.com/" + spot.videoId + "-thumb100.jpg";
    }  
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  } 
}
