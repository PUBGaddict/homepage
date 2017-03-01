import { Component, ViewChild } from '@angular/core';

import { NavController, Nav } from 'ionic-angular';
import { SelectPage } from '../select/select';
import { WelcomePage } from '../welcome/welcome';
import { MapData } from '../../providers/map-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  selectPage = SelectPage;
  de_maps: any[] = [];
  cs_maps: any[] = [];
  fy_maps: any[] = [];

  constructor(public navCtrl: NavController, public mapData: MapData) {
    this.mapData.getDefusalMaps().subscribe((de_maps: any[]) => {
      this.de_maps = de_maps;
      this.nav.setRoot(WelcomePage);
    });
    this.mapData.getHostageMaps().subscribe((cs_maps: any[]) => {
      this.cs_maps = cs_maps;
    });
    this.mapData.getFunMaps().subscribe((fy_maps: any[]) => {
      this.fy_maps = fy_maps;
    });
  }

  openPage (basicmap) {
    let map = this.mapData.getMap(basicmap.mapname).subscribe((map) : any => {
      this.nav.setRoot(SelectPage, {map});
    });
  }

}
