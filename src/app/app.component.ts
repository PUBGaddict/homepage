import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MapData } from '../providers/map-data';
import { DefusalData } from '../providers/defusal-data';

import { WelcomePage } from '../pages/welcome/welcome';
import { SelectPage } from '../pages/select/select';

import { ResultPage } from '../pages/result/result';
import { StrategyDetailPage } from '../pages/strategy-detail/strategy-detail'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = WelcomePage;
  @ViewChild(Nav) nav: Nav;
  @ViewChild('searchBar') searchBar: any;

  de_maps: any[] = [];
  cs_maps: any[] = [];

  constructor(platform: Platform, public defusalData : DefusalData ,public mapData : MapData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });

    this.defusalData.getDefusalMaps().subscribe((de_maps: any[]) => {
      if (de_maps.length === 0) {
        de_maps.push({mapname : "coming soon :)"})
      }
      this.de_maps = de_maps;
    });
  }

  randomSpot() {
    this.mapData.getRandomSpot().then((spot) => {
      this.nav.push(StrategyDetailPage, {
        spotId : spot.id
      });
    });
  }

  openPage (basicmap) {
     // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(SelectPage, { mapName: basicmap.mapname });

    /*this.nav.setRoot(SelectPage, {
      mapName: basicmap.mapname
    });*/
  }

  search (event) {
    let val = event.target.value;
    var that = this;
    if (val && val.trim() != '' && val.length > 1) {
      // if not yet displaying result page in details section, display it and switch to the other searchinput
      this.searchBar.value = "";
      this.nav.setRoot(ResultPage, { query: val });
    }
  }
}
