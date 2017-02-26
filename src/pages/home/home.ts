import { Component, ViewChild } from '@angular/core';

import { NavController, Nav } from 'ionic-angular';
import { SelectPage } from '../select/select';
import { MapData } from '../../providers/map-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  selectPage = SelectPage;
  maps: any[] = [];

  constructor(public navCtrl: NavController, public mapData: MapData) {
    this.mapData.getMaps().subscribe((maps: any[]) => {
      this.maps = maps;
    });
  }

  openPage (map) {
    this.nav.setRoot(SelectPage, {map});
  }

}
