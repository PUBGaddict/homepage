import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StrategyDetailPage } from '../strategy-detail/strategy-detail'

/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  displayName : string = "";
  spots : Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider : UserProvider) {
    this.displayName = navParams.get("displayName");   
    this.userProvider.getUserSpots(this.displayName).then(spots => {
      for (var key in spots) {
        this.spots.push(spots[key]);
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  spotSelected (spot) {
    this.navCtrl.push(StrategyDetailPage, {
      mapName: spot.mapname,
      strategy: spot.strategy,
      spotId : spot.id
    });
  }
}
