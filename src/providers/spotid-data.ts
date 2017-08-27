import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';
import { AuthServiceProvider } from './auth-service/auth-service'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/of';


@Injectable()
export class SpotIdData {
  constructor(public http: Http, public authService : AuthServiceProvider) { }

  private submitPost(data : any): Observable<any> {
<<<<<<< HEAD
      return this.http.post('https://pubgaddicts-b4ff7.firebaseio.com/temp.json', data)
=======
      return this.http.post(firebaseConfig.databaseURL + '/temp.json', data)
>>>>>>> 3ac2f4a360462757b770f6577895961bde3541c1
        .map(this.processMapIdData);
  }

  submitSpot(data : any) {
    if (this.authService.authenticated) {
      data.displayName = this.authService.currentUser.displayName;
      data.uid = this.authService.currentUser.uid;
      return this.submitPost(data).map((data: any) => {
        return data;
      });
    } else {
      return Observable.empty();
    }
  }

  processMapIdData(data) {
      return data.json();
  }
}
