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

  messages
  holiday = {
    id: '',
    name: '',
    name_ar: '',
    date: {
      start: new Date(),
      end: new Date()
    },
    type: '1',
    is_active: true,
    is_yearly_repeated: true,
  };
  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;
  date: any;

  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private location: Location) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      name_ar: [''],
      date: [''],
      type: ['1'],
      hijri_date: [''],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id != null) {
        this.isEdit = true;
        this.holiday.id = data.params.id;
        this.loadItem();
      }
    });
  }

  loadItem() {
    this.api.protectedGet('holidays/' + this.holiday.id, this.token).subscribe((data:any) => {
      this.holiday = data;
      this.holiday.type = '1';
      if(data.from != null){
        var fromSplitted = data.from.split('-');
        var toSplitted = data.to.split('-');
        var tep = {
          start: new Date(fromSplitted[0],fromSplitted[1] - 1, fromSplitted[2]),
          end: new Date(toSplitted[0], toSplitted[1] - 1, toSplitted[2])
        }
        this.date = tep;
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
    if(this.holiday.type == '2'){
      if(this.fromDate == null || this.toDate == null){
        let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
        this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      }
      this.holiday.date.start = moment(this.fromDate.year + '/' + this.fromDate.month + "/" + this.fromDate.day, 'iYYYY/iM/iD HH:mm').format('YYYY-M-DTHH:mm:ss');
      this.holiday.date.end = moment(this.toDate.year + '/' + this.toDate.month + "/" + this.toDate.day, 'iYYYY/iM/iD HH:mm').format('YYYY-M-DTHH:mm:ss');
    } else {
      if(this.date == null || this.date.start == null || this.date.end == null){
        let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
        this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      }
      this.holiday.date = this.date
    }
    this.api.protectedPost('holidays', this.holiday, this.token).subscribe((data: any) => {
        this.showSuccessMsgAndReturn();
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
