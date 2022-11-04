import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { UsersComponent } from './users.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    {
      path: '',
      component: IndexComponent,
    },
    {
      path: 'profile',
      component: ProfileComponent,
    },
    {
      path: 'add',
      component: AddComponent,
    },
    {
      path: 'edit/:id',
      component: AddComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}
