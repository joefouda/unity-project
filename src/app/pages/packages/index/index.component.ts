import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService} from '@nebular/theme';
import { IMAGE_URL } from '../../../providers/providers';

@Component({
  selector: 'ngx-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {

  active;
  inactive;
  packages = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  isDone = false;
  token;
  messages;
  imageUrl = IMAGE_URL;

  totalPages;
  totalItems;
  lastPage;

  query = {
    name: '',
    name_ar: '',
    period: '',
  }
  q = "";

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    ) {
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();
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

  load() {
    this.api.protectedGet("packages?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.packages = data.data;
      this.loaded = true;
    });
  }

  setPage(pageNumber){
    this.page = pageNumber;
    this.packages = [];
    this.loaded = false;
    this.scrollService.scrollTo(0,0);
    this.load();
  
  }


  loadMore() {
    if (!this.isDone) {
      this.page++;
      this.isDone = true;
      this.fakeItems = new Array(12);
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
            this.api.protectedDelete('packages/' + subsPackage.id, this.token).subscribe((data) => {
              this.packages.splice(index, 1);
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

  toggle(index, subsPackage) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        let title = "";
        let content = "";
        if(subsPackage.is_active){
          title = this.messages.DEACTIVATE_ITEM;
          content = this.messages.ARE_YOU_SURE_DEACTIVATE;
        } else {
          title = this.messages.ACTIVEATE_ITEM;
          content = this.messages.ARE_YOU_SURE_ACTIVEATE;
        }
        this.dialogService.open(DeleteComponent, {
          context: {
            title: title + " " + subsPackage.name,
            content: content + " " + subsPackage.name,
          },
        }).onClose.subscribe((data) => {
          if(data){
            this.api.protectedGet('packages/' + subsPackage.id + '/toggle', this.token).subscribe((data) => {
              console.log(data);
              subsPackage.is_active = !subsPackage.is_active;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            })
          }
          console.log(data);
        });
      });
  }

  search(){
    const entries = Object.entries(this.query);
    this.q = "";
    for (const [key, value] of entries) {
      this.q += "&" + key + "=" + value
    }
    this.page = 1;
    this.load();
  }


  onImgError(event) { 
    event.target.src = 'assets/images/placeholder.jpg';
}
}
