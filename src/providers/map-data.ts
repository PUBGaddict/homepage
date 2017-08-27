import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';



@Injectable()
export class MapData {
  private mapCache: any = {};
  private spotCacheSingle: any = {};
  private spotCacheQuery: any = {};

  constructor(public http: Http) { }

  private loadSpot(spotId : string): Observable<any> {
    if (spotId in this.spotCacheSingle) {
      console.log("loading single from cache");
      return Observable.of(this.spotCacheSingle[spotId]);
    } else {
      return this.http.get('https://pubgaddicts-b4ff7.firebaseio.com/fluffs/'
         + spotId + '.json')
        .map((data) => {
          let spot = data.json();
          this.spotCacheSingle[spotId] = spot;
          return spot || { };
        });
    }
  }

  public getSpot(spotId : string) {
    return this.loadSpot(spotId);
  }

  private loadSpots(path: string): Observable<any> {
    if (path in this.spotCacheQuery) {
      console.log("loading query from cache");
      return Observable.of(this.spotCacheQuery[path]);
    } else {
      return this.http.get('https://pubgaddicts-b4ff7.firebaseio.com/fluffs.json?orderBy="path"&equalTo="'
          + path + '"')
        .map((data) => {
          let spots = data.json();
          this.spotCacheQuery[path] = spots;
          Object.assign(this.spotCacheSingle, spots);
          return spots;
        });
    }
  }

  public getSpots(mapName : string, strategy : string) {
    return this.loadSpots(mapName + '/' + strategy);
  }

  public getUnpublishedSpots() {
    return this.loadSpots("unpublished");
  }
}
