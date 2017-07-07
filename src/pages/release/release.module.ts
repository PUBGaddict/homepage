import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReleasePage } from './release';

@NgModule({
  declarations: [
    ReleasePage,
  ],
  imports: [
    IonicPageModule.forChild(ReleasePage),
  ],
  exports: [
    ReleasePage
  ]
})
export class ReleasePageModule {}
