import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CategoryData } from '../providers/category-data';
import { SpotData } from '../providers/spot-data';

import { WelcomePage } from '../pages/welcome/welcome';
import { SelectPage } from '../pages/select/select';

import { StrategyDetailPage } from '../pages/strategy-detail/strategy-detail'
import { PaginationProvider } from '../providers/pagination/pagination';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = WelcomePage;
  @ViewChild(Nav) nav: Nav;

  categories: any[] = [];
  noMoreCategories: boolean = false;

  constructor(platform: Platform, public categoryData : CategoryData, public spotData : SpotData, public paginationProvider : PaginationProvider) {
    this.paginationProvider.init('menu', 'amount', { reverse: true, prepend: false })
  }

  openPage (category) {
     // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(SelectPage, { category: category });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this.paginationProvider.more()
  }

  randomSpot() {
    this.spotData.getRandomSpot().then(spot => {
      this.nav.setRoot(StrategyDetailPage, { spotId : spot.id });
    });
  }
}
