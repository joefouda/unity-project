import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PolicyComponent } from './policy.component';
import { ENComponent } from './en/en.component';
import { ARComponent } from './ar/ar.component';

export const routes: Routes = [
  {
    path: '',
    component: PolicyComponent,
    children: [
      {
        path: 'ar',
        component: ARComponent,
      },
      {
        path: 'en',
        component: ENComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule {
}
