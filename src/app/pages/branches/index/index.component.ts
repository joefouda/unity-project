import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  exportAsConfig: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'myTableElementId',
  }
  token;
  branches = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  allData = [];
  totalPages;
  totalItems;
  lastPage;
  perPage;
  query = {
    name: '',
  }
  q = "";
  exported = false;
  exporting = false;
  messages;
  loadingEmployees = false;
  connecting = false;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    private modal: NgbModal,
    private exportAsService: ExportAsService) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();
  }
 

  load() {
    this.api.protectedGet("branches?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.loaded = true;
      this.branches = data.data;
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
      this.branches = [];
      this.loaded = false;
      this.scrollService.scrollTo(0, 0);
      this.load();
    }
  }


  delete(index, subsPackage) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + subsPackage.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + subsPackage.name,
          },
        }).onClose.subscribe((data) => {
          if(data){
            console.log(index);
            this.api.protectedDelete('branches/' + subsPackage.id, this.token).subscribe((data) => {
              this.branches.splice(index, 1);
              this.totalItems--;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            })
          }
          console.log(data);
        });
      });
  }


  export() {
    this.exporting = true;
    this.api.protectedGet("branches-all", this.token).subscribe((data: any) => {
      this.allData = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'Branches sheets').subscribe(() => {
          setTimeout(() => {
            this.exporting = false;
          }, 200);
        });
      }, 100);
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
    this.load();
  }

  onImgError(event) {
    event.target.src = 'assets/images/placeholder.jpg';
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
