import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StatisticsData {
  constructor(public http: Http) { }

  private loadStatistics(mapName) : Observable<Response> {
<<<<<<< HEAD
    return this.http.get('https://pubgaddicts-b4ff7.firebaseio.com/menu/' + mapName + '.json')
=======
    return this.http.get(firebaseConfig.databaseURL + '/menu/' + mapName + '.json')
>>>>>>> 3ac2f4a360462757b770f6577895961bde3541c1
        .map(data => {return data.json()})
  }

  getStatistics(mapName): Observable<Response> {
    return this.loadStatistics(mapName).map((data: any) => {
      return data;
    });;
  } 
}
