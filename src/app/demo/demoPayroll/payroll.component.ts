import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { NbToastrService, NbLayoutScrollService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ExportAsService } from 'ngx-export-as';
// import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
// import { OtherAllowanceComponent } from '../../modal-overlays/other-allowances-dialog/other-allowances-dialog.component'
import { PaySlipComponent } from 'app/pages/modal-overlays/payslip-table-dialog/payslip-table-dialog.component';

@Component({
  selector: 'ngx-demo-payroll',
  templateUrl: 'payroll.component.html',
  styleUrls: ['payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  messages
  loading = false
  altsrc = "assets/images/male-picture.png"
  imageUrl = "https://api.unisync.app/storage/employees/";
  queryParams = ""
  employee = false
  years = ["2022","2023"]
  months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  netSalary = "0"
  keys = [
    { key: "basic", displayName: "Basic", value: "0", employee: "1" },
    { key: "allowances", displayName: "Allownces", value: "0", employee: "1" },
    { key: "unpaid_leaves", displayName: "Unpaid Leaves", value: "0" },
    { key: "GOSI", displayName: "GOSI", value: "0", employee: "!" },
    { key: "other_allowances_or_deductions", displayName: "View/Edit Other Allowences/Deductions", value: "0", employee: "0" },
  ]

  originalPayslipKeys = [
    {
      actualKey: "date",
      arabicKey: "تاريخ الإنشاء",
      displayKey: "Payslip Generation Date"
    },
    {
      actualKey: "position",
      arabicKey: "المنصب",
      displayKey: "Position"
    },
    {
      actualKey: "department",
      arabicKey: "الإدارة",
      displayKey: "Department"
    },
    {
      actualKey: "joined_date",
      arabicKey: "تاريخ الإنضمام",
      displayKey: "Joind Date"
    },
    {
      actualKey: "employee_id",
      arabicKey: "هوية الموظف",
      displayKey: "Employee ID"
    },
    {
      actualKey: "contract_duration",
      arabicKey: "مدة العقد",
      displayKey: "Contract Duration"
    },
    {
      actualKey: "name",
      arabicKey: "الإسم",
      displayKey: "Name"
    },
    {
      actualKey: "unpaid_vacation",
      arabicKey: "الإجازات غير الدفوعة",
      displayKey: "Unpaid Leaves"
    },
    {
      actualKey: "basic_salary",
      arabicKey: "المرتب الأساسي",
      displayKey: "Basic Salary"
    },
    {
      actualKey: "allowances",
      arabicKey: "البدلات",
      displayKey: "Allowances"
    },
    {
      actualKey: "deductions",
      arabicKey: "حسميات",
      displayKey: "Deductions"
    },
    {
      actualKey: "other_allowances",
      arabicKey: "مكافئات أخرى",
      displayKey: "Other Allowances"
    },
    {
      actualKey: "gosi",
      arabicKey: "التأمينات الإجتماعية",
      displayKey: "GOSI"
    },
    {
      actualKey: "total",
      arabicKey: "الإجمالي",
      displayKey: "Total"
    },
  ]
  payslipKeys:any

  employeeKeys = [
    { key: "basic", displayName: "Basic", value: "0" },
    { key: "allowances", displayName: "Allownces", value: "0" },
    { key: "unpaid_leaves", displayName: "Unpaid Leaves", value: "0" },
    { key: "GOSI", displayName: "GOSI", value: "0" }
  ]
  payslipData = {
    employee_id: "",
    basic: "0",
    allowances: "0",
    key: "0",
    GOSI: "0",
    other_allowances_or_deductions: "0",
    month: "",
    year:"",
    save: "0"
  }
  token: any;
  departments: any;
  searchDepartments: any
  employees: any;
  selectedEmployees: any;
  wantedEmployee = { id: '', full_name: '' }

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    private exportAsService: ExportAsService,
  ) {
    this.payslipKeys = [...this.originalPayslipKeys]
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
  }


  ngOnInit(): void {
    this.searchDepartments = []
    this.selectedEmployees = []
    this.load()
  }

  load() {
      this.departments = [{id:1,name : 'Test Department'}]
  }

  getDepartmentsEmployees(event: any) {
    if (event.target.checked) {
      this.searchDepartments = [{id:1,name : 'Test Department'}]
      this.employees = [{id:1,full_name:'Test Employee', basic_salary:2000}]
    }
    else {
      // this.searchDepartments = this.searchDepartments.filter(department => {
      //   return department !== event.target.value
      // })
      this.employees = []
      this.searchDepartments = []
    }
    // let urlParams = this.searchDepartments.reduce((departments: any, dn: any, index: any) => {
    //   if (index !== this.searchDepartments.length - 1) {
    //     return departments + "departments[" + index + "]=" + dn + "&"
    //   }
    //   return departments + "departments[" + index + "]=" + dn

    // }, '')
    // this.api.protectedGet("getAllEmployeeDepartment?" + urlParams, this.token).subscribe((data: any) => {
    //   this.employees = data
    //   this.selectedEmployees = []
    //   this.wantedEmployee = { id: '', full_name: '' }
    // });
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

  // calculateNetSalary(key: any, event: any) {
  //   if (event.target.checked) {
  //     this.payslipData[key] = "1"
  //   } else {
  //     this.payslipData[key] = "0"
  //   }
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

  addToSelectedKeys(key: any, event: any) {
    if (event.target.checked) {
      this.payslipData[key] = "1"
    } else {
      this.payslipData[key] = "0"
    }
  }

  calculateNetSalaryOnMonthChange() {
    // console.log('changed')
    // let values = Object.values(this.payslipData)
    // let keys = Object.keys(this.payslipData)
    // this.queryParams = keys.reduce((params: any, kn: any, index: any) => {
    //   if (index !== keys.length - 1) {
    //     return params + kn + "=" + values[index] + "&"
    //   }
    //   return params + kn + "=" + values[index]

    // }, '')
    // this.api.protectedGet("generatePayslip?" + this.queryParams, this.token).subscribe((data: any) => {
    //   this.netSalary = data.total
    //   console.log(data)
    // });
  }

  generatePayslip() {
    console.log(this.payslipData)
    this.loading = true;
    let values = Object.values(this.payslipData)
    let keys = Object.keys(this.payslipData)
    if (values.some((value, index) => value === '1' && (keys[index] !== 'employee_id'))) {
      this.queryParams = keys.reduce((params: any, kn: any, index: any) => {
        if (index !== keys.length - 1) {
          return params + kn + "=" + values[index] + "&"
        }
        return params + kn + "=" + values[index]

      }, '')
      this.api.protectedGet("generatePayslip?" + this.queryParams, this.token).subscribe((data: any) => {
        let keys = Object.keys(data.payslip_data)
        this.payslipKeys = [...this.originalPayslipKeys]
        this.payslipKeys = this.payslipKeys.map((key, index)=> {
          if(keys.includes(key.actualKey)){
            return {...key, value:data.payslip_data[key.actualKey]}
          }
          return {...key}
        })
        this.netSalary = data.total
        this.dialogService.open(PaySlipComponent, {
          context: {
            title: 'PaySlip Information',
            payslipKeys:this.payslipKeys,
          },
        }).onClose.subscribe((data) => {
          //
        });
        this.loading = false;
        this.toastrService.success('Payslip Information', this.messages.SUCCESS_INFO, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      });
    } else {
      this.toastrService.danger('you must select one calculation atleast', this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      this.loading = false;
    }
  }

  ArchivePayslip() {
    // console.log(this.payslipData)
    // this.translate.get('TOAST_MESSAGES')
    //   .subscribe((data) => {
    //     this.dialogService.open(DeleteComponent, {
    //       context: {
    //         title: 'Archiving Payslip Confirmation',
    //         content: `Archiving This Payslip will override year : ${this.payslipData.year} ,month : ${this.payslipData.month} payslip Archived record`,
    //       },
    //     }).onClose.subscribe((data) => {
    //       if (data) {
    //         this.loading = true
    //         this.payslipData['save'] = "1"
    //         let values = Object.values(this.payslipData)
    //         let keys = Object.keys(this.payslipData)
    //         this.queryParams = keys.reduce((params: any, kn: any, index: any) => {
    //           if (index !== keys.length - 1) {
    //             return params + kn + "=" + values[index] + "&"
    //           }
    //           return params + kn + "=" + values[index]

    //         }, '')

    //         this.api.protectedGet("generatePayslip?" + this.queryParams, this.token).subscribe((data: any) => {
    //           this.netSalary = data.total
    //           this.toastrService.success('Payslip Archived Successfully', this.messages.SUCCESS_INFO, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //           this.payslipData['save'] = "0"
    //           this.loading = false
    //         });
    //       }
    //     });
    //   });
  }

  viewOtherAllowance() {
    // this.api.protectedGet(`getAllOtherAllowances?month=${this.payslipData.month}&employee_id=${this.wantedEmployee.id}&year=${this.payslipData.year}`, this.token).subscribe((allowances: any) => {
    //   this.translate.get('TOAST_MESSAGES')
    //     .subscribe((data) => {
    //       this.dialogService.open(OtherAllowanceComponent, {
    //         context: {
    //           title: 'Other Allowances/Deductions',
    //           allowances,
    //           month: this.payslipData.month,
    //           year: this.payslipData.year,
    //           employee_id: this.wantedEmployee.id
    //         },
    //       }).onClose.subscribe((data) => {
    //         //
    //       });
    //     });
    // });
  }

}
