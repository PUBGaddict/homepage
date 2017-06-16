import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    ga('set', 'page', '/submit');
    ga('send', 'event', "page", "visit", "submit");

    console.log('ionViewDidLoad SubmitPage');
  }

}
