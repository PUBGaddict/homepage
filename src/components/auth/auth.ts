import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';

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
  public userName : string = "" ;

  constructor(public navCtrl: NavController, public authServiceProvider : AuthServiceProvider, public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: firebase.User) => {
      this.userName = user && user.displayName ? user.displayName : "";
    });
  }

  logout () {
    this.authServiceProvider.logoutUser();
  }

  login () {
    this.navCtrl.setRoot(LoginPage);
  }
}
