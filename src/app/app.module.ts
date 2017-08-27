import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SelectPage } from '../pages/select/select';
import { MapOverviewPage } from '../pages/map-overview/map-overview';
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


import { MapData } from '../providers/map-data';
import { DefusalData } from '../providers/defusal-data';
import { SpotIdData } from '../providers/spotid-data';
import { PatchnoteData } from '../providers/patchnote-data';
import { StatisticsData } from '../providers/statistics-data';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { YoutubePlayerComponent } from './youtube-player.component';
import { MapOverviewComponent } from './map-overview.component';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AuthComponent } from '../components/auth/auth';
import { UserProvider } from '../providers/user/user';

import { UsernameValidator } from '../validators/username';
import { SearchProvider } from '../providers/search/search';

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
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage,
    SubmitPage,
    YoutubePlayerComponent,
    MapOverviewComponent,
    ImpressumPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AuthComponent,
    UserPage,
    ResultPage,
    UnpublishedPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }, {
     links: [
       { component: SelectPage, name: 'Select', segment: 'maps/:mapName' },
       { component: MapOverviewPage, name: 'MapOverview', segment: 'maps/:mapName/:strategyId' },
       { component: StrategyDetailPage, name: 'StrategyDetail', segment: 's/:spotId' },
       { component: SubmitPage, name: 'SubmitPage', segment: 'submit' },
       { component: ImpressumPage, name: 'ImpressumPage', segment: 'impressum' },
       { component: LoginPage, name: 'LoginPage', segment: 'login' },
       { component: SignupPage, name: 'SignupPage', segment: 'signup' },
       { component: ResetPasswordPage, name: 'ResetPasswordPage', segment: 'reset-password' },
       { component: UserPage, name: 'UserPage', segment: 'user/:displayName' },
       { component: ResultPage, name: 'ResultPage', segment: 'result' },
       { component: UnpublishedPage, name: 'UnpublishedPage', segment: 'unpublished' }

      ]
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    SubmitPage,
    StrategyDetailPage,
    ImpressumPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    UserPage,
    ResultPage,
    UnpublishedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    MapData,
    PatchnoteData,
    DefusalData,
    SpotIdData,
    StatisticsData,
    AuthServiceProvider,
    UserProvider,
    UsernameValidator,
    SearchProvider]
})
export class AppModule {}
