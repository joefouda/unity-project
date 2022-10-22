import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbRouteTabsetModule,
  NbIconModule,
  NbActionsModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbBadgeModule,
  NbListModule,
  NbInputModule,
  NbSelectModule,
  NbStepperModule,
  NbDialogModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ContinueComponent } from './continue.component';
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
    NbDatepickerModule,
    NbStepperModule,
    NbActionsModule,
    NbSpinnerModule,
    NbSelectModule,
    NbDialogModule,
    NbAccordionModule,
    NbUserModule,
    SharedModule,
  ],
  declarations: [
    ContinueComponent,
  ],
})
export class ContinueModule { }
