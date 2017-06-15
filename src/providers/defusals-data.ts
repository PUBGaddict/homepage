import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapData {
  dataDefusal: any;
  dataHostage: any;
  private mapCache: any = {};

  constructor(public http: Http) { }

  private loadDefusalMaps(): any {
    if (this.dataDefusal) {
      return Observable.of(this.dataDefusal);
    } else {
      return this.http.get('assets/data/maps_de.json')
        .map(this.processDefusalMaps);
    }
  }

  getDefusalMaps() {
    return this.loadDefusalMaps().map((data: any) => {
      return data;
    });
  }

  processDefusalMaps (data: any) {
    this.dataDefusal = data;
    return this.dataDefusal.json();
  }
}
