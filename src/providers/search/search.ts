import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SearchProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SearchProvider {

  constructor(public http: Http) {
    console.log('Hello SearchProvider Provider');
  }

  search(query) : Promise<any> {
    return this.http.get('https://us-central1-csgospots-dev-5747d.cloudfunctions.net/search').map(data => {
      return data.json()
    }).toPromise();
  }

}
