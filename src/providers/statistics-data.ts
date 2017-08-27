import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StatisticsData {
  constructor(public http: Http) { }

  private loadStatistics(category) : Observable<Response> {
    return this.http.get(firebaseConfig.databaseURL + '/menu/' + category + '.json')
        .map(data => {return data.json()})
  }

  getStatistics(category): Observable<Response> {
    return this.loadStatistics(category);
  } 
}
