import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotData } from '../../providers/spot-data';
import { PublishPage } from '../publish/publish'

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

  constructor(public spotData: SpotData, public navCtrl: NavController, public navParams: NavParams) {
    this.spotData.getUnpublishedSpots().subscribe(spots => {
      let aspots = Object.keys(spots).map(key=>spots[key]);      
      this.spots = aspots;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnpublishedPage');
  }

  spotSelected (spot) {
    this.navCtrl.push(PublishPage, {
      spotId : spot.id
    });
  }

}
