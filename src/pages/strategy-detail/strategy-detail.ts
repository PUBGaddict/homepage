import { Component, ViewChild } from '@angular/core';
import { firebaseConfig } from '../../app/app.module';
import { Http } from '@angular/http';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SpotData } from '../../providers/spot-data';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { SubmitPage } from '../submit/submit';
import { UserPage } from '../user/user';
import { SelectPage } from '../select/select';

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
  private spotId: string;
  public color;
     
  public safeVidUrl : any;

  public categories : any = [];

  public spot = {
    id : "",
    title : "",
    strategy : "",
    mapName : "",
    startSeconds : 0, 
    endSeconds : 0,
    videoId : "",
    picture_1 : "",
    picture_2 : "",
    picture_3 : "",
    rating: 0,
    path: "",
    published: true
  }

  public afRatingRef: FirebaseObjectObservable<any>;

  constructor(public http: Http, public toastCtrl: ToastController, private angularFireDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public spotData: SpotData, private sanitizer: DomSanitizer) {
    this.angularFireDatabase = angularFireDatabase;
    this.spotId = navParams.get("spotId");
    this.afRatingRef = this.angularFireDatabase.object('/fspots/' + this.spotId + '/rating');
    this.displaySpot();
  }

  nextSpot() {
    this.spotData.getNextSpot(this.spot.path, this.spot.id).subscribe(nextSpot => {
      this.navCtrl.push(StrategyDetailPage, {
        spotId : nextSpot.id
      });
    });
  }

  previousSpot() {
    this.spotData.getPreviousSpot(this.spot.path, this.spot.id).subscribe(prevSpot => {
      this.navCtrl.push(StrategyDetailPage, {
        spotId : prevSpot.id
      });
    });
  }

  displaySpot() {     
    this.afRatingRef.subscribe();
    this.spotData.getSpot(this.spotId).subscribe(spot => {
      this.spot = spot;
      this.categories = Object.keys(spot.tags);
      if (this.isGfycat()) {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.gfycat.com/ifr/" + spot.videoId);
      }
      if (this.isTwitch()) {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://clips.twitch.tv/embed?clip=" + spot.videoId);
      }
      if (this.isStreamable()) {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://streamable.com/e/" + spot.videoId);
      }
      if (this.isVimeo()) {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + spot.videoId)
      }
    });
  }

  openPage (category) {
   this.navCtrl.push(SelectPage, {category : category})
 }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000
    });
    toast.present();
  } 

  isGfycat() {
    return this.spot.strategy === 'gfycat';
  }

  isTwitch() {
    return this.spot.strategy === 'twitch';
  }

  isYouTube() {
    return this.spot.strategy === 'youtube';
  }

  isStreamable() {
    return this.spot.strategy === 'streamable';
  }

  isVimeo() {
    return this.spot.strategy === 'vimeo';
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
      this.spot.rating += delta;

      this.afRatingRef.set(this.spot.rating);
      this.saveVote();
    }
  }

  userPressed (spot) {
    this.navCtrl.push(UserPage, {
      displayName: spot.displayName
    });
  }

  ionViewDidLoad() {
    ga('set', 'page', '/strategy-detail');
    ga('send', 'event', "page", "visit", "stragety-detail");
    ga('send', 'event', "spot", "selected", this.spotId);

    console.log('ionViewDidLoad StrategyDetailPage');
  }

}
