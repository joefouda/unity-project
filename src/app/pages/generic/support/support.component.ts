import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'support.component.html',
  styleUrls: ['support.component.scss'],
})
export class SupportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
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
  }


  export() {
    this.exporting = true;
    this.api.protectedGet("support-all", this.token).subscribe((data: any) => {
      this.allData = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'Support sheets').subscribe(() => {
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
    this.api.protectedGet("support?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }

  search(){
    const entries = Object.entries(this.query);
    this.q = "";
    for (const [key, value] of entries) {
      this.q += "&" + key + "=" + value
    }
    this.getResult({ offset: 0 });
  }
}
