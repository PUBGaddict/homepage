import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SelectPage } from '../pages/select/select';
import { WelcomePage } from '../pages/welcome/welcome';
import { StrategyDetailPage } from '../pages/strategy-detail/strategy-detail';
import { SubmitPage } from '../pages/submit/submit';
import { ImpressumPage } from '../pages/impressum/impressum';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { UserPage } from '../pages/user/user';
import { ResultPage } from '../pages/result/result';
import { UnpublishedPage } from '../pages/unpublished/unpublished';
import { PublishPage } from '../pages/publish/publish';


import { SpotData } from '../providers/spot-data';
import { CategoryData } from '../providers/category-data';
import { SpotIdData } from '../providers/spotid-data';
import { PatchnoteData } from '../providers/patchnote-data';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { YoutubePlayerComponent } from './youtube-player.component';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AuthComponent } from '../components/auth/auth';
import { UserProvider } from '../providers/user/user';

import { UsernameValidator } from '../validators/username';
import { SearchProvider } from '../providers/search/search';

import { IonTagsInputModule } from "ionic-tags-input";

export const firebaseConfig = {
  apiKey: "AIzaSyBj7uFGKWDuKFDx_6nQOhMSRC0cx3vJpCI",
  authDomain: "pubgaddicts-b4ff7.firebaseapp.com",
  databaseURL: "https://pubgaddicts-b4ff7.firebaseio.com",
  projectId: "pubgaddicts-b4ff7",
  storageBucket: "pubgaddicts-b4ff7.appspot.com",
  messagingSenderId: "355134315397",
  functionsURL: "https://us-central1-pubgaddicts-b4ff7.cloudfunctions.net"
};

@NgModule({
  declarations: [
    MyApp,
    SelectPage,
    WelcomePage,
    StrategyDetailPage,
    SubmitPage,
    YoutubePlayerComponent,
    ImpressumPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AuthComponent,
    UserPage,
    ResultPage,
    UnpublishedPage,
    PublishPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }, {
     links: [
       { component: SelectPage, name: 'Select', segment: 'cat/:category' },
       { component: StrategyDetailPage, name: 'StrategyDetail', segment: 's/:spotId' },
       { component: SubmitPage, name: 'SubmitPage', segment: 'submit' },
       { component: ImpressumPage, name: 'ImpressumPage', segment: 'impressum' },
       { component: LoginPage, name: 'LoginPage', segment: 'login' },
       { component: SignupPage, name: 'SignupPage', segment: 'signup' },
       { component: ResetPasswordPage, name: 'ResetPasswordPage', segment: 'reset-password' },
       { component: UserPage, name: 'UserPage', segment: 'user/:displayName' },
       { component: ResultPage, name: 'ResultPage', segment: 'result' },
       { component: UnpublishedPage, name: 'UnpublishedPage', segment: 'unpublished' },
       { component: PublishPage, name: 'PublishPage', segment: 'u/:spotId' }
      ]
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonTagsInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectPage,
    WelcomePage,
    SubmitPage,
    StrategyDetailPage,
    ImpressumPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    UserPage,
    ResultPage,
    UnpublishedPage,
    PublishPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    SpotData,
    PatchnoteData,
    CategoryData,
    SpotIdData,
    AuthServiceProvider,
    UserProvider,
    UsernameValidator,
    SearchProvider]
})
export class AppModule {}
