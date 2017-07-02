import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class SpotIdData {
  constructor(public http: Http) { }

  private loadUniqueSpotId(data : any): any {
    debugger;
      return this.http.post('https://us-central1-csgospots-1f294.cloudfunctions.net/getUniqueId', data)
        .map(this.processMapIdData);
  }

  getUniqueSpotId(data : any) {
    return this.loadUniqueSpotId(data).map((data: any) => {
      debugger;
      return data;
    });
  }

  processMapIdData(data) {
    debugger;
      return data.json();
  }
}
