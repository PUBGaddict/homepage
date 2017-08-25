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
import { AdditionalPictureValidator } from  '../../validators/additionalPicture';

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
  @ViewChild('spotDetails') spotDetails;

  de_maps: any[] = [];
  cs_maps: any[] = [];

  firstPress: any = null; 
  secondPress: any = null;

  private isFirstPress : boolean = true;
  private submitAttempt: boolean = false;
  public detailsInvisible: boolean = true;

  public saveButtonDisabled : boolean = false;
  public start :any = {};
  public end : any = {};

  public spotHeadForm : any;
  public smokeDetailForm : any;
  public spotDetailForm : any;
  public hasMap : boolean = false;
  public hasStrategy : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public http: Http, public spotIdData : SpotIdData, public formBuilder: FormBuilder) {
   /*  this.mapnameData.getDefusalNames().subscribe((de_maps: any[]) => {
      for (let key in de_maps) {
        this.de_maps.push({ mapname : key} )
      }
    });
    this.mapnameData.getHostageNames().subscribe((cs_maps: any[]) => {
      for (let key in cs_maps) {
        this.cs_maps.push({ mapname : key} )
      } 
    });*/

    // validators
    this.spotHeadForm = formBuilder.group({
        title: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(10), Validators.pattern('[a-zA-Z,. ]*')])],
        map: ['', Validators.compose([Validators.required])],
        strategy: ['', Validators.compose([Validators.required])]
    });

    this.smokeDetailForm = formBuilder.group({
        startSeconds: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
        endSeconds: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
        videoId: ['', Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9a-zA-Z_-]*')])]
    });

    this.spotDetailForm = formBuilder.group({
        angle: ['', Validators.compose([Validators.required, Validators.max(360), Validators.min(0)])],
        picture_1: ['', Validators.compose([Validators.required, PictureValidator.isValid])],
        picture_2: ['', AdditionalPictureValidator.isValid],
        picture_3: ['', AdditionalPictureValidator.isValid]
    });
  }

  isGrenade () {
    return this.spotHeadForm.get('strategy').value === 'smoke' || this.spotHeadForm.get('strategy').value === 'decoy' || this.spotHeadForm.get('strategy').value === 'brand';
  }

  isSpot () {
    return this.spotHeadForm.get('strategy').value === 'spot' || this.spotHeadForm.get('strategy').value === 'awp';
  }

  onVideoIdChanged(event) {
    let url :string = event.value;
    let videoId :string = "";
    if (url.startsWith("https://www.youtube.com/watch")) {
      if (url.includes("?v=")) {
        videoId = url.substr(url.indexOf("?v=") + 3, 11);
      }
      if (url.includes("&v=")) {
        videoId = url.substr(url.indexOf("&v=") + 3, 11);
      }
      this.smokeDetailForm.get('videoId').setValue(videoId);
    }
    this.refresh();
  }
 
  refresh() {
    if (!this.smokeDetailForm.valid) {
      return;
    }

    this.youtubePlayer.play({
      videoId : this.smokeDetailForm.get('videoId').value,
      startSeconds: this.smokeDetailForm.get('startSeconds').value,
      endSeconds: this.smokeDetailForm.get('endSeconds').value,
    });
  }

  onRangeChange(angle) {
    if (!this.start.x && !this.start.y) {
      return;
    }

    this.mapOverview.appendDataSpots([{
        angle : this.spotDetailForm.get('angle').value,
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
      this.end = undefined;
      this.mapOverview.appendDataSpots([{
        angle : this.spotDetailForm.get('angle').value || 0,
        start : {
          x : event.x,
          y : event.y
        },
        strategy : strategy
      }]);
      this.isFirstPress = false;
      
      if (strategy !== 'smoke' && strategy !== 'decoy' && strategy !== 'brand') {
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
      this.presentToast('Please fill out all the mandatory fields so we can process your great spot!');
      this.submitAttempt = true;
      return;
    }
    let map = this.spotHeadForm.get('map').value,
        strategy = this.spotHeadForm.get('strategy').value,
        title = this.spotHeadForm.get('title').value;

    // advanced validation for cases:
    // if start is not defined
    if (!this.start) {
      this.presentToast('Please click on the map where your spot takes place');
      return;
    }

    // if the user has selected smoke or decoy, the smokeDetailForm needs to be valid
    if ((strategy === 'smoke' || strategy === 'decoy' || strategy === 'brand') && !this.smokeDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great spot!');
      return;
    }
    // if the user has selected smoke or decoy, but only provided 1 spot on the map..
    if ((strategy === 'smoke' || strategy === 'decoy' || strategy === 'brand') && !this.end) {
      this.presentToast('Please add more than one spot on the map to complete your spot!');
      return;
    }
    // if the user has selected smoke or decoy, and endSeconds < startSeconds 
    if ((strategy === 'smoke' || strategy === 'decoy' || strategy === 'brand') && parseInt(this.smokeDetailForm.get('endSeconds').value, 10) < parseInt(this.smokeDetailForm.get('startSeconds').value, 10)) {
      this.presentToast('The starting seconds need to be earlier than the end seconds.');
      return;
    }

    // if the user has selected spot or awp, the spotDetailForm needs to be valid
    if ((strategy === 'spot' || strategy === 'awp') && !this.spotDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great spot!');
      return;
    }


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
    if (strategy === "smoke" || strategy === "decoy" || strategy === 'brand') {
      oSpot.videoId = this.smokeDetailForm.get('videoId').value;
      oSpot.startSeconds = parseInt(this.smokeDetailForm.get('startSeconds').value, 10);
      oSpot.endSeconds = parseInt(this.smokeDetailForm.get('endSeconds').value, 10);
      oSpot.end = this.end;
    } else {
      oSpot.angle = this.spotDetailForm.get('angle').value;
      oSpot.picture_1 = this.spotDetailForm.get('picture_1').value;
      oSpot.picture_2 = this.spotDetailForm.get('picture_2').value;
      oSpot.picture_3 = this.spotDetailForm.get('picture_3').value;
    }
    this.spotIdData.submitSpot(oSpot).subscribe((spot: any) => {
      this.presentToast('Spot successfully created. Lean back while we verify your great spot!');
    })
  }

  mapChanged () {
    this.hasMap = true;
    this.isFirstPress = true;
    this.mapOverview.clearDataSpots();
    this.mapOverview.displayMap(this.spotHeadForm.get("map").value, false);
    this.displayDetails();
  }

  displayDetails() {
    if (!this.hasMap || !this.hasStrategy) {
      return;
    }
    this.detailsInvisible = false;
  }

  strategyChanged () {
    this.hasStrategy = true;
    this.isFirstPress = true;
    this.mapOverview.clearDataSpots();
    this.displayDetails();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000
    });
    toast.present();
  }

}
