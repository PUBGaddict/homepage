import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class CategoryData {

  //currentLowestValue : number = 0;
  categorySet = {};
  //allCategories : Array<any> = [];
  lastKey : string = "";
  lastValue : number;

  constructor(public http: Http, public angularFireDatabase: AngularFireDatabase) { }

  getNextCategories() : Observable<any> {
    let maxValue = 99999999999999;
    return this.angularFireDatabase.list('/menu', {
      query: {
        orderByChild: 'amount',
        endAt: !!this.lastKey ? { value: this.lastValue, key: this.lastKey } : maxValue,
        limitToLast: 5
      }
    }).map(categories => {
      categories.splice(categories.length - 1, 1);
      return this.processCategories(categories);
    });
  }
  
  processCategories (data) {
    if (data.length <= 0) {
      return [];
    }

    this.lastKey = data[0]['$key'];
    this.lastValue = data[0]['amount'];

    data.sort((b, a) => {
      if (a['amount'] < b['amount']) return -1;
      if (a['amount'] > b['amount']) return 1;
      return 0;
    });
    return data;
  }
}
