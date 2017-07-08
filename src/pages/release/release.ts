import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { YoutubePlayerComponent } from '../../app/youtube-player.component';
import { MapOverviewComponent } from '../../app/map-overview.component';
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
    mapName : "",
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
    endSeconds : 99
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.releaseCandidate = navParams.get("releaseCandidate");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReleasePage');

    setTimeout(function(){
      this.mapOverview.appendDataSpots([{
        angle : 0,
        x : this.releaseCandidate.start.x,
        y : this.releaseCandidate.start.y,
        endx : this.releaseCandidate.strategy === "smoke" ? this.releaseCandidate.end.x : 0,
        endy : this.releaseCandidate.strategy === "smoke" ? this.releaseCandidate.end.y : 0
      }]
    )}.bind(this), 2000);

  }

}
