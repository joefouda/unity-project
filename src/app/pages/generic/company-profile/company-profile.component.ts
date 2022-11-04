import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-profile-add',
  templateUrl: 'company-profile.component.html',
  styleUrls: ['company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {

  exportAsConfig: ExportAsConfig = {
    type: 'xlsx', 
    elementIdOrContent: 'myTableElementId', 
  }
  token;
  employee = false;
  title;
  activeText = "Active";
  inActiveText = "Inactive";
  loadingIndicator = true;
  data;
  page = new Page();
  columns = [];
  messages;
  ColumnMode = ColumnMode;
  temp = [];
  loading = true;
  date: any;
  backendPage = 0;

  query = {
    name: '',
    mobile: '',
    is_active: '',
  }
  q = "";
  allData = [];
  exported = false;
  peopleLoading = false;
  companies = [];
  companyIds = [];
  range;
  rangeQ = {
    start: '',
    end: '',
  }
  payroll = {
    allow_in_delay: null,
    allow_out_delay: null,
    allow_total_month_delay: null,
    max_hours_for_absent: null,
  }
  companyprofile = {
    id: '',
    yearly_vacation_balance: '',
    urgent_vacation_balance: '',
    includes_weekends: null,
    vacation_to_next_year: '',
    allow_in_delay: '',
    allow_out_delay: '',
    allow_total_month_delay: '',
    max_hours_for_absent: '',
    payslip_generation_date: '',
    director: {
      name: '',
      name_ar: '',
      email: '',
      mobile: '',
    },
  };
  constructor(
    private toastrService: NbToastrService,
    private translate: TranslateService, 
    private api: ApiService,
    private exportAsService: ExportAsService,
    ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getResult({ offset: 0 });
    this.load();
    this.translate.get('TOAST_MESSAGES')
    .subscribe((data) => {
      this.messages = data;
    });
  }

  load(){
    this.api.protectedGet('company-profile', this.token).subscribe((data : any) => {
      if(data != null){
        let date = new Date();
        this.companyprofile = data;
        this.companyprofile.includes_weekends = "" + data.includes_weekends + "";
        let splittedByHours = data.allow_in_delay.split(":");
        date.setHours(splittedByHours[0]);
        date.setMinutes(splittedByHours[1]);
        this.payroll.allow_in_delay = date;
        date = new Date();
        let splittedByHoursByOut = data.allow_out_delay.split(":");
        date.setHours(splittedByHoursByOut[0]);
        date.setMinutes(splittedByHoursByOut[1]);
        this.payroll.allow_out_delay = date;
        let splittedByHoursByTotal = data.allow_total_month_delay.split(":");
        date = new Date();
        date.setHours(splittedByHoursByTotal[0]);
        date.setMinutes(splittedByHoursByTotal[1]);
        this.payroll.allow_total_month_delay = date;
        this.payroll.max_hours_for_absent = data.max_hours_for_absent;
      }
    })
  }

  export() {
    this.api.protectedGet("subsciption-history-company-all", this.token).subscribe((data: any) => {
      this.allData = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'User sheets').subscribe(() => {
        });
      }, 100);
    });
  }

  getResult(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("subsciption-history-company?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }

  

  search(){
    if(this.range != null){
      this.rangeQ.start = new Date(this.range.start).toISOString().slice(0, 10)
      this.rangeQ.end = new Date(this.range.end).toISOString().slice(0, 10)
    }
    this.getSearchResult({ offset: 0 });
  }

  showAllowIn(event){
    this.companyprofile.allow_in_delay = event.time.getHours() + ":" + event.time.getMinutes();
  }

  showAllowOut(event){
    this.companyprofile.allow_out_delay = event.time.getHours() + ":" + event.time.getMinutes();
  }
  
  showTotalMonthDelay(event){
    this.companyprofile.allow_total_month_delay = event.time.getHours() + ":" + event.time.getMinutes();
  }
  getSearchResult(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("subsciption-history-search?page=" + this.backendPage + 
    "&from=" + this.rangeQ.start + "&to=" + this.rangeQ.end + 
    "&company_ids=" + this.companyIds.toString(), this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }

  save() {
    this.loading = true;
    this.api.protectedPost('company-profile', this.companyprofile, this.token).subscribe((data: any) => {
      this.showSuccessMsgAndReturn();
    }, err => {
      let errMessages = this.messages.ERROR_INFO;
      if (err.error.errors != null) {
        Object.keys(err.error.errors).forEach(async (key) => {
          errMessages = err.error.errors[key];
        });
      }
      this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      this.loading = false;
    })
  }


  updatePayroll() {
    this.loading = true;
    this.api.protectedPost('company-profile', this.companyprofile, this.token).subscribe((data: any) => {
      this.showSuccessMsgAndReturn();
    }, err => {
      let errMessages = this.messages.ERROR_INFO;
      if (err.error.errors != null) {
        Object.keys(err.error.errors).forEach(async (key) => {
          errMessages = err.error.errors[key];
        });
      }
      this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      this.loading = false;
    })
  }
  showSuccessMsgAndReturn(){
    this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    this.loading = false;
  }
}