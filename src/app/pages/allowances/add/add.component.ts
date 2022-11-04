import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-index-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
})
export class AddComponent implements OnInit {
  public myForm: FormGroup;
  picture: File

  messages
  allowence: any = {
    id: '',
    name: '',
    name_ar: '',
    percentage: '',
    fixed_amount: '',
  };
  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      name_ar: [''],
      percentage: ['', [Validators.maxLength(100), Validators.pattern("^[0-9]*$")]],
      fixed_amount: ['', [Validators.pattern("^[0-9]*$")]],
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
        this.allowence.id = data.params.id;
        this.loadItem();
      }
    });
  }

  loadItem() {
    this.api.protectedGet('allowances/' + this.allowence.id, this.token).subscribe((data) => {
      this.allowence = data;
    });
  }

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    if(this.allowence.percentage == '' && this.allowence.fixed_amount == ''){
      this.toastrService.warning("Kindly enter either percentage allowances or fixed amount", this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      this.loading = false;
      this.submitted = true;
      return;
    }
    if(this.allowence.percentage != '' && this.allowence.fixed_amount != ''){
      this.toastrService.warning("Kindly enter either percentage allowances or fixed amount, not both", this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.api.protectedPost('allowances', this.allowence, this.token).subscribe((data: any) => {
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
    this.router.navigate(['/pages/allowances']);
  }
}
