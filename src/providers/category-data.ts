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

  getNextCategories() : Promise<any> {
    return this.http.get(`${firebaseConfig.databaseURL}/menu.json?orderBy="key"&endAt="${this.lastId}"&limitToLast=10`)
      .map(this.processCategories.bind(this))
      .toPromise();
  }
  
  processCategories (rawItems) {
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
    if (this.lastId !== "") {
      arr.splice(0,1);
    }
    this.lastId = arr.length > 0 ? arr[arr.length-1].key : "";  
    return arr;
  }

  getInitialCategories() : Promise<any> {
    return this.http.get(`${firebaseConfig.databaseURL}/menu.json?orderBy="key"&limitToLast=20`)
    .map(this.processCategories.bind(this))
    .toPromise();
  }
}
