import { Injectable } from '@angular/core';

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
    return this.http.get('https://csgospots-1f294.firebaseio.com/news.json')
      .map((data) => {
        return data.json();
      })
      .toPromise();
  }
  
  private downloadUrlContent (url) {
    return this.http.get(url)
      .map((data) => {
        return data.json();
      })
      .toPromise();
  }

  getInitialPatchNotes () : Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadNewestPatchNoteFile().then((news) => {
        this.newestPatchNoteFile = news.newestPatchNoteFile;
        this.nextPatchNoteFile = this.newestPatchNoteFile - 2;
        return this.getPatchNoteByNumber(this.newestPatchNoteFile)
      }).then((content) => {
        this.patchNotes.push(content);
        return this.getPatchNoteByNumber(this.newestPatchNoteFile - 1)
      }).then((content) => {
        this.patchNotes.push(content);
        resolve(this.patchNotes);        
      });
    });
  }

  getPatchNoteByNumber (number : number) {
    return this.firebaseApp.storage()
      .ref('n/p/' + number + '.json')
      .getDownloadURL()
      .then(url => {
        return this.downloadUrlContent(url);
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
