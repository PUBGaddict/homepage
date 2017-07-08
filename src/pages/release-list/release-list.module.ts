import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReleaseListPage } from './release-list';

@NgModule({
  declarations: [
    ReleaseListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReleaseListPage),
  ],
  exports: [
    ReleaseListPage
  ]
})
export class ReleaseListPageModule {}
