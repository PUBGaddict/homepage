import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class HostageData {
  dataHostage: any;

  constructor(public http: Http) { }

  private loadHostageMaps(): any {
    return this.http.get('https://csgospots-1f294.firebaseio.com/menu.json')
    .map(data => {
      let jsonData = data.json(),
          csMaps = [];
      for (let key in jsonData) {
        if(jsonData.hasOwnProperty(key)) {
          if (key.startsWith("cs_")) {
            let amount = 0;
            for (let child in jsonData[key]) {                  
                amount += jsonData[key][child];                  
            }
            csMaps.push({mapname : key, amount : amount});
          }
        }
      }
      return csMaps;
    });
  }

  getHostageMaps() {
    return this.loadHostageMaps();
  }
}
