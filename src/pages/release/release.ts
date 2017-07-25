import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { YoutubePlayerComponent } from '../../app/youtube-player.component';
import { MapOverviewComponent } from '../../app/map-overview.component';

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
  public releaseCandidate = {
    mapname : "de_dust2",
    title : "",
    strategy : "",
    start : {
      x : 0,
      y : 0
    },
    end : {
      x : 0,
      y : 0
    },
    videoId : "",
    startSeconds : 0,
    endSeconds : 99,
    spotId : ""
  };
  releaseButtonDisabled : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularFireDatabase : AngularFireDatabase, public toastCtrl : ToastController) {
    this.releaseCandidate = navParams.get("releaseCandidate");
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
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Spot released successfully',
      duration: 4000
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleasePage');
    debugger;
    this.mapOverview.clearDataSpots();
    this.mapOverview.setMap(this.releaseCandidate.mapname);
    this.mapOverview.displayMap(false).then(() => {  // wait until rendered
      this.mapOverview.appendDataSpots([{
        angle : 0,
        start : {
          x : this.releaseCandidate.start.x,
          y : this.releaseCandidate.start.y
        },
        end : {
          x : this.releaseCandidate.strategy === "smoke" ? this.releaseCandidate.end.x : 0,
          y : this.releaseCandidate.strategy === "smoke" ? this.releaseCandidate.end.y : 0
        }
      }])
    });
  }
}
