import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class PatchnoteData {
  dataPatchnotes: any;
  constructor(public http: Http) { }

  private loadPatchnotes(): any {
    if (this.dataPatchnotes) {
      return Observable.of(this.dataPatchnotes);
    } else {
      return this.http.get('assets/data/patchnotes.json')
        .map(this.processPatchnotes);
    }
  }

  getPatchnotes() {
    return this.loadPatchnotes().map((data: any) => {
      return data;
    });
  }

  processPatchnotes (data: any) {
    this.dataPatchnotes = data;
    return this.dataPatchnotes.json();
  }

}
