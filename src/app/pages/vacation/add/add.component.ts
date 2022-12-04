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
  vacation = {
    id: '',
    name: '',
    name_ar: '',
    type:'',
    paid_type:'',
    percentage_for_deduction:'',
  };
  paid_vacation = false;
  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;

  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private location: Location) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      name_ar: ['', [Validators.required]],
      type:['', [Validators.required]],
      percentage_for_deduction:['', [Validators.max(100)]],
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
        this.vacation.id = data.params.id;
        this.loadItem();
      }
    });
  }

  loadItem() {
    this.api.protectedGet('getCompanyVacation?id=' + this.vacation.id, this.token).subscribe((data:any) => {
      this.vacation = data;
      this.vacation.type = '' + data.type + ''
      if(data.paid_type === 0){
        this.paid_vacation = true
      }
    });
  }

  save() {
    // this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.vacation.paid_type = this.paid_vacation ? "0":"1"
    this.api.protectedPost('addNewCompanyVacation', this.vacation, this.token).subscribe((data: any) => {
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
