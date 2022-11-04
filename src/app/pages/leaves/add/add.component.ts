import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  min: Date;
  messages
  leave = {
    id: '',
    vacation_type_id: null,
    date: {
      start: new Date(),
      end: new Date()
    },
    type: '1',
  };
  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;
  date: any;
  leaveTypes = [];
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private location: Location) {

    this.myForm = this.fb.group({
      date: [''],
      vacation_type_id: [null, [Validators.required]],
      type: ['1'],
      hijri_date: [''],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');
    this.min = new Date();
  }

  ngOnInit() {
    this.api.protectedGet("leave-types", this.token).subscribe((data: any) => {
      this.leaveTypes = data;
    });
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id != null) {
        this.isEdit = true;
        this.leave.id = data.params.id;
        this.loadItem();
      }
    });

   
  }

  loadItem() {
    this.api.protectedGet('leaves/' + this.leave.id, this.token).subscribe((data:any) => {
      this.leave = data;
      this.leave.vacation_type_id = "" + this.leave.vacation_type_id + "";
      this.leave.type = '1';
      if(data.from != null){
        var fromSplitted = data.from.split('-');
        var toSplitted = data.to.split('-');
        var tep = {
          start: new Date(fromSplitted[0],fromSplitted[1], fromSplitted[2]),
          end: new Date(toSplitted[0], toSplitted[1], toSplitted[2])
        }
        this.date = tep;
        this.leave.date = tep;
        console.log(this.date);
      }
    });
  }

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    if(this.leave.type == '2'){
      if(this.fromDate == null || this.toDate == null){
        let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
        this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      }
      this.leave.date.start = moment(this.fromDate.year + '/' + this.fromDate.month + 1 + "/" + this.fromDate.day, 'iYYYY/iM/iD HH:mm').format('YYYY-M-DTHH:mm:ss');
      this.leave.date.end = moment(this.toDate.year + '/' + this.toDate.month + 1 + "/" + this.toDate.day, 'iYYYY/iM/iD HH:mm').format('YYYY-M-DTHH:mm:ss');
    } else {
      if(this.date == null || this.date.start == null || this.date.end == null){
        let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
        this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      }
      this.leave.date = this.date
    }
    console.log(this.leave);
    this.leave.date.end.setDate(this.leave.date.end.getDate() + 1);
    this.leave.date.start.setDate(this.leave.date.start.getDate() + 1);
    console.log(this.leave);
    this.api.protectedPost('leaves', this.leave, this.token).subscribe((data: any) => {
      if(data.success){
        this.showSuccessMsgAndReturn();
      } else {
        this.toastrService.danger("Not enough balance", this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}
