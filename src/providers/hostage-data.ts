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
    if (this.dataHostage) {
      return Observable.of(this.dataHostage);
    } else {
      return this.http.get('assets/data/maps_cs.json')
        .map(this.processHostageMaps);
    }
  }

  getHostageMaps() {
    return this.loadHostageMaps().map((data: any) => {
      return data;
    });
  }

  processHostageMaps (data: any) {
    this.dataHostage = data;
    return this.dataHostage.json();
  }
}
