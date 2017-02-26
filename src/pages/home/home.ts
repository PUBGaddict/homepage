import { Component, ViewChild } from '@angular/core';

import { NavController, Nav } from 'ionic-angular';
import { SelectPage } from '../select/select';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  selectPage = SelectPage;

  constructor(public navCtrl: NavController) {
  }

  openPage (sMap) {
    
    this.nav.setRoot(SelectPage, {sMap});
  }

}
