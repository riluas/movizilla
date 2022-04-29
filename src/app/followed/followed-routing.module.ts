import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollowedPage } from './followed.page';

const routes: Routes = [
  {
    path: '',
    component: FollowedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowedPageRoutingModule {}
