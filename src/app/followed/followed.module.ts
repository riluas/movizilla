import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FollowedPageRoutingModule } from './followed-routing.module';

import { FollowedPage } from './followed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FollowedPageRoutingModule
  ],
  declarations: [FollowedPage]
})
export class FollowedPageModule {}
