import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MomentModule } from 'ngx-moment';

@NgModule({
    imports: [
        NgxSkeletonLoaderModule,
        MomentModule,
    ],
    exports: [
        CommonModule,
        TranslateModule,
        NgxSkeletonLoaderModule,
        MomentModule,
    ]
})
export class SharedModule { }