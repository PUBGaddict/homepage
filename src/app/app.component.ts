import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MapData } from '../providers/map-data';
import { DefusalData } from '../providers/defusal-data';
import { HostageData } from '../providers/hostage-data';

import { WelcomePage } from '../pages/welcome/welcome';
import { SelectPage } from '../pages/select/select';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = WelcomePage;
  @ViewChild(Nav) nav: Nav;

  de_maps: any[] = [];
  cs_maps: any[] = [];

  constructor(platform: Platform, public defusalData : DefusalData,  public hostageData : HostageData ,public mapData : MapData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });

    this.defusalData.getDefusalMaps().subscribe((de_maps: any[]) => {
      this.de_maps = de_maps;
    });
    this.hostageData.getHostageMaps().subscribe((cs_maps: any[]) => {
      this.cs_maps = cs_maps;
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
}
