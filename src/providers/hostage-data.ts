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
    return this.http.get('https://csgospots-1f294.firebaseio.com/statistics.json')
    .map(data => {
      let jsonData = data.json(),
          csMaps = [];
      for (let sKey in jsonData) {
        if(jsonData.hasOwnProperty(sKey)) {
          if (sKey.startsWith("cs_")) {
            csMaps.push({mapname : sKey});
          }
        }
      }
      if (csMaps.length === 0) {
        csMaps.push({mapname : "coming soon :)"})
      }
      return csMaps;
    });
  }

  getHostageMaps() {
    return this.loadHostageMaps();
  }
}
