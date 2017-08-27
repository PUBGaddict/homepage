import { Injectable } from '@angular/core';
import { firebaseConfig } from '../../app/app.module';
import { Http } from '@angular/http';
import { AuthServiceProvider } from '../auth-service/auth-service'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {
  constructor(public http: Http, public authService : AuthServiceProvider) { }
  
  private submitUser(user : any): Observable<any> {
    return this.http.post(firebaseConfig.databaseURL + '/tempuser.json', user)
      .map(data => {
        return data.json()
      });
  }

  createUser(user : any) : Promise<any>{
    return this.submitUser(user).toPromise();
  }

/*   private loadUid (displayName : string) : Promise<any>{
   return this.http.get(`https://pubgaddicts-b4ff7.firebaseio.com/displayNames/${displayName}.json`)
    .map(data => {
      return data.json()
    }).toPromise(); 
  } */

  private loadSpots (displayName : string) : Promise<any> {
    return this.http.get(`https://pubgaddicts-b4ff7.firebaseio.com/fspots.json?orderBy="displayName"&equalTo="${displayName}"`)
    .map(data => {
      return data.json()
    }).toPromise(); 
  }

/*   private checkDisplayNameAlreadyExisting (displayName : string) : Promise<boolean> {
    return this.http.get(`https://pubgaddicts-b4ff7.firebaseio.com/uids.json?orderBy="displayName"&equalTo=${displayName}"`)
    .map(data => {
      return data.json()
    }).toPromise(); 
  } */

  getUserSpots(displayName : string) : Promise<any>{
    return this.loadSpots(displayName).then((spots : any) => {
        return spots;
    })
  }

/*   getUserAlreadyExisting(displayName : string) : Promise<boolean> {
    return this.checkDisplayNameAlreadyExisting(displayName);
  } */
}
