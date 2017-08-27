import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StatisticsData {
  constructor(public http: Http) { }

  private loadStatistics(mapName) : Observable<Response> {
    return this.http.get(firebaseConfig.databaseURL + '/menu/' + mapName + '.json')
        .map(data => {return data.json()})
  }

  getStatistics(mapName): Observable<Response> {
    return this.loadStatistics(mapName).map((data: any) => {
      return data;
    });;
  } 
}
