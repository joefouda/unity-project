import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoRoutingModule } from './demo-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DemoComponent } from './demo.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NbAccordionModule, NbActionsModule, NbBadgeModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbRouteTabsetModule, NbSelectModule, NbSpinnerModule, NbStepperModule, NbUserModule } from '@nebular/theme';
import { ExportAsModule } from 'ngx-export-as';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayrollComponent } from './demoPayroll/payroll.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    DemoRoutingModule,
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
    DemoComponent,
    PayrollComponent,
    HomeComponent,
  ]
})
export class DemoModule {
}
