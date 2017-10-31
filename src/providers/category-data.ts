import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class CategoryData {

  //currentLowestValue : number = 0;
  categorySet = {};
  //allCategories : Array<any> = [];
  lastKey : string = "";
  lastValue : number;

  constructor(public http: Http, public angularFireDatabase: AngularFireDatabase, public fireStore: AngularFirestore) { }

  getNextCategories() : Observable<any> {
    let maxValue = 99999999999999;
    let endAt = !!this.lastKey ? { value: this.lastValue, key: this.lastKey } : maxValue;

    return this.fireStore.collection(`menu`, ref => {
      return ref.orderBy('amount', 'asc').endAt(endAt).limit(5);
    }).valueChanges().map((categories : any) => {
      return this.processCategories(categories);
    });

 /*    return this.angularFireDatabase.list('/menu',
      ref => ref.orderByChild('amount').endAt(endAt.toString()).limitToLast(5)
      ).valueChanges().map(categories => {
      return this.processCategories(categories);
    }); */
  }
  
  processCategories (data) {
    if (!!this.lastKey && data.length <= 1) {
      data = [];
    }

    if (!!this.lastKey) {
      data = data.slice(0, data.length - 1);
    }

    this.lastKey = data[0]['$key'];
    this.lastValue = data[0]['amount'];

    for (let i in data) {
      this.categorySet[data[i].$key] = {
        $key : data[i].$key,
        amount : data[i].amount
      }
    }
    var arr = Object.keys(this.categorySet).map(key => { return this.categorySet[key]});

    arr.sort((b, a) => {
      if (a['amount'] < b['amount']) return -1;
      if (a['amount'] > b['amount']) return 1;
      if (a['amount'] === b['amount']) {
        if (a['$key'] < b['$key']) return -1;
        if (a['$key'] > b['$key']) return 1;
        return 0;
      }
    });
    return arr;
  }
}
