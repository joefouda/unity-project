import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PolicyRoutingModule } from './policy-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PolicyComponent } from './policy.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbAccordionModule, NbActionsModule, NbBadgeModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbRouteTabsetModule, NbSelectModule, NbSpinnerModule, NbStepperModule, NbUserModule } from '@nebular/theme';
import { ExportAsModule } from 'ngx-export-as';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ENComponent } from './en/en.component';
import { ARComponent } from './ar/ar.component';

@NgModule({
  imports: [
    CommonModule,
    PolicyRoutingModule,
    SharedModule,
    QRCodeModule,
    NgxDatatableModule,
    NbCardModule,
    FormsModule,
    NbInputModule,
    ReactiveFormsModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbListModule,
    NbDatepickerModule,
    NbStepperModule,
    NbActionsModule,
    NbSpinnerModule,
    NbSelectModule,
    NbDialogModule,
    NbAccordionModule,
    NbUserModule,
    SharedModule,
    ExportAsModule,
    NbLayoutModule
  ],
  declarations: [
    PolicyComponent,
    ENComponent,
    ARComponent,
  ]
})
export class PolicyModule {
}
