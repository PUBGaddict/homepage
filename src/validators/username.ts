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

		return this.http.get(`https://csgospots-dev-5747d.firebaseio.com/displayNames/${value}.json`)
			.map(data => {
				return data.json()
			}).toPromise().then((data) => {
				if (data) {
					return { "usernameAlreadyTaken" : true };
				} else {
					return null; // positive case
				}
			});
  }
}