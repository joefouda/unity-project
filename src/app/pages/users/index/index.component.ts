import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {
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
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
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
    this.api.protectedGet("users-all", this.token).subscribe((data: any) => {
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
    this.api.protectedGet("users?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }

  updateFilter(event) {

  }

  accept(id) {
    this.router.navigate(['/pages/companies/add/' + id]);
  }

  reject(id) {

  }

  cancel(item) {
    console.log(item);
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + item.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + item.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('users/' + item.id, this.token).subscribe((data) => {
              let temp = [...this.data];
              let index = temp.indexOf(item, 0);
              temp.splice(index, 1);
              this.data = temp;
              this.page.totalElements--;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
        });
      });
  }

  activate(item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.ACTIVEATE_ITEM + " " + item.name,
            content: this.messages.ARE_YOU_SURE_ACTIVEATE + " " + item.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('users-toggle/' + item.id, this.token).subscribe((data: any) => {
              let index = this.data.indexOf(item, 0);
              this.data[index].is_active = !item.is_active;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  deactivate(item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DEACTIVATE_ITEM + " " + item.name,
            content: this.messages.ARE_YOU_SURE_DEACTIVATE + " " + item.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('users-toggle/' + item.id, this.token).subscribe((data: any) => {
              let index = this.data.indexOf(item, 0);
              this.data[index].is_active = !item.is_active;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }


  search() {
    const entries = Object.entries(this.query);
    this.q = "";
    for (const [key, value] of entries) {
      this.q += "&" + key + "=" + value
    }
    this.getResult({ offset: 0 });
  }
}
