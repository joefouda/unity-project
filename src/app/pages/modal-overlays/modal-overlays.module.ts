import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbInputModule,
  NbPopoverModule,
  NbSelectModule,
  NbTabsetModule,
  NbTooltipModule,
  NbWindowModule,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';

// modules
import { ThemeModule } from '../../@theme/theme.module';
import { ModalOverlaysRoutingModule } from './modal-overlays-routing.module';

// components
import { ModalOverlaysComponent } from './modal-overlays.component';
import { DialogComponent } from './dialog/dialog.component';
import { ShowcaseDialogComponent } from './dialog/showcase-dialog/showcase-dialog.component';
import { WindowComponent } from './window/window.component';
import { WindowFormComponent } from './window/window-form/window-form.component';
import { ToastrComponent } from './toastr/toastr.component';
import { PopoversComponent } from './popovers/popovers.component';
import {
  NgxPopoverCardComponent, NgxPopoverFormComponent,
  NgxPopoverTabsComponent,
} from './popovers/popover-examples.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { DeleteComponent } from './delete/delete.component';
import { OtherAllowanceComponent } from './other-allowances-dialog/other-allowances-dialog.component';
import { PaySlipComponent } from './payslip-table-dialog/payslip-table-dialog.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


const COMPONENTS = [
  ModalOverlaysComponent,
  ToastrComponent,
  DialogComponent,
  ShowcaseDialogComponent,
  WindowComponent,
  WindowFormComponent,
  PopoversComponent,
  NgxPopoverCardComponent,
  NgxPopoverFormComponent,
  NgxPopoverTabsComponent,
  TooltipComponent,
  DeleteComponent,
  SelectUserComponent,
  OtherAllowanceComponent,
  PaySlipComponent
];

const ENTRY_COMPONENTS = [
  ShowcaseDialogComponent,
  WindowFormComponent,
  NgxPopoverCardComponent,
  NgxPopoverFormComponent,
  NgxPopoverTabsComponent,
  DeleteComponent,
  SelectUserComponent,
  OtherAllowanceComponent,
  PaySlipComponent
];

const MODULES = [
  ThemeModule,
  ModalOverlaysRoutingModule,
  NbDialogModule.forChild(),
  NbWindowModule.forChild(),
  NbCardModule,
  NbCheckboxModule,
  NgSelectModule,
  NbTabsetModule,
  FormsModule,
  NbPopoverModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule,
  SharedModule,
  NgxDatatableModule
];

const SERVICES = [
  
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    ...SERVICES,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ModalOverlaysModule {
}
