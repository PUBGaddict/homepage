import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  public strategy : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.strategy = navParams.get('strategy');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StrategyDetailPage');
  }

}
