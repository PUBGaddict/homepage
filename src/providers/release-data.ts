import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class ReleaseData {
  constructor(public http: Http) { }

  private loadReleases(): Observable<Response> {
      return this.http.get('https://csgospots-1f294.firebaseio.com/spots/de_dust2/smoke.json?orderBy=%22published%22&endAt=false')
        .map(data => {return data.json()});
  }

  private loadReleaseLocations(): Observable<Response> {
      return this.http.get('https://csgospots-1f294.firebaseio.com/locations/de_dust2/smoke.json?orderBy=%22published%22&endAt=false')
        .map((data) => {return data.json()});
  }

  getReleases(): Observable<Response[]> {
    return Rx.Observable.forkJoin([this.loadReleases(),this.loadReleaseLocations()]);
  }
}
