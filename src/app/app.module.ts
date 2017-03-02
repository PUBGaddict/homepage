import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SelectPage } from '../pages/select/select';
import { MapOverviewPage } from '../pages/map-overview/map-overview';
import { WelcomePage } from '../pages/welcome/welcome';
import { StrategyDetailPage } from '../pages/strategy-detail/strategy-detail';

import { MapData } from '../providers/map-data';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MapData]
})
export class AppModule {}
