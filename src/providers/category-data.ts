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
  lastId : string = "";

  constructor(public http: Http, public angularFireDatabase: AngularFireDatabase) { }

  getNextCategories() : Observable<any> {
    const queryObservable = this.angularFireDatabase.list('/menu', {
      query: {
        orderByChild: 'key',
        endAt: this.lastId,
        limitToLast: 5
      }
    });
    return queryObservable.map(categories => {
      categories.splice(categories.length-1,1);
      return this.processCategories(categories);
    });

   /*  return this.http.get(`${firebaseConfig.databaseURL}/menu.json?orderBy="key"&endAt="${this.lastId}"&limitToLast=10`)
      .map(this.processCategories.bind(this))
      .toPromise(); */
  }
  
  processCategories (categories) {
    for (let i in categories) {
      this.categorySet[categories[i].$key] = {
        category : categories[i].$key,
        amount : categories[i].amount,
        key : categories[i].key
      }
    }
    var arr = Object.keys(this.categorySet).map(key => { return this.categorySet[key]});
    arr.sort((b,a) => {
      if(a.key < b.key) return -1;
      if(a.key > b.key) return 1;
      return 0;
    })
   /*  if (this.lastId !== "") {
      arr.splice(0,1);
    } */
    this.lastId = arr.length > 0 ? arr[arr.length-1].key : "";  
    return arr;
  }

  getInitialCategories() : Observable<any> {
    const queryObservable = this.angularFireDatabase.list('/menu', {
      query: {
        orderByChild: 'key',
        limitToLast: 5
      }
    });

    return queryObservable.map(this.processCategories.bind(this));

   /*  return this.http.get(`${firebaseConfig.databaseURL}/menu.json?orderBy="key"&limitToLast=20`)
    .map(this.processCategories.bind(this))
    .toPromise(); */
  }
}
