import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';

import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';


interface Spot {
  videoId : string,
  title: string,
  strategy: string,
  id: string,
  displayName: string,
  path: string,
  published: boolean,
  rating: number,
  tags: object,
  
  thumbnailUrl? : string,
  startSeconds? : number,
  endSeconds? : number,
  redditVideo? : string
}

@Injectable()
export class SpotData {
  private mapCache: any = {};
  private spotCacheSingle: any = {};
  private spotCacheQuery: any = {};
  private spotCacheShallowKeys: any = [];
  private lastKey = "";
  private lastValue = "";

  constructor(public http: Http, public angularFireDatabase: AngularFireDatabase, public fireStore : AngularFirestore) { }

  private loadSpot(spotId: string): Promise<Spot> {
    if (spotId in this.spotCacheSingle) {
      console.log("loading single from cache");
      return Promise.resolve(this.spotCacheSingle[spotId]);
    } else {
      return new Promise((resolve, reject) => {
        this.fireStore.doc(`spots/${spotId}`).valueChanges().first().map((spot : Spot) => {
          return spot;
        }).toPromise().then((spot) => {
          return this.loadAdditionalData(spot);
        }).then(spot => {
          this.spotCacheSingle[spotId] = spot;          
          resolve(spot)
        })
      })
    }
  }

  private loadAdditionalData(spot : Spot) : Promise<Spot> {
    if (spot.strategy === 'youtube') {
      spot.thumbnailUrl = `http://img.youtube.com/vi/${spot.videoId}/mqdefault.jpg`;
      return Promise.resolve(spot);
    }
    if (spot.strategy === 'gfycat') {
      spot.thumbnailUrl = `https://thumbs.gfycat.com/${spot.videoId}-thumb100.jpg`;
      return Promise.resolve(spot);
    } 
    if (spot.strategy === 'streamable') {
      spot.thumbnailUrl = `https://cf-e2.streamablevideo.com/image/${spot.videoId}.jpg`;
      return Promise.resolve(spot);
      
    }
    if (spot.strategy === 'twitch') {
      let headers = new Headers();
      headers.append('Accept', 'application/vnd.twitchtv.v5+json')
      headers.append('Client-ID', '0a76rdy0iubpg9dvunt9l4hbsoc3o3')
      let options = new RequestOptions({
        headers: headers
      });
      
      return this.http.get(`https://api.twitch.tv/kraken/clips/${spot.videoId}`, new RequestOptions({
        headers: headers
      })).first().toPromise().then(twitchClip => {
        spot.thumbnailUrl = twitchClip.json().thumbnails.small;
        return spot;
      })
    }
    if (spot.strategy === 'reddit') {
      let slashIndex = spot.videoId.indexOf("/"),
        subreddit = spot.videoId.substr(0, slashIndex),
        articleId = spot.videoId.substr(slashIndex + 1);
      return this.http.get(`https://www.reddit.com/r/${subreddit}/comments/${articleId}/.json?limit=1`).first().toPromise().then(redditData => {
        let article = redditData.json();
        spot.thumbnailUrl = article[0].data.children[0].data.thumbnail;
        spot.redditVideo = article[0].data.children[0].data.media.reddit_video.fallback_url;
        return spot;
      })
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
      return this.fireStore.collection(`spots`, ref => {
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
    const queryObservable = this.angularFireDatabase.list('/spots',
      ref => ref.orderByChild('path').startAt(category, spotId).limitToFirst(2));

    return queryObservable.valueChanges().map(spots => {
      return spots[1];
    });
  }

  public getPreviousSpot(category: string, spotId: string) {
    const queryObservable = this.angularFireDatabase.list('/spots', 
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
        this.http.get(firebaseConfig.databaseURL + '/spots.json?shallow=true')
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
