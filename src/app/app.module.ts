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
import { ReleaseListPage } from '../pages/release-list/release-list';
import { ReleasePage } from '../pages/release/release';
import { ImpressumPage } from '../pages/impressum/impressum';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';

import { MapData } from '../providers/map-data';
import { DefusalData } from '../providers/defusal-data';
import { HostageData } from '../providers/hostage-data';
import { SpotIdData } from '../providers/spotid-data';
import { PatchnoteData } from '../providers/patchnote-data';
import { ReleaseData } from '../providers/release-data';
import { StatisticsData } from '../providers/statistics-data';
import { MapnameData } from '../providers/mapname-data';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { YoutubePlayerComponent } from './youtube-player.component';
import { MapOverviewComponent } from './map-overview.component';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AuthComponent } from '../components/auth/auth';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDIaR2jO4z66WRv_cA_8bzJw3QnoIqxkvA",
  authDomain: "csgospots-1f294.firebaseapp.com",
  databaseURL: "https://csgospots-1f294.firebaseio.com",
  storageBucket: "csgospots-1f294.appspot.com",
  messagingSenderId: "743445555111",
  projectId: "csgospots-1f294",
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
    ReleaseListPage,
    ReleasePage,
    ImpressumPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, {
     links: [
       { component: SelectPage, name: 'Select', segment: 'maps/:mapName' },
       { component: MapOverviewPage, name: 'MapOverview', segment: 'maps/:mapName/:strategyId' },
       { component: StrategyDetailPage, name: 'StrategyDetail', segment: 's/:spotId' },
       { component: SubmitPage, name: 'SubmitPage', segment: 'submit' },
       { component: ReleaseListPage, name: 'ReleaseListPage', segment: 'releaselist' },
       { component: ReleasePage, name: 'ReleasePage', segment: 'releaselist/:spotId' },
       { component: ImpressumPage, name: 'ImpressumPage', segment: 'impressum' },
       { component: LoginPage, name: 'LoginPage', segment: 'login' },
       { component: SignupPage, name: 'SignupPage', segment: 'signup' },
       { component: ResetPasswordPage, name: 'ResetPasswordPage', segment: 'reset-password' }
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
    ReleaseListPage,
    ReleasePage,
    ImpressumPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    MapData,
    PatchnoteData,
    DefusalData,
    HostageData,
    SpotIdData,
    ReleaseData,
    StatisticsData,
    MapnameData,
    AuthServiceProvider]
})
export class AppModule {}
