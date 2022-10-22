import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [{
  path: '',
  component: NotificationsComponent,
  children: [
    {
      path: '',
      component: IndexComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {
}
