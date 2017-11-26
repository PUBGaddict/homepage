import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';
import { AuthServiceProvider } from './auth-service/auth-service'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/of';


@Injectable()
export class SpotIdData {
  constructor(public http: Http, public authService : AuthServiceProvider, public fireStore : AngularFirestore) { }

  private submitPost(data : any): Promise<any> {
      return this.fireStore.collection('temp').add(data);
  }

  submitSpot(data : any) : Promise<any>{
    if (this.authService.authenticated) {
      data.displayName = this.authService.currentUser.displayName;
      data.uid = this.authService.currentUser.uid;
      return this.submitPost(data); //.map((data: any) => {
      //   return data;
      // });
    } else {
      return Promise.resolve(null);
    }
  }

  processMapIdData(data) {
      return data.json();
  }
}
