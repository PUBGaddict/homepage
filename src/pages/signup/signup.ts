import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserProvider } from '../../providers/user/user';
import { WelcomePage } from '../welcome/welcome';
import { EmailValidator } from '../../validators/email';
import { UsernameValidator } from '../../validators/username';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;

  constructor(public nav: NavController, 
    public authProvider: AuthServiceProvider, 
    public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    public userProvider : UserProvider,
    public usernameValidator: UsernameValidator) {

    this.signupForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)]),this.usernameValidator.isValid.bind(this.usernameValidator)],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  // property getter for username, email and pw
  get username() { return this.signupForm.get('username'); }  
  get email() { return this.signupForm.get('email'); }  
  get password() { return this.signupForm.get('password'); }  

  ionViewDidLoad() {
    ga('set', 'page', '/signup');
    ga('send', 'event', "page", "visit", "signup");
  }

  /**
   * If the form is valid it will call the authProvider service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then((user) => {
        return this.userProvider.createUser({
          displayName : this.signupForm.value.username,
          uid : user.uid,
          email : user.email
        });
      })
      .then((pushId) => {
        return this.authProvider.addDisplayName(this.signupForm.value.username);
      })
      .then(() => {      
        this.nav.setRoot(WelcomePage);
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [{
                  text: "Ok",
                  role: 'cancel'
                }]
            });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }
}