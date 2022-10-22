import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbSpinnerModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
} from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbSpinnerModule,
    NbListModule,
    NbProgressBarModule,
    NgxChartsModule,
    ZXingScannerModule,
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
