import { Component, ViewChild } from '@angular/core';
import { firebaseConfig } from '../../app/app.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SpotData } from '../../providers/spot-data';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { UserPage } from '../user/user';

@Component({
  selector: 'page-publish',
  templateUrl: 'publish.html'
})
export class PublishPage {
  @ViewChild('container') container;
  
  public height: any;
  private spotId: string;
  public color;

  public spotHeadForm : any;
  public tags : String[];
     
  public safeVidUrl : any;

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
    published: true
  }

  public afRatingRef: FirebaseObjectObservable<any>;

  constructor(public http: Http, public formBuilder: FormBuilder, public toastCtrl: ToastController, private angularFireDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public spotData: SpotData, private sanitizer: DomSanitizer) {
    this.spotHeadForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(10)])],
      tags: [[], Validators.compose([Validators.minLength(1), Validators.maxLength(3)])] 
    });
    
    this.angularFireDatabase = angularFireDatabase;
    this.spotId = navParams.get("spotId");
    this.afRatingRef = this.angularFireDatabase.object('/fspots/' + this.spotId + '/rating');
    this.displaySpot();
  }

  displaySpot() {     
    this.afRatingRef.subscribe();
    this.spotData.getSpot(this.spotId).subscribe(spot => {
      this.spot = spot;
      this.tags = Object.keys(spot.tags);

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
      if (this.isReddit()) {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.reddit.com/mediaembed/video/" + spot.videoId)
      }
    });
  }

  acceptSpot(spotId) {    
    this.http.post(firebaseConfig.functionsURL + '/publish?id=' + spotId,
      JSON.stringify({
        title: this.spot.title,
        tags: this.tags
    })).subscribe(data => {
      if (data.status === 200) {
        this.presentToast("published successfully");
      }
    });
    this.nextSpot();
  }

  rejectSpot(spotId) {
    this.http.get(firebaseConfig.functionsURL + '/reject?id=' + spotId).subscribe(data => {
      if (data.status === 200) {
        this.presentToast("declined successfully");
      }
    });
    this.nextSpot();
  }

  nextSpot() {
    let subscription = this.spotData.getNextSpot("unpublished", this.spotId).subscribe(s => {
      if (!s.published) {
        this.navCtrl.setPages([{page: PublishPage, params: {
          spotId : s.id
        }}]);
      }
      subscription.unsubscribe();
    });
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
  
  isReddit() {
    return this.spot.strategy === 'reddit';
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
    ga('set', 'page', '/publish');
    ga('send', 'event', "page", "visit", "publish");
    ga('send', 'event', "spot", "publish", this.spotId);

    console.log('ionViewDidLoad PublishDetailPage');
  }

}