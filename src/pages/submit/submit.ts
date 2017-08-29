import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoryData } from '../../providers/category-data';
import { SpotIdData } from '../../providers/spotid-data';
import { Http } from '@angular/http';
import { YoutubePlayerComponent } from '../../app/youtube-player.component';
import { DomSanitizer } from '@angular/platform-browser';

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
  @ViewChild('progress') progress;
  @ViewChild('spotDetails') spotDetails;

  private submitAttempt: boolean = false;
  public detailsInvisible: boolean = true;

  public saveButtonDisabled : boolean = false;
  public safeVidUrl : any;

  public spotHeadForm : any;
  public youtubeDetailForm : any;
  public gfycatDetailForm : any;

  constructor(public navCtrl: NavController, public categoryData : CategoryData, public navParams: NavParams, public toastCtrl: ToastController, public http: Http, public spotIdData : SpotIdData, public formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    // validators
    this.spotHeadForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(10), Validators.pattern('[a-zA-Z,. ]*')])],
      strategy: ['', Validators.compose([Validators.required])],
      tags: [[], Validators.compose([Validators.minLength(1), Validators.maxLength(3)])] 
    });

    this.youtubeDetailForm = formBuilder.group({
      startSeconds: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
      endSeconds: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern('[0-9]*')])],
      videoId: ['', Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('[0-9a-zA-Z_-]*')])]
    });

    this.gfycatDetailForm = formBuilder.group({
      videoId: ['', Validators.compose([Validators.required, Validators.pattern('[0-9a-zA-Z]*')])]
    });
  }

  onChangeTag(val){
    let tags = this.spotHeadForm.get('tags').value;
    if ( tags.length > 2 ) {
      tags.splice(3);
      this.spotHeadForm.get('tags').setValue(tags);
    }
    console.log(this.spotHeadForm.get('tags').value)
  }

  isYoutube () {
    return this.spotHeadForm.get('strategy').value === 'youtube';
  }

  isGfycat () {
    return this.spotHeadForm.get('strategy').value === 'gfycat';
  }

  onVideoUrlChanged(event) {
    let url :string = event.value;
    let videoId :string = "";
    if (this.isYoutube()) {
      if (url.startsWith("https://www.youtube.com/watch")) {
        if (url.includes("?v=")) {
          videoId = url.substr(url.indexOf("?v=") + 3, 11);
        }
        if (url.includes("&v=")) {
          videoId = url.substr(url.indexOf("&v=") + 3, 11);
        }
        this.youtubeDetailForm.get('videoId').setValue(videoId);
      }
      this.refresh();
      return;
    } 

    if (this.isGfycat()) {
      if (url.startsWith("https://gfycat.com")) {
        videoId = url.substr(19);
        if (url.startsWith("https://gfycat.com/ifr/")) {
          videoId = url.substr(23);
        }
      } else {
        videoId = url;
      }
      this.gfycatDetailForm.get('videoId').setValue(videoId);
      this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.gfycat.com/ifr/" + videoId);
      console.log(this.safeVidUrl);
      return;
    }
  }

  refresh() {
    if (!this.youtubeDetailForm.valid) {
      return;
    }

    this.youtubePlayer.play({
      videoId : this.youtubeDetailForm.get('videoId').value,
      startSeconds: this.youtubeDetailForm.get('startSeconds').value,
      endSeconds: this.youtubeDetailForm.get('endSeconds').value,
    });
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
    let strategy = this.spotHeadForm.get('strategy').value,
        title = this.spotHeadForm.get('title').value,
        tags = this.spotHeadForm.get('tags').value;

    if (tags.length < 1) {
      this.presentToast('Please add some tags');
      return;
    }

    if (tags.length > 3) {
      this.presentToast('Please remove some tags');
      return;
    }
      
    // if the user has selected youtube, the youtubeDetailForm needs to be valid
    if ((strategy === 'youtube') && !this.youtubeDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great youtube video!');
      return;
    }
    // if the user has selected youtube, and endSeconds < startSeconds 
    if ((strategy === 'youtube') && parseInt(this.youtubeDetailForm.get('endSeconds').value, 10) < parseInt(this.youtubeDetailForm.get('startSeconds').value, 10)) {
      this.presentToast('The starting seconds need to be earlier than the end seconds.');
      return;
    }
    // if the user has selected gfycat, the gfycatDetailForm needs to be valid
    if ((strategy === 'gfycat') && !this.gfycatDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great gfycat video!');
      return;
    }

    this.saveButtonDisabled = true;
    var oSpot = {
      title : title,
      strategy : strategy,
      tags : tags,
      videoId : undefined,

      // optional properties for youtube
      startSeconds : undefined,
      endSeconds : undefined
    };
    if (strategy === "youtube") {
      oSpot.videoId = this.youtubeDetailForm.get('videoId').value;
      oSpot.startSeconds = parseInt(this.youtubeDetailForm.get('startSeconds').value, 10);
      oSpot.endSeconds = parseInt(this.youtubeDetailForm.get('endSeconds').value, 10);
    } 
    if (strategy === "gfycat") {
      oSpot.videoId = this.gfycatDetailForm.get('videoId').value;
    }

    this.spotIdData.submitSpot(oSpot).subscribe((spot: any) => {
      this.presentToast('Spot successfully created. Lean back while we verify your great spot!');
    })
  }

  displayDetails() {
    this.detailsInvisible = false;
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 7000
    });
    toast.present();
  }

}
