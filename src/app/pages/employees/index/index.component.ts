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
    options: { // html-docx-js document options
      margin: 1,
      jsPDF: { orientation: 'landscape' },
    }
  }
  active;
  inactive;
  employees = [];
  allEmployees = [];

  loading = true;
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  token;
  messages;
  imageUrl = IMAGE_URL;
  totalItems;
  lastPage;
  perPage;
  stats = {
    males: '',
    females: '',
    total: '',
    avgAge: ''
  }

  query = {
    name: '',
    mobile: '',
    is_active: '',
  }
  q = "";
  exported = false;
  exporting = false;
  connecting = false;

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
    this.api.protectedGet("employees-stats", this.token).subscribe((data: any) => {
      this.stats = data;
      this.stats.avgAge = data.avgAge.toFixed(0);
      this.loading = false;
    });
    this.load();
  }

  setPage(pageNumber) {
    this.page = pageNumber;
    this.employees = [];
    this.loaded = false;
    this.scrollService.scrollTo(0, 0);
    this.load();
  }

  getPeriod(period) {
    if (period == 1) {
      return "Monthly";
    } else if (period == 2) {
      return "Every 6 months";
    } else {
      return "Yearly";
    }
  }

  load() {
    this.api.protectedGet("employees?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.employees = data.data;
      this.loaded = true;
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

  export() {
    this.exporting = true;
    this.api.protectedGet("employees-all-with?" + this.q, this.token).subscribe((data: any) => {
      this.allEmployees = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'Employees sheets').subscribe(() => {
          setTimeout(() => {
            this.exporting = false;
          }, 200);
        });
      }, 100);
    });
  }

  delete(index, company) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + company.full_name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + company.full_name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('employees/' + company.id, this.token).subscribe((data) => {
              this.employees.splice(index, 1);
              this.totalItems--;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  toggle(index, item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        let title = "";
        let content = "";
        if (item.user.is_active) {
          title = this.messages.DEACTIVATE_ITEM;
          content = this.messages.ARE_YOU_SURE_DEACTIVATE;
        } else {
          title = this.messages.ACTIVEATE_ITEM;
          content = this.messages.ARE_YOU_SURE_ACTIVEATE;
        }
        this.dialogService.open(DeleteComponent, {
          context: {
            title: title + " " + item.user.name,
            content: content + " " + item.user.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('employees/' + item.id + '/toggle', this.token).subscribe((data) => {
              console.log(data);
              item.user.is_active = !item.user.is_active;
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


  onImgError(event, gender) {
    if(gender == null){
      gender = 1;
    }
    event.target.src = 'assets/images/' + gender + '.png';
  }

  linkFoodics() {
    this.api.protectedGet("foodics", this.token).subscribe((data: any) => {
      this.connecting = true;
      window.open(data.link, "_blank");
      clearInterval()
      let interval = setInterval(() => {
        let foodicsData = localStorage.getItem('got_data_foodics');
        if (foodicsData != null) {
          this.connecting = false;
          localStorage.setItem('got_data_foodics', null);
          clearInterval(interval);
          this.toastrService.primary("Connecting successfully", "Thanks!", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        }
      }, 50000);

    });
  }
}
