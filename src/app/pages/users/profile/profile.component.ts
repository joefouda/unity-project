import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMAGE_URL } from '../../../providers/providers';
import { Location } from '@angular/common'

@Component({
  selector: 'ngx-profile-add',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public myForm: FormGroup;
  picture: File

  messages;
  user: any = {
    id: '',
    name: '',
    password: '',
    email: '',
    mobile: '',
    preferred_lang: '',
    yearly_vacation_balance: '',
    urgent_vacation_balance: '',
    includes_weekends: '',
    picture: ''
  };
  submitted = false;
  loading = false;
  token;
  manager = false;
  public imagePath;
  imgURL: any;
  public message: string;
  isEdit = false;
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private location: Location) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      preferred_lang: ['en', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      picture: [''],
      yearly_vacation_balance: [''],
      urgent_vacation_balance: [''],
      includes_weekends: [''],

    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
      this.loadItem();
  }

  preview(files) {
    this.imgURL = null
    files = files.target.files;
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    this.picture = files[0];

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  loadItem() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.manager = localStorage.getItem('roleId') == '2' ? true : false;
    this.user.mobile = this.user.mobile.substring(4);
    if(this.user.picture != null){
      this.imgURL = IMAGE_URL + "/users/" + this.picture;
    }
  }

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.api.protectedPost('profile', this.user, this.token).subscribe((data: any) => {
      this.user.password = null;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      const uploadData = new FormData();
      if(this.picture != null){
        uploadData.append('image', this.picture, this.picture.name);
        this.api.protectedPost('prolile/' + data.id + '/upload', uploadData, this.token).subscribe((data) => {
          this.showSuccessMsgAndReturn();
      }, err => {
          this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        })
      } else {
        this.showSuccessMsgAndReturn();
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
