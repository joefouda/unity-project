import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {
  altsrc = "assets/images/male-picture.png"
  imageUrl = "https://api.unisync.app/storage/employees/";
  token:any;
  departments:[];
  searchDepartments:any
  employees:[];
  selectedEmployees:any;
  wantedEmployee:[]

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

  getDepartmentsEmployees(event:any){
    if(event.target.checked){
      this.searchDepartments.push(event.target.value)
    }
    else{
      this.searchDepartments = this.searchDepartments.filter(department=>{
        return department !== event.target.value
      })
    }
    let urlParams = this.searchDepartments.reduce((departments:any,dn:any, index:any)=>{
      if(index !== this.searchDepartments.length - 1){
        return departments + "departments[" + index + "]=" + dn + "&"
      }
      return departments + "departments[" + index + "]=" + dn 
      
    },'')
    this.api.protectedGet("getAllEmployeeDepartment?" + urlParams, this.token).subscribe((data: any) => {
      this.employees = data
      this.selectedEmployees = []
      this.wantedEmployee = []
    });
  }

  addToSelectedEmployees(event){
    if(event.target.checked){
      this.selectedEmployees = [...this.selectedEmployees, ...this.employees.filter((employee:any)=>{
        return employee.id == event.target.value
      })]
    }
    else{
      this.selectedEmployees = this.selectedEmployees.filter((employee:any)=> {
        return employee.id != event.target.value
      })
    }
    console.log(this.selectedEmployees)
  }

  selectEmployee(event) {
    console.log(event)
    this.wantedEmployee = this.selectedEmployees.find(employee=>employee.id === event.target.value)
    console.log(this.wantedEmployee)
  }

  
}
