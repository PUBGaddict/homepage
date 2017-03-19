import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MapData } from '../providers/map-data';
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
  fy_maps: any[] = [];

  constructor(platform: Platform, public mapData : MapData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.mapData.getDefusalMaps().subscribe((de_maps: any[]) => {
      this.de_maps = de_maps;
    });
    this.mapData.getHostageMaps().subscribe((cs_maps: any[]) => {
      this.cs_maps = cs_maps;
    });
    this.mapData.getFunMaps().subscribe((fy_maps: any[]) => {
      this.fy_maps = fy_maps;
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
