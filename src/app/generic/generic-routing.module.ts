import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateComponent } from './generate/generate.component';
import { GenericComponent } from './generic.component';
import { FoodicsSuccessComponent } from './foodics-success/foodics-success.component';


export const routes: Routes = [
  {
    path: '',
    component: GenericComponent,
    children: [
      {
        path: 'generate',
        component: GenerateComponent,
      },
      {
        path: 'foodics-success',
        component: FoodicsSuccessComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericRoutingModule {
}
