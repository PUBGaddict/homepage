import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DefusalData } from '../../providers/defusal-data';
import { HostageData } from '../../providers/hostage-data';
import { SpotIdData } from '../../providers/spotid-data';
import { Http } from '@angular/http';
import { YoutubePlayerComponent } from '../../app/youtube-player.component';
import { MapOverviewComponent } from '../../app/map-overview.component';

import { EndSecondsValidator } from  '../../validators/endSeconds';
import { StartSecondsValidator } from  '../../validators/startSeconds';
import { PictureValidator } from  '../../validators/picture';

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
  @ViewChild('mapOverview') mapOverview: MapOverviewComponent;
  @ViewChild('progress') progress;

  de_maps: any[] = [];
  cs_maps: any[] = [];

  firstPress: any = null; 
  secondPress: any = null;

  private isFirstPress : boolean = true;
  public storageRef : any = null;
  public saveButtonDisabled : boolean = false;
  public videoId: string = "";
  public strategy: string = "";
  public title: string = "";
  public map: string = "";
  public startSeconds: number = 0;
  public endSeconds: number = 15;
  public picture_1 : string = "";
  public picture_2 : string = "";
  public picture_3 : string = "";
  public angle : number = 0;
  public start :any = {
    x : 0,
    y : 0
  };
  public end : any = {
    x : 0,
    y : 0
  };
  public spotHeadForm : any;
  public smokeDetailForm : any;
  public spotDetailForm : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public defusalData: DefusalData, public hostageData: HostageData, public firebaseApp : FirebaseApp, public toastCtrl: ToastController, public http: Http, public spotIdData : SpotIdData, public formBuilder: FormBuilder) {
    this.defusalData.getDefusalMaps().subscribe((de_maps: any[]) => {
      this.de_maps = de_maps;
    });
    this.hostageData.getHostageMaps().subscribe((cs_maps: any[]) => {
      this.cs_maps = cs_maps;
    });

    this.spotHeadForm = formBuilder.group({
        title: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(10), Validators.pattern('[a-zA-Z ]*')])],
        map: ['', Validators.compose([Validators.required])],
        strategy: ['', Validators.compose([Validators.required])]
    });

    this.smokeDetailForm = formBuilder.group({
        startSeconds: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
        endSeconds: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
        videoId: ['', Validators.compose([Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern('[0-9a-zA-Z_-]*')])]
    });

    this.spotDetailForm = formBuilder.group({
        angle: ['', Validators.compose([Validators.max(360), Validators.min(0), Validators.required])],
        picture_1: ['', PictureValidator.isValid],
        picture_2: ['', PictureValidator.isValid],
        picture_3: ['', PictureValidator.isValid]
    });

  }
 
  // onFileUpload(event) {
  //   let files = event.srcElement.files;
  //   debugger;
  // }
 
  refresh() {
    this.youtubePlayer.play({
      videoId : this.videoId,
      startSeconds: this.startSeconds,
      endSeconds: this.endSeconds,
    });
  }

  onRangeChange(angle) {
    this.mapOverview.appendDataSpots([{
        angle : this.angle,
        start : {
          x : this.start.x,
          y : this.start.y
        },
        strategy : this.spotHeadForm.get('strategy').value
    }]);  
  }

  logPress(event) {
    console.log(event);
    let strategy = this.spotHeadForm.get('strategy').value;

    if (this.isFirstPress) {
      this.start = event;
      this.mapOverview.appendDataSpots([{
        angle : this.angle,
        start : {
          x : event.x,
          y : event.y
        },
        strategy : strategy
      }]);
      this.isFirstPress = false;
      
      if (strategy !== 'smoke' && strategy !== 'decoy') {
        this.isFirstPress = true;  
      }
    } else {
      this.mapOverview.appendDataSpots([{
        angle : 0,
        start : {
          x : this.start.x,
          y : this.start.y
        },
        end : {
          x : event.x,
          y : event.y
        },
        strategy : strategy
      }]);
      this.end = event;
      this.isFirstPress = true;
    }
  }

  ionViewDidLoad() {
    ga('set', 'page', '/submit');
    ga('send', 'event', "page", "visit", "submit");

    console.log('ionViewDidLoad SubmitPage');
  }

  savePressed () {
    if (!this.spotHeadForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great spot!')
      return;
    }
    let map = this.spotHeadForm.get('map').value,
        strategy = this.spotHeadForm.get('strategy').value,
        title = this.spotHeadForm.get('title').value;

    this.saveButtonDisabled = true;
    var oSpot = {
        title : title,
        strategy : strategy,
        mapname : map,
        start : this.start,

        // optional properties for youtube
        videoId : undefined,
        startSeconds : undefined,
        endSeconds : undefined,
        end : undefined,

        // optional properties for 
        angle : undefined,
        picture_1 : undefined,
        picture_2 : undefined,
        picture_3 : undefined
    };
    if (strategy === "smoke" || strategy === "decoy") {
      oSpot.videoId = this.videoId;
      oSpot.startSeconds = this.startSeconds;
      oSpot.endSeconds = this.endSeconds;
      oSpot.end = this.end;
    } else {
      oSpot.angle = this.angle;
      oSpot.picture_1 = this.picture_1;
      oSpot.picture_2 = this.picture_2;
      oSpot.picture_3 = this.picture_3;
    }
    console.log(oSpot);
    // this.spotIdData.submitSpot(oSpot).subscribe((spot: any) => {
    //   this.presentToast('Spot successfully created. Lean back while we verify your great spot!');
    // })
  }

  mapChanged () {
    this.isFirstPress = true;
    this.mapOverview.clearDataSpots();
    this.mapOverview.setMap(this.spotHeadForm.get("map").value);
    this.mapOverview.displayMap(false);
  }

  strategyChanged () {
    this.isFirstPress = true;
    this.mapOverview.clearDataSpots();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000
    });
    toast.present();
  }

}
