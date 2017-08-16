import { FormControl } from '@angular/forms';

export class UsernameValidator {
  
  static isValid(control: FormControl){

    let value = control.value;    
    if (!value){
      return { "username is empty" : true };
    }

    if (value.replace(new RegExp(' ', 'g'), '').length < 3) {
			return { "username is too short" : true };
		}
		
		// check if username already existing
    
    return null;
  }
}