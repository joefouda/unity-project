import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';

import { PendingRegistrationComponent } from './pending-registration.component';

const routes: Routes = [{
  path: '',
  component: PendingRegistrationComponent,
  children: [
    {
      path: '',
      component: IndexComponent,
    },
  ],
}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingRegistrationRoutingModule {
}
