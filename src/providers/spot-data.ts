import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';



@Injectable()
export class SpotData {
  private mapCache: any = {};
  private spotCacheSingle: any = {};
  private spotCacheQuery: any = {};

  constructor(public http: Http) { }

  private loadSpot(spotId : string): Observable<any> {
    if (spotId in this.spotCacheSingle) {
      console.log("loading single from cache");
      return Observable.of(this.spotCacheSingle[spotId]);
    } else {
      return this.http.get(firebaseConfig.databaseURL + '/fspots/'
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
      return this.http.get(firebaseConfig.databaseURL + '/fspots.json?orderBy="path"&equalTo="'
          + path + '"')
        .map((rawData) => {
          let data = rawData.json(),
            spots = [];
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              spots.push(data[key]);
            } 
          }
          this.spotCacheQuery[path] = spots;
          Object.assign(this.spotCacheSingle, spots);
          return spots;
        });
    }
  }

  public getSpots(category) {
    return this.loadSpots(category);
  }

  public getUnpublishedSpots() {
    return this.loadSpots("unpublished");
  }

  public getNextSpot(mapName : string, strategy : string, spotId : string) {
    return this.loadSpots(mapName + '/' + strategy).toPromise().then( (spots) => {
      let keys = Object.keys(spots);
      let currIndex = keys.findIndex(k => { return k === spotId; });
      if (currIndex+1 < keys.length) {
        return spots[keys[currIndex+1]];
      } else {
        return spots[keys[0]];
      }
    });
  }

  public getPreviousSpot(mapName : string, strategy : string, spotId : string) {
    return this.loadSpots(mapName + '/' + strategy).toPromise().then( (spots) => {
      let keys = Object.keys(spots);
      let currIndex = keys.findIndex(k => { return k === spotId; });
      if (currIndex-1 >= 0) {
        return spots[keys[currIndex-1]];
      } else {
        return spots[keys[keys.length-1]];
      }
    });
  }

  getSpotsForTag(category : string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${firebaseConfig.databaseURL}/tags/${category}.json`).toPromise()
        .then((rawData) => {
          let data = rawData.json(),
            promises = [];

          if (Object.keys(data).length === 0 && data.constructor === Object) {
            reject("category is empty");
          }

          for (let key in data) {
            promises.push(this.loadSpot(key).toPromise())
          }
          Promise.all(promises).then((params) => {
            let resArr = params.map((d) => {return d.json()});
            resolve(resArr);
          });
        });
    }) 
  }
}
