import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';
import { DomSanitizer } from '@angular/platform-browser';

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

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
  private mapName: string;
  private strategyId: string;
  private intentionName: string;
  private spotId: string;
  private upvotes: number;
  public color;
  private item: FirebaseObjectObservable<any>;

  public spot = {
     id: "",
     title: "",
     description: "",
     rating: "",
     difficulty: "",
     prerequisites: "",
     pros: [],
     cons: [],
     angle: "",
     x: "",
     y: "",
     vid: false,
     pictures: []
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData, private sanitizer: DomSanitizer, private angularFire: AngularFire) {
    this.mapName = navParams.get("mapName");
    this.strategyId = navParams.get("strategyId");
    this.intentionName = navParams.get("intentionName");
    this.spotId = navParams.get("spotId");

    this.item = angularFire.database.object('/ratings/' + this.mapName + "/" + this.spotId);
    this.item.subscribe((snapshot) => {
      if (snapshot.value === undefined) {
        this.item.set({ value: 0 });
      }
      this.upvotes = snapshot.value;
    })

    this.mapData.getMap(this.mapName).subscribe(map => {
      let intention = mapData.getIntentionFromMap(map, this.intentionName);
      this.strategy = mapData.getStrategyFromIntention(intention, this.strategyId);
      this.spot = mapData.getSpotFromStrategy(this.strategy, this.spotId);
    });
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
    this.resizeImages();
    console.log('ionViewDidLoad StrategyDetailPage');

    window.addEventListener('resize', this.resizeImages.bind(this));

  }

  resizeImages() {
    this.height = this.container.getNativeElement().offsetWidth/16*8.5;
  }


}
