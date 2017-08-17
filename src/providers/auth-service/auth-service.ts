import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  private loggedInUser: firebase.User;
  
  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: firebase.User) => {
      this.loggedInUser = user
    });
  }

  get authenticated(): boolean {
    return this.loggedInUser !== null;
  }

  get currentUser(): firebase.User {
    return this.loggedInUser;
  }

  addDisplayName (displayName : string) {
    let obs = this.afAuth.authState.subscribe((user : firebase.User) => {
      obs.unsubscribe();
      return user.updateProfile({
        displayName: displayName,
        photoURL: ""
      });
    });
  }

  // email password
  loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  // facebook

  signInWithFacebook(): firebase.Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider());
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  displayName(): string {
    if (this.loggedInUser !== null) {
      return this.loggedInUser.displayName;
    } else {
      return '';
    }
  }
}
