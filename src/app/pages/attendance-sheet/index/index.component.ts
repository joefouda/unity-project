import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

@Component({
  selector: 'ngx-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class IndexComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  viewCalender: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  companyId = localStorage.getItem('userId');


  exportAsConfig: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'myTableElementId',
  }
  autoExpiry = false
  map: google.maps.Map;
  allData = [];
  token;
  employee = false;
  title;
  activeText = "Active";
  inActiveText = "Inactive";
  loadingIndicator = true;
  loadingIndicatorTwo = true;
  data;
  data2;
  messages;
  ColumnMode = ColumnMode;
  ColumnMode2 = ColumnMode;
  rows = [];
  page = new Page();
  page2 = new Page();
  stats = {
    rejected: '',
    currently: '',
    pending: '',
  }
  loading = true;
  date: any;
  backendPage = 0;
  backendPage2 = 0;

  query = {
    name: '',
  }
  q = "";
  range;
  exported = false;
  latitude;
  longitude;
  peopleLoading = false;
  LoggedInUserInfo = {}
  employees = [];
  employeeIds = [];
  exporting = false;
  zoom = 12;
  ip;
  roleId;
  employeeId;
  activeDayIsOpen: boolean = true;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private exportAsService: ExportAsService,
    private modal: NgbModal,
    private router: Router) {
    this.page.pageNumber = 1;
    this.page.size = 10;
    this.page2.pageNumber = 1;
    this.page2.size = 10;
  }

  ngOnInit(): void {
    this.LoggedInUserInfo = JSON.parse(localStorage.getItem('user'))
    console.log(this.LoggedInUserInfo)
    this.token = localStorage.getItem('token');
    this.roleId = localStorage.getItem('roleId');
    this.employee = this.roleId == '3' ? true : false;
    if (!this.employee) {
      this.api.protectedGet('attendance-sheets-stats', this.token).subscribe((data: any) => {
        this.stats = data;
        this.loading = false;
      });
    } else {
      this.employeeId = localStorage.getItem('employeeId');
    }
    this.getResult({ offset: 0 });
  }


  loadChangeRequest(pageInfo) {
    this.page2.pageNumber = pageInfo.offset;
    this.backendPage2 = this.page2.pageNumber + 1;
    this.api.protectedGet("attendance-sheets-requests?page=" + this.backendPage2, this.token).subscribe((data: any) => {
      this.data2 = data.data;
      this.page2.totalElements = data.total;
      this.loadingIndicatorTwo = false;
    });
  }

  loadRequests() {
    this.loadChangeRequest({ offset: 0 });
  }

  searchE(q) {
    this.peopleLoading = true;
    this.api.protectedGet('employees-search?q=' + q.term, this.token).subscribe((data: any) => {
      this.employees = data;
      this.peopleLoading = false;
      this.employees = this.employees.slice(0);
    })
  }

  export() {
    this.exporting = true;
    this.api.protectedGet("attendance-sheets-all", this.token).subscribe((data: any) => {
      console.log(data)
      this.allData = data;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'Attendance sheets').subscribe(() => {
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
    this.api.protectedGet("attendance-sheets?page=" + this.backendPage, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }


  getSearchResult(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("attendance-sheets-search?page=" + this.backendPage +
      "&from=" + new Date(this.range.start).toISOString().slice(0, 10) +
      "&to=" + new Date(this.range.end).toISOString().slice(0, 10) +
      "&employee_ids=" + this.employeeIds.toString(), this.token).subscribe((data: any) => {
        this.data = data.data;
        this.page.totalElements = data.total;
        this.loadingIndicator = false;
      });
  }

  onDeleteConfirm(event) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + event.data.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + event.data.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('attendance-sheets/' + event.data.id, this.token).subscribe((data) => {
              this.data.remove(event.data);
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }


  edit(id) {
    this.router.navigate(['/pages/attendance-sheets/edit/' + id]);
  }

  search() {
    this.getSearchResult({ offset: 0 });
  }


  accept(item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.ACCEPT_ITEM,
            content: this.messages.ARE_YOU_SURE_ACCEPT,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('attendance-sheets-accept/' + item.id, this.token).subscribe((data: any) => {
              let index = this.data2.indexOf(item, 0);
              this.data2[index].status = 2;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  reject(item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.REJECT_ITEM,
            content: this.messages.ARE_YOU_SURE_REJECT,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedGet('attendance-sheets-reject/' + item.id, this.token).subscribe((data) => {
              let index = this.data.indexOf(item, 0);
              this.data2[index].status = 3;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  viewIn(row) {
    this.latitude = row.latitude;
    this.longitude = row.longitude;
    this.ip = row.ip;
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  viewOut(row) {
    this.latitude = row.out_latitude;
    this.longitude = row.out_longitude;
    this.ip = row.out_ip;
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  generate() {
    let generationDate = new Date()
    let newQR = {
      company_id:this.companyId,
      generated_time:generationDate.toLocaleString(),
      auto_expiry:this.autoExpiry?'1':'0'
    }
    this.api.protectedPost('storeGeneratedQr', newQR, this.token).subscribe((data:any)=> {
      console.log(data)
      window.open('/g/generate', "_blank");
    })
  }

  cancel(item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM,
            content: this.messages.ARE_YOU_SURE_DELETE,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('attendance-sheets-requests/' + item.id, this.token).subscribe((data) => {
              let temp = [...this.data2];
              let index = temp.indexOf(item, 0);
              temp.splice(index, 1);
              this.data2 = temp;
              this.page.totalElements--;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }

  setView(view: CalendarView) {
    this.viewCalender = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
