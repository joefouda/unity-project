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
  NbDatepickerModule,
  NbListModule,
  NbInputModule,
  NbDialogModule,
  NbAccordionModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';
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
    NbSelectModule,
    NbAccordionModule,
    NbListModule,
    NbActionsModule,
    NbSpinnerModule,
    NbDialogModule,
    NbDatepickerModule,
    NbUserModule,
    CompaniesRoutingModule,
    SharedModule,
    ExportAsModule,
  ],
  declarations: [
    CompaniesComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class CompaniesModule { }
