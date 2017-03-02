import { Component, ViewChild } from '@angular/core';
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
  @ViewChild('container') container;
  public strategy : any;
  public height: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.strategy = navParams.get('strategy');
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
