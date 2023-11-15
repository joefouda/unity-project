import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbRouteTabsetModule,
  NbSpinnerModule,
  NbListModule,
  NbInputModule,
  NbDialogModule,
  NbTimepickerModule,
  NbSelectModule,
  NbIconModule,
  NbDatepickerModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { UsersRoutingModule } from './generic-routing.module';
import { GenericComponent } from './generic.component';
import { SupportComponent } from './support/support.component';
import { SharedModule } from '../../shared/shared.module';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { SubsDetailsComponent } from './subs-details/subs-details.component';
import { BillingComponent } from './billing/billing.component';
import { PolicyComponent } from './policy/policy.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbAccordionModule,
    NbDialogModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbSpinnerModule,
    NbInputModule,
    NbTimepickerModule,
    NbSelectModule,
    NgxDatatableModule,
    NbListModule,
    NbUserModule,
    UsersRoutingModule,
    SharedModule,
    ExportAsModule,
    NbDatepickerModule,
    NgSelectModule,
    CKEditorModule,
  ],
  declarations: [
    GenericComponent,
    SupportComponent,
    CompanyProfileComponent,
    SubsDetailsComponent,
    BillingComponent,
    PolicyComponent
  ],
})
export class GenericModule { }
