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
  NbSelectModule,
  NbDialogModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';

import { ThemeModule } from '../../@theme/theme.module';
import { PositionsRoutingModule } from './positions-routing.module';
import { PositionsComponent } from './positions.component';
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
    NbActionsModule,
    NbAccordionModule,
    NbSpinnerModule,
    NbSelectModule,
    NbDialogModule,
    NbUserModule,
    NgSelectModule,
    PositionsRoutingModule,
    SharedModule,
  ],
  declarations: [
    PositionsComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class PositionsModule { }

