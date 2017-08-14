import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class DefusalData {

  constructor(public http: Http) { }

  private loadDefusalMaps(): any {
      return this.http.get('https://csgospots-1f294.firebaseio.com/statistics.json')
        .map(data => {
          let jsonData = data.json(),
              deMaps = [];
          for (let sKey in jsonData) {
            if(jsonData.hasOwnProperty(sKey)) {
              if (sKey.startsWith("de_")) {
                deMaps.push({mapname : sKey});
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
