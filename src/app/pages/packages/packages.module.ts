import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbRouteTabsetModule,
  NbIconModule,
  NbActionsModule,
  NbSpinnerModule,
  NbBadgeModule,
  NbListModule,
  NbInputModule,
  NbAccordionModule,
  NbSelectModule,
  NbDialogModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    NbInputModule,
    ReactiveFormsModule,
    ThemeModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbListModule,
    NbAccordionModule,
    NbActionsModule,
    NbSpinnerModule,
    NbSelectModule,
    NbDialogModule,
    NbUserModule,
    PackagesRoutingModule,
    SharedModule,
  ],
  declarations: [
    PackagesComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class PackageesModule { }
