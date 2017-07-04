import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class SpotIdData {
  constructor(public http: Http) { }

  private submitPost(data : any): any {
    debugger;
      return this.http.post('https://csgospots-1f294.firebaseio.com/temp.json', data)
        .map(this.processMapIdData);
  }

  submitSpot(data : any) {
    return this.submitPost(data).map((data: any) => {
      return data;
    });
  }

  processMapIdData(data) {
      return data.json();
  }
}
