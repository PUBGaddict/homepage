import { Component } from '@angular/core';
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

  results : Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public searchProvider : SearchProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

  search (event) {
    let val = event.target.value;

    if (val && val.trim() != '' && val.length > 1) {
      // request search result from service
      this.searchProvider.search(val).then(results => {
        this.results = results;
      })
    }
  }

}
