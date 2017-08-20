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

    if (value.replace(new RegExp(' ', 'g'), '').length < 3) {
			return Promise.resolve({ "username is too short" : true });
		}

		return this.http.get(`https://csgospots-1f294.firebaseio.com/displayNames/${value}.json`)
			.map(data => {
				return data.json()
			}).toPromise().then((data) => {
				if (data) {
					return { "username already taken" : true };
				} else {
					return null; // positive case
				}
			});
  }
}