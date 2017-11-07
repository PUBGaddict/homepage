import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';

import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class SpotData {
  private mapCache: any = {};
  private spotCacheSingle: any = {};
  private spotCacheQuery: any = {};
  private spotCacheShallowKeys: any = [];
  private lastKey = "";
  private lastValue = "";

  constructor(public http: Http, public angularFireDatabase: AngularFireDatabase, public fireStore : AngularFirestore) { }

  private loadSpot(spotId: string): Promise<any> {
    if (spotId in this.spotCacheSingle) {
      console.log("loading single from cache");
      return Promise.resolve(this.spotCacheSingle[spotId]);
    } else {
      return this.fireStore.doc(`fspots/${spotId}`).valueChanges().first().map((spot : any) => {
        this.spotCacheSingle[spotId] = spot;
        return spot;
      }).toPromise();
    }
  }

  public getSpot(spotId: string) : Promise<any> {
    return this.loadSpot(spotId);
  }

  public getUnpublishedSpots() : Observable<any> {
    let path = 'unpublished'
    if (path in this.spotCacheQuery) {
      console.log("loading query from cache");
      return Observable.of(this.spotCacheQuery[path]);
    } else {
      return this.fireStore.collection(`fspots`, ref => {
          return ref.where('path', '==', path);
        }).valueChanges().map((data : any) => {
          let spots = [];
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              spots.push(data[key]);
            }
          }
          this.spotCacheQuery[path] = spots;
          Object.assign(this.spotCacheSingle, spots);
          return spots;
        })
      } 
  }

  public getNextSpot(category: string, spotId: string) : Observable<any>{  
    const queryObservable = this.angularFireDatabase.list('/fspots',
      ref => ref.orderByChild('path').startAt(category, spotId).limitToFirst(2));

    return queryObservable.valueChanges().map(spots => {
      return spots[1];
    });
  }

  public getPreviousSpot(category: string, spotId: string) {
    const queryObservable = this.angularFireDatabase.list('/fspots', 
      ref => ref.orderByChild('path').endAt(category, spotId).limitToLast(2));

    return queryObservable.valueChanges().map(spots => {
      return spots[0];
    });
  }

  public getRandomSpot(): Promise<any> {
    return new Promise((resolve, reject) => {

      // is shallow list cached?
      if (this.spotCacheShallowKeys.length > 0) {
        console.log("getting random spot from shallow cache");
        let randomIndex = Math.floor(Math.random() * this.spotCacheShallowKeys.length);
        let key = this.spotCacheShallowKeys[randomIndex];
        this.getSpot(key).then(spot => {
          if (!!spot.published) {
            resolve(spot);
          } else {
            resolve(this.getRandomSpot());
          }
        });


        // no cache
      } else {
        this.http.get(firebaseConfig.databaseURL + '/fspots.json?shallow=true')
          .map(data => {
            this.spotCacheShallowKeys = Object.keys(data.json());
            let keys = this.spotCacheShallowKeys;
            let randomIndex = Math.floor(Math.random() * keys.length);
            return keys[randomIndex];
          }).toPromise().then(key => {
            this.getSpot(key).then(spot => {
              if (!!spot.published) {
                resolve(spot);
              } else {
                resolve(this.getRandomSpot());
              }
            });
          });
      }
    });
  }
}
