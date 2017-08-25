import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapData {
  private mapCache: any = {};
  private spotCache: any = {};

  constructor(public http: Http) { }

  private loadSpot(spotId : string): Observable<any> {
    if (this.spotCache[spotId]) {
      return Observable.of(this.spotCache[spotId]);
    } else {
      return this.http.get('https://csgospots-dev-5747d.firebaseio.com/fspots/'
         + spotId + '.json')
        .map((data) => {
          let spot = data.json();
          this.spotCache[spotId] = spot;
          return spot || { };
        });
    }
  }

  public getSpot(spotId : string) {
    return this.loadSpot(spotId);
  }

  private loadSpots(mapName : string, strategy : string): Observable<any> {
    return this.http.get('https://csgospots-dev-5747d.firebaseio.com/fspots.json?orderBy="path"&equalTo="'
        + mapName + '/' + strategy + '"')
      .map((data) => {
        return data.json();
      });
  }

  public getSpots(mapName : string, strategy : string) {
    return this.loadSpots(mapName, strategy);
  }
}
