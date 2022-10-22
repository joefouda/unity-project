import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-subs-details',
  templateUrl: 'subs-details.component.html',
  styleUrls: ['subs-details.component.scss'],
})
export class SubsDetailsComponent implements OnInit {
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
  package;
  range;
  rangeQ = {
    start: '',
    end: '',
  }
  packages = [];
  exporting = false;
  constructor(
    private api: ApiService,
    private exportAsService: ExportAsService,
    ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getResult({ offset: 0 });
    this.loadPackages();
  }

  loadPackages(){
    this.api.protectedGet('packages-all', this.token).subscribe((data: any) => {
      this.packages = data;
    });
  }

  getPeriod(period){
    if(period == 1){
      return "Monthly";
    } else if(period == 2){
      return "Every 6 months";
    } else {
      return "Yearly";
    }
  }

  searchE(q){
    this.peopleLoading = true;
    this.api.protectedGet('companies-search?q=' + q.term, this.token).subscribe((data: any) => {
      this.companies = data;
      this.peopleLoading = false;
      this.companies = this.companies.slice(0);
    }) 
  }

  export() {
    this.exporting = true;
    this.api.protectedGet("subsciption-history-all", this.token).subscribe((data: any) => {
      this.allData = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'User sheets').subscribe(() => {
          setTimeout(() => {
            this.exporting = false;
          }, 200);
        });
      }, 100);
    });
  }

  getResult(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("subsciption-history?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
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

  getSearchResult(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("subsciption-history-search?page=" + this.backendPage + 
    "&from=" + this.rangeQ.start + "&to=" + this.rangeQ.end + 
    "&company_ids=" + this.companyIds.toString() +"&package_id=" + this.package, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }
}
