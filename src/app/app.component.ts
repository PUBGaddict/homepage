import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CategoryData } from '../providers/category-data';

import { WelcomePage } from '../pages/welcome/welcome';
import { SelectPage } from '../pages/select/select';

import { ResultPage } from '../pages/result/result';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = WelcomePage;
  @ViewChild(Nav) nav: Nav;
  @ViewChild('searchBar') searchBar: any;

  categories: any[] = [];

  constructor(platform: Platform, public categoryData : CategoryData) {
    this.categoryData.getCategories().subscribe((categories: any[]) => {
      this.categories = categories;
    });
  }

  openPage (category) {
     // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(SelectPage, { category: category });
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
