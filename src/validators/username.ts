import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UsernameValidator {
	constructor(private http:Http){}
	
  isValid(control: FormControl) : Promise <any> {

		let value = control.value;    
    if (!value){
      return Promise.resolve({ "username is empty" : true });;
    }

		return this.http.get(`https://csgospots-1f294.firebaseio.com/uids.json?orderBy="displayName"&equalTo="${value}"`)
			.map(data => {
				return data.json()
			}).toPromise().then((data) => {
				debugger;
				if (Object.keys(data).length <= 0) {
					return null;
				} else {
					return { "usernameAlreadyTaken" : true };
				}
			});
  }
}