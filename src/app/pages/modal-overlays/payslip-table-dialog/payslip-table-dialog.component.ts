import { Component, Input, SimpleChanges } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Page } from 'app/models/page';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ApiService } from 'app/providers/api.service';


@Component({
  selector: 'ngx-sdelete',
  templateUrl: 'payslip-table-dialog.component.html',
  styleUrls: ['payslip-table-dialog.component.scss'],
})
export class PaySlipComponent {

  @Input() payslipKeys:any
  @Input() title: string;
  page = new Page();
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  constructor(protected ref: NbDialogRef<PaySlipComponent>, private api: ApiService,) {
  }

  yes() {
    this.ref.close(false);
  }

}
