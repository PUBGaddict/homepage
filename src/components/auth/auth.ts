import { Component } from '@angular/core';

/**
 * Generated class for the AuthComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'auth',
  templateUrl: 'auth.html'
})
export class AuthComponent {

  text: string;

  constructor() {
    console.log('Hello AuthComponent Component');
    this.text = 'Hello World';
  }

}
