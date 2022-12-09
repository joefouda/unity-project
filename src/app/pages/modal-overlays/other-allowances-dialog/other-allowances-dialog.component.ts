import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Page } from 'app/models/page';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ApiService } from 'app/providers/api.service';


@Component({
  selector: 'ngx-sdelete',
  templateUrl: 'other-allowances-dialog.component.html',
  styleUrls: ['other-allowances-dialog.component.scss'],
})
export class OtherAllowanceComponent {
  addMode = false

  types = ['allowance', 'deduction']

  @Input() allowances:any
  @Input() title: string;
  @Input() month: string;
  @Input() employee_id: string;
  token = localStorage.getItem('token');
  allowanceData = {
    name:'',
    name_ar:'',
    type:'',
    amount:'',
    month:'',
    employee_id:''
  }

  page = new Page();
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  constructor(protected ref: NbDialogRef<OtherAllowanceComponent>, private api: ApiService,) {}

  yes() {
    this.ref.close(false);
  }

  toggleAddMode(){
    this.addMode = !this.addMode
  }

  addOtherAllowance(){
    this.allowanceData.month = this.month
    this.allowanceData.employee_id = this.employee_id
    this.api.protectedPost('addOtherAllowances',this.allowanceData, this.token).subscribe((data) => {
      console.log(data)
      this.api.protectedGet(`getAllOtherAllowances?month=${this.allowanceData.month}&employee_id=${this.allowanceData.employee_id}`, this.token).subscribe((allowances: any) => {
        this.allowances = allowances
        console.log(allowances)
      })
      this.toggleAddMode()
      this.clearFields()
    }, err => {
    })
  }

  cancelAddition(){
    this.toggleAddMode()
    this.clearFields()
  }

  clearFields(){
    this.allowanceData = {
      name:'',
      name_ar:'',
      type:'',
      amount:'',
      month:this.allowanceData.month,
      employee_id:this.allowanceData.employee_id
    }
  }
}
