import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { NbToastrService, NbLayoutScrollService } from '@nebular/theme';
import { ExportAsService } from 'ngx-export-as';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { OtherAllowanceComponent } from '../../modal-overlays/other-allowances-dialog/other-allowances-dialog.component'

@Component({
  selector: 'ngx-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {
  altsrc = "assets/images/male-picture.png"
  imageUrl = "https://api.unisync.app/storage/employees/";
  queryParams = ""
  months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11","12"]
  netSalary = "0"
  keys = [
    { key: "basic", displayName: "Basic", value: "0" },
    { key: "allowances", displayName: "Allownces", value: "0" },
    { key: "unpaid_leaves", displayName: "Unpaid Leaves", value: "0" },
    { key: "GOSI", displayName: "GOSI", value: "0" },
    { key: "other_allowances_or_deductions", displayName: "View/Edit Other Allowences/Deductions", value: "0" },
  ]
  payslipData = {
    employee_id: "",
    basic: "0",
    allowances: "0",
    key: "0",
    GOSI: "0",
    other_allowances_or_deductions: "1",
    month: "",
    save: "0"
  }
  token: any;
  departments: [];
  searchDepartments: any
  employees: [];
  selectedEmployees: any;
  wantedEmployee = { id: '', full_name:'' }

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    private exportAsService: ExportAsService,
  ) {
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.searchDepartments = []
    this.selectedEmployees = []
    this.load();
  }

  load() {
    this.api.protectedGet("getAllCompanyDepartments", this.token).subscribe((data: any) => {
      console.log(data)
      this.departments = data
    });
  }

  getDepartmentsEmployees(event: any) {
    if (event.target.checked) {
      this.searchDepartments.push(event.target.value)
    }
    else {
      this.searchDepartments = this.searchDepartments.filter(department => {
        return department !== event.target.value
      })
    }
    let urlParams = this.searchDepartments.reduce((departments: any, dn: any, index: any) => {
      if (index !== this.searchDepartments.length - 1) {
        return departments + "departments[" + index + "]=" + dn + "&"
      }
      return departments + "departments[" + index + "]=" + dn

    }, '')
    this.api.protectedGet("getAllEmployeeDepartment?" + urlParams, this.token).subscribe((data: any) => {
      this.employees = data
      this.selectedEmployees = []
      this.wantedEmployee = { id: '', full_name:'' }
    });
  }

  addToSelectedEmployees(event) {
    if (event.target.checked) {
      this.selectedEmployees = [...this.selectedEmployees, ...this.employees.filter((employee: any) => {
        return employee.id == event.target.value
      })]
    }
    else {
      this.selectedEmployees = this.selectedEmployees.filter((employee: any) => {
        return employee.id != event.target.value
      })
    }
  }

  selectEmployee(event) {
    this.wantedEmployee = this.selectedEmployees.find(employee => employee.id == event.target.value)
    this.payslipData.employee_id = this.wantedEmployee.id
  }

  calculateNetSalary(key: any, event: any) {
    if (event.target.checked) {
      this.payslipData[key] = "1"
    } else {
      this.payslipData[key] = "0"
    }
    let values = Object.values(this.payslipData)
    let keys = Object.keys(this.payslipData)
    this.queryParams = keys.reduce((params: any, kn: any, index: any) => {
      if (index !== keys.length - 1) {
        return params + kn + "=" + values[index] + "&"
      }
      return params + kn + "=" + values[index]

    }, '')
    this.api.protectedGet("generatePayslip?" + this.queryParams, this.token).subscribe((data: any) => {
      this.netSalary = data.total
    });
  }

  // generatePayslip() {
  //   this.payslipData['save'] = "1"
  //   let values = Object.values(this.payslipData)
  //   let keys = Object.keys(this.payslipData)
  //   this.queryParams = keys.reduce((params: any, kn: any, index: any) => {
  //     if (index !== keys.length - 1) {
  //       return params + kn + "=" + values[index] + "&"
  //     }
  //     return params + kn + "=" + values[index]

  //   }, '')
  //   this.api.protectedGet("generatePayslip?" + this.queryParams, this.token).subscribe((data: any) => {
  //     this.netSalary = data.total
  //   });
  // }


  generatePayslip() {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        console.log(data)
        this.dialogService.open(DeleteComponent, {
          context: {
            title: 'Generate Payslip Confirmation',
            content: `Generating This Payslip will override month : ${this.payslipData.month} payslip record`,
          },
        }).onClose.subscribe((data) => {
          if(data){
            this.payslipData['save'] = "1"
            let values = Object.values(this.payslipData)
            let keys = Object.keys(this.payslipData)
            this.queryParams = keys.reduce((params: any, kn: any, index: any) => {
              if (index !== keys.length - 1) {
                return params + kn + "=" + values[index] + "&"
              }
              return params + kn + "=" + values[index]
  
            }, '')
  
            this.api.protectedGet("generatePayslip?" + this.queryParams, this.token).subscribe((data: any) => {
              this.netSalary = data.total
            });
          }
        });
      });
  }

  viewOtherAllowance(){
    this.api.protectedGet(`getAllOtherAllowances?month=${this.payslipData.month}&employee=${this.wantedEmployee.id}`, this.token).subscribe((allowances: any) => {
      console.log(allowances)
      this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.dialogService.open(OtherAllowanceComponent, {
          context: {
            title: 'Other Allowances/Deductions',
            data: {data:allowances, month:this.payslipData.month, employee_id:this.wantedEmployee.id},
          },
        }).onClose.subscribe((data) => {
          //
        });
      });
    });
  }

}
