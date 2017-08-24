import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';

/**
 * Generated class for the ResultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  @ViewChild('searchBar') searchBar: any;

  results : Array<any> = [];
  query : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public searchProvider : SearchProvider) {
    this.query = navParams.get("query");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
    this.setSearchbarValue(this.query);
  }

  setSearchbarValue (value) {
    this.searchBar.value = value;
    this.search();
    setTimeout(() => {
      this.searchBar.setFocus();
    },150);
  }

  search () {
    let val = this.searchBar.value;

    if (val && val.trim() != '' && val.length > 1) {
      // request search result from service
      this.searchProvider.search(val).then(results => {
        this.results = results;
      })
    } else {
      this.results = [];
    }
  }

}
