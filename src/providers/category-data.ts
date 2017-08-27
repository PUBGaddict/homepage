import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class CategoryData {

  constructor(public http: Http) { }

  private loadCategories(): any {
      return this.http.get(firebaseConfig.databaseURL + '/menu.json')
        .map(data => {
          let jsonData = data.json(),
              categories = [];
          for (let key in jsonData) {
            if(jsonData.hasOwnProperty(key)) {
              categories.push({category : key, amount : jsonData[key]});
            }
          }
          return categories;
        });
  }

  getCategories() {
    return this.loadCategories();
  }
}
