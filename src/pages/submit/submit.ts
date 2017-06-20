import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DefusalData } from '../../providers/defusal-data';
import { HostageData } from '../../providers/hostage-data';

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
  de_maps: any[] = [];
  cs_maps: any[] = [];

  videoId: string = "";
  category: string = "";
  title: string = "";
  map: string = "";
  start: number = 0;
  end: number = 99;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public defusalData: DefusalData, public hostageData: HostageData) {
    this.defusalData.getDefusalMaps().subscribe((de_maps: any[]) => {
      this.de_maps = de_maps;
    });
    this.hostageData.getHostageMaps().subscribe((cs_maps: any[]) => {
      this.cs_maps = cs_maps;
    });
  }

  setVidUrl(sValue) {
    debugger;
  }

  refresh() {
    debugger;
  }

  logPress(event) {
    console.log(event);
  }

  ionViewDidLoad() {
    ga('set', 'page', '/submit');
    ga('send', 'event', "page", "visit", "submit");

    console.log('ionViewDidLoad SubmitPage');
  }

}
