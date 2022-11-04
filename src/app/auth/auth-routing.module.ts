import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  NbAuthComponent,
  NbLogoutComponent,
} from '@nebular/auth';
import { NgxLoginComponent } from './login/login.component'; // <---
import { ContinueComponent } from './continue/continue.component';
import { ResetComponent } from './reset/reset.component';
import { RegisterComponent } from './register/register.component';
import { NgxRequestPasswordComponent } from './request-password/request-password.component'; // <---


export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: NgxLoginComponent,
      },
      {
        path: 'continue/:token',
        component: ContinueComponent,
      },
      {
        path: 'reset/:token',
        component: ResetComponent, 
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NgxRequestPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}