import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


import { DefusalData } from '../providers/defusal-data';



@Injectable()
export class MapData {
  private mapCache: any = {};
  private spotCacheSingle: any = {};
  private spotCacheQuery: any = {};

  constructor(public http: Http, public defusalData: DefusalData) { }

  private loadSpot(spotId: string): Observable<any> {
    if (spotId in this.spotCacheSingle) {
      console.log("loading single from cache");
      return Observable.of(this.spotCacheSingle[spotId]);
    } else {
      return this.http.get(firebaseConfig.databaseURL + '/fspots/'
        + spotId + '.json')
        .map((data) => {
          let spot = data.json();
          this.spotCacheSingle[spotId] = spot;
          return spot || {};
        });
    }
  }

  public getSpot(spotId: string) {
    return this.loadSpot(spotId);
  }

  private loadSpots(path: string): Observable<any> {
    if (path in this.spotCacheQuery) {
      console.log("loading query from cache");
      return Observable.of(this.spotCacheQuery[path]);
    } else {
      return this.http.get(firebaseConfig.databaseURL + '/fspots.json?orderBy="path"&equalTo="'
        + path + '"')
        .map((data) => {
          let spots = data.json();
          this.spotCacheQuery[path] = spots;
          Object.assign(this.spotCacheSingle, spots);
          return spots;
        });
    }
  }

  public getSpots(mapName: string, strategy: string) {
    return this.loadSpots(mapName + '/' + strategy);
  }

  public getUnpublishedSpots() {
    return this.loadSpots("unpublished");
  }

  public getNextSpot(mapName: string, strategy: string, spotId: string) {
    return this.loadSpots(mapName + '/' + strategy).toPromise().then((spots) => {
      let keys = Object.keys(spots);
      let currIndex = keys.findIndex(k => { return k === spotId; });
      if (currIndex + 1 < keys.length) {
        return spots[keys[currIndex + 1]];
      } else {
        return spots[keys[0]];
      }
    });
  }

  public getPreviousSpot(mapName: string, strategy: string, spotId: string) {
    return this.loadSpots(mapName + '/' + strategy).toPromise().then((spots) => {
      let keys = Object.keys(spots);
      let currIndex = keys.findIndex(k => { return k === spotId; });
      if (currIndex - 1 >= 0) {
        return spots[keys[currIndex - 1]];
      } else {
        return spots[keys[keys.length - 1]];
      }
    });
  }

  public getRandomSpot() {
    return this.defusalData.getDefusalMaps().toPromise().then((de_maps: any[]) => {
      let numberOfAllSpots = de_maps.map(m => {
        return m.amount;
      }).reduce((acc, amount) => {
        return acc + amount;
      });

      let randomIndex = Math.floor(Math.random() * numberOfAllSpots);
      return this.http.get(firebaseConfig.databaseURL + '/fspots.json?limitToFirst(' + 1 + ')&limitToLast(1)')
        .map((data) => {
          debugger;
          let spot = data.json();
          this.spotCacheSingle[spot.id] = spot;
          return spot || {};
        });
    });
  }
}
