import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class CategoryData {

  currentLowestValue : number = 0;
  categorySet = {};
  allCategories : Array<any> = [];
  lastId : string = "";

  constructor(public http: Http) { }

  private processCategories (items) {

  }

  getNextCategories() : Promise<any> {
    return this.http.get(`${firebaseConfig.databaseURL}/menu.json?orderBy="key"&endAt="${this.lastId}"&limitToLast=10`)
    .map(items => {
      let categorySet = items.json();
      let arr = [];
      for (let key in categorySet) {
        arr.push({category : key, amount : categorySet[key].amount, key : categorySet[key].key})
      }
      arr.sort((b,a) => {
        if(a.key < b.key) return -1;
        if(a.key > b.key) return 1;
        return 0;
      })
      this.lastId = arr[arr.length-1].key;  
      arr.splice(0,1);
      return arr;
    }).toPromise();
  }

  getInitialCategories() : Promise<any> {
    return this.http.get(`${firebaseConfig.databaseURL}/menu.json?orderBy="key"&limitToLast=20`)
    .map(rawItems => {
      let categorySet = rawItems.json();
      let arr = [];
      for (let key in categorySet) {
        arr.push({category : key, amount : categorySet[key].amount, key : categorySet[key].key})
      }
      arr.sort((b,a) => {
        if(a.key < b.key) return -1;
        if(a.key > b.key) return 1;
        return 0;
      })
      this.lastId = arr[arr.length-1].key;
      console.log("last id: " + this.lastId)
      return arr;
    }).toPromise();
  }
}
