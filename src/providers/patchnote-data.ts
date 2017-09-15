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
  newestPatchNoteFile : number = 0;
  nextPatchNoteFile : number = 0;

  constructor(public http: Http, public firebaseApp : FirebaseApp) { }

  private loadNewestPatchNoteFile () : Promise<any>{
    return this.http.get(firebaseConfig.databaseURL + '/news.json')
      .map((data) => {
        return data.json();
      })
      .toPromise();
  }
  
  private downloadUrlContent (url) : Promise<any>{
    return this.http.get(url)
    .map((data) => {
      return data.json();
    })
    .toPromise();
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
        this.newestPatchNoteFile = news.newestPatchNoteFile;
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
  
      this.firebaseApp.storage()
        .ref('n/p/' + number + '.json')
        .getDownloadURL()
        .then(url => {
          resolve(this.downloadUrlContent(url));
        })
    })
  }

  private loadPatchnotes(): Observable<any> {
    if (this.dataPatchnotes) {
      return Observable.of(this.dataPatchnotes);
    } else {
      return this.http.get('assets/data/patchnotes.json')
        .map(this.processPatchnotes);
    }
  }

  getPatchnotes() : Observable<any> {
    return this.loadPatchnotes();
  }

  processPatchnotes (data: any) {
    this.dataPatchnotes = data;
    return this.dataPatchnotes.json();
  }

}
