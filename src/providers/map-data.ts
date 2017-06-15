import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapData {
  private mapCache: any = {};

  constructor(public http: Http) { }

  private loadMap(mapname: string): Observable<any> {
    if (this.mapCache[mapname]) {
      return Observable.of(this.mapCache[mapname]);
    } else {
      return this.http.get('/assets/data/'  + mapname + '.json')
        .map(this.processMapData.bind(this));
    }
  }

  processMapData (data: any) {
    let map = data.json();
    this.mapCache[map.mapname] = map;
    return map || { };
  }
     
  getMap(mapname: string) : Observable<any> {
    return this.loadMap(mapname);
  }
  
  getIntentionFromMap (map: any, intentionName: string) {
    if (!map || !intentionName) {
      return;
    }

    if (!!map[intentionName]) {
      return map[intentionName];
    }
    return {};
  }

  getStrategyFromIntention (intention: any, strategyId: string) {
    if (!intention || !strategyId) {
      return {};
    }

    for (let strategy of intention) {
      if (strategy.id === strategyId) {
        return strategy;
      }
    }
    return {};
  }

  getSpotFromStrategy (strategy: any, spotId: string) {
    if (!strategy || !spotId) {
      return {};
    }

    for (let spot of strategy.spots) {
      if (spot.id === spotId) {
        return spot;
      }
    }
    return {};
  }
}
