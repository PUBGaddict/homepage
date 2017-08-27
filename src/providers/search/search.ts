import { Injectable } from '@angular/core';
import { firebaseConfig } from '../../app/app.module';
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
    return this.http.get(firebaseConfig.functionsURL + '/search?s=' + query).map(data => {
      let results = [];
      let o = data.json();
      for (var i in o) {
        let d = o[i];
        d.id = i;
        results.push(d);
      }
      return results;
    }).toPromise();
  }

}
