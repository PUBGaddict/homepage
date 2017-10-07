import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SpotData } from '../../providers/spot-data';

import { StrategyDetailPage } from '../strategy-detail/strategy-detail'
import { SubmitPage } from '../submit/submit'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'


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
  private noMoreSpots: boolean = false;
  public filter = "date";

  constructor(public navCtrl: NavController, public navParams: NavParams, public spotData: SpotData, public authService : AuthServiceProvider, public toastCtrl: ToastController) {
    this.category = navParams.get("category");
    this.getInitialTags();
    /* this.spotData.getSpotsForTag(this.category).then((spots: any[]) => {
      this.spots = spots;
    }); */
  }

  getInitialTags() {
    this.spotData.getNextTagsForCategory(this.category, this.filter, true).then((spots : any[]) => {
      this.spots = spots;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPage');
    ga('set', 'page', '/select');
    ga('send', 'event', "page", "visit", "select");
    ga('send', 'event', "spot", "selected", this.category);
    
  }

  newestClicked() {
    ga('send', 'event', "filter", "newest", "clicked");
    
    this.filter = "date";
    this.getInitialTags();
  }

  loadSpots() {
    this.spotData.getNextTagsForCategory(this.category, this.filter, true).then((spots : any[]) => {
      this.spots = spots;
    });
  }

  highestClicked() {
    ga('send', 'event', "filter", "highest", "clicked");
    
    this.filter = "rating";
    this.getInitialTags();
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
    if (this.authService.authenticated) {
      this.navCtrl.push(SubmitPage);
    } else {
      this.toastCtrl.create({
        message: "You need to login before submitting new stuff",
        duration: 2500
      }).present();
    }
  } 

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this.spotData.getNextTagsForCategory(this.category, this.filter, false)
      .then((spots : any[]) => {
        if (spots.length <= 0) {
          this.noMoreSpots = true;
        }
        this.spots = this.spots.concat(spots);
        if (infiniteScroll) {
          infiniteScroll.complete()
        }
        console.log('Async operation has ended');
      }, err => {
        if (infiniteScroll) {
          infiniteScroll.complete()
        }
        console.log("No more categories found");
      })
  }
}
