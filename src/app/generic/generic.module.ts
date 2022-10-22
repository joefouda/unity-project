import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenericRoutingModule } from './generic-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GenericComponent } from './generic.component';
import { GenerateComponent } from './generate/generate.component';
import { ThemeModule } from '../@theme/theme.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FoodicsSuccessComponent } from './foodics-success/foodics-success.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ThemeModule,
    GenericRoutingModule,
    SharedModule,
    QRCodeModule,
    NgxDatatableModule,
  ],
  declarations: [
    GenericComponent,
    GenerateComponent,
    FoodicsSuccessComponent,
  ]
})
export class GenericModule {
}
