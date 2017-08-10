import { FormControl } from '@angular/forms';
 
export class AdditionalPictureValidator {
 
    static isValid(control: FormControl): any {
        
        let value = control.value;
        if(value === "") {
            return null;
        }

        if(typeof value !== "string") {
            return {
                "not a string": true
            };
        }
 
        if(!value.endsWith(".jpg") && !value.endsWith(".png")){
            return {
                "not a supported format": true
            };
        }
 
        if(!value.startsWith("http://i.imgur.com/")){
            return {
                "image not hosted at imgur.com": true
            };
        }
 
        return null;
    }
 
}