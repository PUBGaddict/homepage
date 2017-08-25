import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StatisticsData {
  constructor(public http: Http) { }

  private loadStatistics(mapName) : Observable<Response> {
    return this.http.get('https://csgospots-dev-5747d.firebaseio.com/menu/' + mapName + '.json')
        .map(data => {return data.json()})
  }

  getStatistics(mapName): Observable<Response> {
    return this.loadStatistics(mapName).map((data: any) => {
      return data;
    });;
  } 
}
