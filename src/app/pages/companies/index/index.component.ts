import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';
import { IMAGE_URL } from '../../../providers/providers';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {
  exportAsConfig: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'myTableElementId',
  }
  active;
  inactive;
  companies = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  isDone = false;
  token;
  messages;
  imageUrl = IMAGE_URL;
  allData = [];
  totalPages;
  totalItems;
  lastPage;
  perPage;
  query = {
    name: '',
    mobile: '',
    email: '',
  }
  q = "";
  exported = false;
  exporting = false;
  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private exportAsService: ExportAsService,
    private scrollService: NbLayoutScrollService,
  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();
  }

  load() {
    this.api.protectedGet("companies?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.loaded = true;
      this.companies = data.data;
      this.totalItems = data.total;
      this.perPage = data.per_page;
      this.lastPage = data.last_page;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }


  setPage(pageNumber) {
    if(pageNumber > 0){
      this.page = pageNumber;
      this.companies = [];
      this.loaded = false;
      this.scrollService.scrollTo(0, 0);
      this.load();
    }
  }

  delete(index, company) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + company.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + company.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('companies/' + company.id, this.token).subscribe((data) => {
              this.companies.splice(index, 1);
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  export() {
    this.exporting = true;
    this.api.protectedGet("companies-all", this.token).subscribe((data: any) => {
      this.allData = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'Companies sheets').subscribe(() => {
          setTimeout(() => {
            this.exporting = false;
          }, 200);
        });
      }, 100);
    });
  }

  toggle(index, company) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        let title = "";
        let content = "";
        if (company.is_active) {
          title = this.messages.DEACTIVATE_ITEM;
          content = this.messages.ARE_YOU_SURE_DEACTIVATE;
        } else {
          title = this.messages.ACTIVEATE_ITEM;
          content = this.messages.ARE_YOU_SURE_ACTIVEATE;
        }
        this.dialogService.open(DeleteComponent, {
          context: {
            title: title + " " + company.name,
            content: content + " " + company.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('companies/' + company.id + '/toggle', this.token).subscribe((data) => {
              console.log(data);
              company.is_active = !company.is_active;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  sendEmail(index, company) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        let title = this.messages.ARE_YOU_SURE_SEND;
        let content = this.messages.ARE_YOU_SURE_SEND;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: title,
            content: content
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('companies/' + company.id + '/send-email?email=' + company.manager.email, this.token).subscribe((data) => {
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
    this.page = 1;
    this.load();
  }

  reset() {
    this.q = "";
    this.query.name = "";
    this.query.mobile = "";
    this.load();
  }


  onImgError(event) {
    event.target.src = 'assets/images/placeholder.jpg';
  }
}
