import { Injectable } from '@angular/core';
import { firebaseConfig } from '../app/app.module';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';

import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';


@Injectable()
export class PatchnoteData {
  dataPatchnotes: any;
  patchNotes : Array<any> = [];
  nextPatchNoteFile : number = 0;
  
  // caches
  patchNoteCache : any = {};
  newestPatchNoteFile : number = 0;
  urlCache : any = {};

  constructor(public http: Http, public firebaseApp : FirebaseApp) { }

  private loadNewestPatchNoteFile () : Promise<any>{
    if ( this.newestPatchNoteFile ) {
      return Observable.of(this.newestPatchNoteFile).toPromise();
    } else {
      return this.http.get(firebaseConfig.databaseURL + '/news.json')
        .map((rawData) => {
          let data = rawData.json();
          this.newestPatchNoteFile = data.newestPatchNoteFile;          
          return data;
        })
        .toPromise();
    }
  }
  
  private downloadUrlContent (url, number) : Promise<any>{
    if (number in this.patchNoteCache) {
      return Observable.of(this.patchNoteCache[number]).toPromise();
    } else {
      return this.http.get(url)
        .map((rawData) => {
          let data = rawData.json();
          this.patchNoteCache[number] = data;
          return data;
        })
        .toPromise();
    }
  }

  public getNextPatchNotes () {
    let number = this.nextPatchNoteFile;
    if (this.nextPatchNoteFile > 0) {
      this.nextPatchNoteFile--;
    }
    return this.getPatchNoteByNumber(number);
  }

  public getInitialPatchNotes () : Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadNewestPatchNoteFile().then((news) => {
        this.nextPatchNoteFile = this.newestPatchNoteFile - 1;
        return this.getPatchNoteByNumber(this.newestPatchNoteFile)
      }).then((content) => {
        resolve([content]);        
      });
    });
  }

  getPatchNoteByNumber (number : number) {
    return new Promise((resolve, reject) => {
      if (!number || number < 0) {
        reject("no older patchnotes found");
      }
      
      let params = 'n/p/' + number + '.json';
      if ( params in this.urlCache ) {
        resolve(this.downloadUrlContent(this.urlCache[params], number));
      } else {
        this.firebaseApp.storage()
          .ref(params)
          .getDownloadURL()
          .then(url => {
            this.urlCache[params] = url;
            resolve(this.downloadUrlContent(url, number));
          })
      }
    })
  }
}
