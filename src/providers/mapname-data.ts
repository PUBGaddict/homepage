import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class MapnameData {

  constructor(public http: Http) { }
  
  private loadDefusalNames(): Observable<any> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/existing_maps.json?orderBy="$value"&equalTo="de"')
    .map((data) => {
      return data.json();
    });
  }

  public getDefusalNames() {
    return this.loadDefusalNames();
  }

  private loadHostageNames(): Observable<any> {
    return this.http.get('https://csgospots-1f294.firebaseio.com/existing_maps.json?orderBy="$value"&equalTo="cs"')
    .map((data) => {
      return data.json();
    });
  }

  public getHostageNames() {
    return this.loadHostageNames();
  }
}