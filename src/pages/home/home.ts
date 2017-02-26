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
    
    this.nav.setRoot(SelectPage);
    /* else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }*/

    /*if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }*/
  }

}
