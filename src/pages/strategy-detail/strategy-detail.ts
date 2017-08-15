import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';
import { DomSanitizer } from '@angular/platform-browser';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { SubmitPage } from '../submit/submit';

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
  public height: any;
  private mapName: string;
  private strategy: string;
  private intentionName: string;
  private spotId: string;
  private upvotes: number;
  public color;
  private item: FirebaseObjectObservable<any>;
     
  public safeVidUrl : any;
  private location;

  public spot = {
    spotId : "",
    title : "",
    strategy : "",
    mapName : "",
    startSeconds : 0, 
    endSeconds : 0,
    videoId : "",
    picture_1 : "",
    picture_2 : "",
    picture_3 : ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData, private sanitizer: DomSanitizer, private angularFireDatabase: AngularFireDatabase) {
    this.angularFireDatabase = angularFireDatabase;
    this.mapName = navParams.get("mapName");
    this.strategy = navParams.get("strategy");
    this.location = navParams.get("location");
    this.spotId = navParams.get("spotId");
    let bDirectAccess = (!this.strategy || !this.mapName);

    if (bDirectAccess) {
      this.mapData.getSpotInformation(this.spotId).subscribe(data => {
        this.strategy = data.strategy;
        this.mapName = data.mapName;

        this.displaySpot();
      })
    } else {
      this.displaySpot();
    }
  }

  displaySpot() {
    this.item = this.angularFireDatabase.object('/ratings/' + 
            this.mapName + "/" + 
            this.strategy  + "/" + 
            this.spotId);
    this.item.subscribe((snapshot) => {
      if (snapshot.value === undefined) {
        this.item.set({ value: 0 });
      }
      this.upvotes = snapshot.value;
    })

    this.mapData.getSpot(this.mapName, this.strategy, this.spotId).subscribe(spot => {
      this.spot = spot;
    })
  }

  isGrenade () {
    return this.spot.strategy === 'smoke' || this.spot.strategy === 'decoy' || this.spot.strategy === 'brand';
  }

  isSpot () {
    return this.spot.strategy === 'awp' || this.spot.strategy === 'spot';
  }

  getVoteObject() {
    if (typeof(Storage) !== "undefined") {
      if (!localStorage.getItem("votes")) {
        localStorage.setItem("votes", "[]");
      } 
      return JSON.parse(localStorage.getItem("votes"));
    }
    return [this.spotId]; //means: users with no storage already voted.
  }
  
  setVoteObject(votes) {
    if (typeof(Storage) !== "undefined" && votes) {
      localStorage.setItem("votes", JSON.stringify(votes));
    }
  }

  mayVote() {
    let votes = this.getVoteObject();
    if (!votes.includes(this.spotId)) {
      return true;  
    }
    return false;
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }

  saveVote() {
    let votes = this.getVoteObject();
    votes.push(this.spotId);
    this.setVoteObject(votes);
  }

  vote(direction: boolean) {
    let delta = direction ? 1 : -1;    
    if (this.mayVote()) {
      this.item.set({ value: this.upvotes + delta });
      this.saveVote();
    }
  }

  ionViewDidLoad() {
    ga('set', 'page', '/strategy-detail');
    ga('send', 'event', "page", "visit", "stragety-detail");
    ga('send', 'event', "spot", "selected", this.spotId);

    console.log('ionViewDidLoad StrategyDetailPage');
  }

}
