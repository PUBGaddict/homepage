import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class DefusalData {

  constructor(public http: Http) { }

  private loadDefusalMaps(): any {
      return this.http.get('https://pubgaddicts-b4ff7.firebaseio.com/menu.json')
        .map(data => {
          let jsonData = data.json(),
              deMaps = [];
          for (let key in jsonData) {
            if(jsonData.hasOwnProperty(key)) {
              if (key.startsWith("de_")) {
                let amount = 0;
                for (let child in jsonData[key]) {                  
                    amount += jsonData[key][child];                  
                }
                deMaps.push({mapname : key, amount : amount});
              }
            }
          }
          return deMaps;
        });
  }

  getDefusalMaps() {
    return this.loadDefusalMaps();
  }
}
