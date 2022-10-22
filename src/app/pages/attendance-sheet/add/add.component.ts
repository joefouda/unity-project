import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n, NgbDate
} from '@ng-bootstrap/ng-bootstrap';

var moment = require('moment-hijri');
moment.locale('en-US');
import { IslamicI18n } from '../../../providers/IslamicI18n';

@Component({
  selector: 'ngx-index-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura},
    {provide: NgbDatepickerI18n, useClass: IslamicI18n}
  ]
})
export class AddComponent implements OnInit {
  public myForm: FormGroup;
  max: Date;
  messages
  attendance = {
    date: new Date(),
    in: null,
    indate: null,
    out: null,
    outdate: null,
  };
  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private location: Location) {

    this.myForm = this.fb.group({
      date: [null, [Validators.required]],
      in: [''],
      out: [''],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');
    this.max = new Date();
  }

  ngOnInit() {
   
  }

  

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    if(this.attendance.in == null || this.attendance.out == null){
      let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
      this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    }
    if(this.attendance.in != null){
      let inDate = this.attendance.in.split(' ');
      let inDateSplitted = inDate[0].split(':');
      let hour = parseInt(inDateSplitted[0]);
      if(inDate[1] == "PM"){
        hour += 12;
      }
      this.attendance.indate = new Date(this.attendance.date.getFullYear(), this.attendance.date.getMonth() , this.attendance.date.getDate(), hour, inDateSplitted[1]).toLocaleString();
      console.log(this.attendance.indate);
    
    }

    if(this.attendance.out != null){
      let outDate = this.attendance.out.split(' ');
      let outDateSplitted = outDate[0].split(':');
      let hour = parseInt(outDateSplitted[0]);
      if(outDate[1] == "PM"){
        hour += 12;
      }
      this.attendance.outdate = new Date(this.attendance.date.getFullYear(), this.attendance.date.getMonth(), this.attendance.date.getDate(), hour, outDateSplitted[1]).toLocaleString();
    }
    this.api.protectedPost('attendance-sheet/request', this.attendance, this.token).subscribe((data: any) => {
      if(data.success){
        this.showSuccessMsgAndReturn();
      } else {
        this.loading = false;
      }
    }, err => {
      let errMessages = this.messages.ERROR_INFO;
      if(err.error.errors != null){
        Object.keys(err.error.errors).forEach( async (key) => {
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
    this.location.back()
  }
}
