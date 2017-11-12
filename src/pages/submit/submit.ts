import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public twitchDetailForm : any;
  public streamableDetailForm : any;
  public vimeoDetailForm : any;
  public redditDetailForm : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public http: Http, public spotIdData : SpotIdData, public formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
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

    this.twitchDetailForm = formBuilder.group({
      videoId: ['', Validators.compose([Validators.required, Validators.pattern('[0-9a-zA-Z]*')])]
    });

    this.streamableDetailForm = formBuilder.group({
      videoId: ['', Validators.compose([Validators.required, Validators.pattern('[0-9a-zA-Z]*')])]
    });

    this.vimeoDetailForm = formBuilder.group({
      videoId: ['', Validators.compose([Validators.required, Validators.pattern('[0-9a-zA-Z]*')])]
    });

    this.redditDetailForm = formBuilder.group({
      videoId: ['', Validators.compose([Validators.required])]
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

  isTwitch () {
    return this.spotHeadForm.get('strategy').value === 'twitch';
  }

  isStreamable () {
    return this.spotHeadForm.get('strategy').value === 'streamable';
  }

  isVimeo () {
    return this.spotHeadForm.get('strategy').value === 'vimeo';
  }

  isReddit () {
    return this.spotHeadForm.get('strategy').value === 'reddit';
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

    if (this.isTwitch()) {
      if (url.startsWith("https://clips.twitch.tv/")) {
        videoId = url.substr(24);
      } else {
        videoId = url;
      }
      this.twitchDetailForm.get('videoId').setValue(videoId);
      this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://clips.twitch.tv/embed?clip=" + videoId);
      console.log(this.safeVidUrl);
      return;
    }

    if (this.isStreamable()) {
      if (url.startsWith("https://streamable.com/")) {
        videoId = url.substr(23);
        if (url.startsWith("https://streamable.com/e/")) {
          videoId = url.substr(25);
        }
      } else {
        videoId = url;
      }
      this.streamableDetailForm.get('videoId').setValue(videoId);
      this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://streamable.com/e/" + videoId);
      console.log(this.safeVidUrl);
      return;
    }

    if (this.isVimeo()) {
      if (url.startsWith("https://vimeo.com/")) {
        videoId = url.substr(18);
      } else if (url.startsWith("https://player.vimeo.com/video/")) {
        videoId = url.substr(31);
      } else {
        videoId = url;
      }

      this.vimeoDetailForm.get('videoId').setValue(videoId);
      this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/" + videoId);
      console.log(this.safeVidUrl);
      return;
    }

    if (this.isReddit()) {
      let bIsReddit = false;
      if (url.startsWith("https://www.reddit.com/")) {
        bIsReddit = true;
        videoId = url.substr(23);
        let indexOfComments = videoId.indexOf("/comments/"),
          startOfId = indexOfComments + "/comments/".length,
          restOfUrl = videoId.substr(startOfId),
          endOfId = restOfUrl.indexOf("/");
        videoId = restOfUrl.substr(0, endOfId);
        this.redditDetailForm.get('videoId').setValue(videoId);
      } else if (url.startsWith("https://redd.it/")) {
        bIsReddit = true;        
        videoId = url.substr(16);
        this.redditDetailForm.get('videoId').setValue(videoId);
      } 

      console.log("videoid: "+ videoId);
      
      if (bIsReddit) {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.reddit.com/mediaembed/" + videoId);
      } else {
        this.safeVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
        this.redditDetailForm.get('videoId').setValue("");
      }
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
    // if the user has selected twitch, the twitchDetailForm needs to be valid
    if ((strategy === 'twitch') && !this.twitchDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great twitch video!');
      return;
    }
    // if the user has selected streamable, the streamableDetailForm needs to be valid
    if ((strategy === 'streamable') && !this.streamableDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great streamable video!');
      return;
    }
    // if the user has selected vimeo, the vimeoDetailForm needs to be valid
    if ((strategy === 'vimeo') && !this.vimeoDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great vimeo video!');
      return;
    }
    // if the user has selected reddit, the redditDetailForm needs to be valid
    if ((strategy === 'reddit') && !this.redditDetailForm.valid) {
      this.presentToast('Please fill out all the mandatory fields so we can process your great reddit video!');
      return;
    }
    debugger;
    this.saveButtonDisabled = true;
    var oSpot = {
      title : title,
      strategy : strategy,
      tags : tags,
      videoId : null,

      // optional properties for youtube
      startSeconds : null,
      endSeconds : null
    };
    if (strategy === "youtube") {
      oSpot.videoId = this.youtubeDetailForm.get('videoId').value;
      oSpot.startSeconds = parseInt(this.youtubeDetailForm.get('startSeconds').value, 10);
      oSpot.endSeconds = parseInt(this.youtubeDetailForm.get('endSeconds').value, 10);
    } 
    if (strategy === "gfycat") {
      oSpot.videoId = this.gfycatDetailForm.get('videoId').value;
    }
    if (strategy === "twitch") {
      oSpot.videoId = this.twitchDetailForm.get('videoId').value;
    }
    if (strategy === "streamable") {
      oSpot.videoId = this.streamableDetailForm.get('videoId').value;
    }
    if (strategy === "vimeo") {
      oSpot.videoId = this.vimeoDetailForm.get('videoId').value;
    }
    if (strategy === "reddit") {
      oSpot.videoId = this.redditDetailForm.get('videoId').value;
    }

    this.spotIdData.submitSpot(oSpot).then((spot: any) => {
      if (spot) {
        this.presentToast('Spot successfully created. Lean back while we verify your great spot!');
      } else {
        this.presentToast('Please log in before submitting a spot');
      }
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
