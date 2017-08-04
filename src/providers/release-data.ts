import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class ReleaseData {
  constructor(public http: Http) { }

  private loadReleaseCandidates() : Observable<Response> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/releaseCandidates.json')
        .map(data => {return data.json()})
  }

  getReleases(): Observable<Response> {
    return this.loadReleaseCandidates().map((data: any) => {
      return data;
    });;
  } 

  private loadReleaseCandidate (spotId : string) : Observable<Response> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/releaseCandidates/' + spotId + ".json")
        .map(data => {return data.json()})
  }

  getReleaseCandidate(spotId : string): Observable<Response> {
    return this.loadReleaseCandidate(spotId).map((data: any) => {
      return data;
    });;
  } 
}
