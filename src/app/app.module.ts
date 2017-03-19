import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SelectPage } from '../pages/select/select';
import { MapOverviewPage } from '../pages/map-overview/map-overview';
import { WelcomePage } from '../pages/welcome/welcome';
import { StrategyDetailPage } from '../pages/strategy-detail/strategy-detail';

import { MapData } from '../providers/map-data';


@NgModule({
  declarations: [
    MyApp,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
     links: [
       { component: SelectPage, name: 'Select', segment: 'maps/:mapName' },
       { component: MapOverviewPage, name: 'MapOverview', segment: 'maps/:mapName/:strategyId/:intentionName' },
       { component: StrategyDetailPage, name: 'StrategyDetail', segment: 'maps/:mapName/:strategyId/:intentionName/:spotId' }
     ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectPage,
    MapOverviewPage,
    WelcomePage,
    StrategyDetailPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MapData]
})
export class AppModule {}
