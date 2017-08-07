import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { YoutubePlayerComponent } from '../../app/youtube-player.component';
import { MapOverviewComponent } from '../../app/map-overview.component';
import { ReleaseData } from '../../providers/release-data';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

/**
 * Generated class for the ReleasePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-release',
  templateUrl: 'release.html',
})
export class ReleasePage {

  @ViewChild('youtubePlayer') youtubePlayer: YoutubePlayerComponent;
  @ViewChild('mapOverview') mapOverview: MapOverviewComponent;
  public releaseCandidate : any = {
    mapname : "",
    strategy : "",
    title : "",
    spotId : "",
    start : {
      x : 0,
      y : 0
    },
    startSeconds : 0,
    endSeconds : 99,
    end : {
      x : 0,
      y : 0
    },
    videoId : "",
    angle : 0,
    picture_1 : "",
    picture_2 : "",
    picture_3 : ""
  };
  public statistic : FirebaseObjectObservable<any>;
  public statisticsCount : number;
  isFirstSubscribe : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularFireDatabase : AngularFireDatabase, public toastCtrl : ToastController, public releaseData : ReleaseData) {
    this.releaseCandidate = navParams.get("releaseCandidate");
    if (this.releaseCandidate) {
      this.createStatisticsRef();
    } else {
      this.releaseData.getReleaseCandidate(navParams.get("spotId")).subscribe(candidate => {
        this.releaseCandidate = candidate;
        this.createStatisticsRef();
      })
    }
  }

  createStatisticsRef () {
    this.statistic = this.angularFireDatabase.object('/statistics/' + 
        this.releaseCandidate.mapname + "/" + 
        this.releaseCandidate.strategy);
  }
  
  releasePressed () {
    let aPromises = [];
    aPromises.push(this.angularFireDatabase.object('/locations/' + 
        this.releaseCandidate.mapname + '/' + 
        this.releaseCandidate.strategy + '/' + 
        this.releaseCandidate.spotId)
          .update({published : true}));

    aPromises.push(this.angularFireDatabase.object('/spots/' + 
        this.releaseCandidate.mapname + '/' + 
        this.releaseCandidate.strategy + '/' + 
        this.releaseCandidate.spotId)
          .update({published : true}));

    
    aPromises.push(this.angularFireDatabase.object('/releaseCandidates/' + 
        this.releaseCandidate.spotId)
          .remove());
      
    Promise.all(aPromises).then(() => {
      this.presentToast();
    });

    this.statistic.subscribe((snapshot) => {
      var value;
      if (snapshot.value === undefined) {
        value = 1;
      } else {
        value = snapshot.value + 1;
      }
      if (this.isFirstSubscribe) {
        this.isFirstSubscribe = false;

        this.statistic.set({ value : value });
      }
    })
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Spot released successfully',
      duration: 4000
    });
    toast.present();
  }

  logPress(event) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleasePage');
    this.mapOverview.clearDataSpots();
    this.mapOverview.setMap(this.releaseCandidate.mapname);
    this.mapOverview.displayMap(false).then(() => {  // wait until rendered
      let spot = {
        strategy : this.releaseCandidate.strategy,
        angle : this.releaseCandidate.angle || 0,
        start : {
          x : this.releaseCandidate.start.x,
          y : this.releaseCandidate.start.y
        },
        end : undefined
      };
      if (this.releaseCandidate.strategy === "smoke" || this.releaseCandidate.strategy === "decoy" ) {
        spot.end = {
          x : this.releaseCandidate.strategy === "smoke" || this.releaseCandidate.strategy === "decoy" ? this.releaseCandidate.end.x : 0,
          y : this.releaseCandidate.strategy === "smoke" || this.releaseCandidate.strategy === "decoy" ? this.releaseCandidate.end.y : 0
        }
      }
      this.mapOverview.appendDataSpots([spot])
    });
  }
}
