import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';

export const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.NgxAuthModule)
  },
  {
    path: 'g',
    loadChildren: () => import('./generic/generic.module').then(m => m.GenericModule)
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.module').then(m => m.DemoModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule)
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'pages', canActivate: [AuthGuard] },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
