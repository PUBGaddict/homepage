import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { DefusalData } from '../../providers/defusal-data';
import { HostageData } from '../../providers/hostage-data';
import { SpotIdData } from '../../providers/spotid-data';
import { Http } from '@angular/http';
import { YoutubePlayerComponent } from '../../app/youtube-player.component';

import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

/*
  Generated class for the Submit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-submit',
  templateUrl: 'submit.html'
})
export class SubmitPage {
  @ViewChild('youtubePlayer') youtubePlayer: YoutubePlayerComponent;

  de_maps: any[] = [];
  cs_maps: any[] = [];

  public storageRef : any = null;
  public saveButtonDisabled : boolean = false;
  public videoId: string = "Dc6wTKOvpDk";
  public category: string = "";
  public title: string = "";
  public map: string = "";
  public startSeconds: number = 0;
  public endSeconds: number = 15;
  public start :any =  {
    x : 0,
    y : 0
  };
  public end : any = {
    x : 0,
    y : 0
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public defusalData: DefusalData, public hostageData: HostageData, public firebaseApp : FirebaseApp, public toastCtrl: ToastController, public http: Http, public spotIdData : SpotIdData) {
    this.defusalData.getDefusalMaps().subscribe((de_maps: any[]) => {
      this.de_maps = de_maps;
    });
    this.hostageData.getHostageMaps().subscribe((cs_maps: any[]) => {
      this.cs_maps = cs_maps;
    });
  }

  refresh() {
    this.youtubePlayer.play({
      videoId : this.videoId,
      startSeconds: this.startSeconds,
      endSeconds: this.endSeconds,
    });
  }

  logPress(event) {
    console.log(event);
  }

  ionViewDidLoad() {
    ga('set', 'page', '/submit');
    ga('send', 'event', "page", "visit", "submit");

    console.log('ionViewDidLoad SubmitPage');
  }

  savePressed () {
    this.saveButtonDisabled = true;
    let oRealtimeObject = {
          mapname : this.map,
          title : this.title,
          strategy : this.category
        },
        oSpot = {
          videoId : this.videoId,
          strategy : this.category,
          mapname : this.map,
          title : this.title,
          startSeconds : this.startSeconds,
          endSeconds : this.endSeconds,
          start : this.start,
          end: this.end,
          tmp: true,
          spotId : ""
        };

    this.spotIdData.getUniqueSpotId(oRealtimeObject).subscribe((spot: any) => {
      let spotId = spot.spotId,
          sChildPath = "/" + this.map + "/" + this.category + "/" + spotId + ".json";

      oSpot.spotId = spotId;

      this.storageRef = this.firebaseApp.storage().ref().child(sChildPath);
      this.storageRef.putString(JSON.stringify(oSpot)).then(function(snapshot) {
        console.log('Uploaded a new spot!');
        this.presentToast();
      }.bind(this));
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Spot successfully created. Lean back while we verify your great spot!',
      duration: 7000
    });
    toast.present();
  }

}
