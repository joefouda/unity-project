import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NbToastrService, NbLayoutDirectionService, NbLayoutDirection, NbGlobalPhysicalPosition, NbThemeService } from '@nebular/theme';
import { ApiService } from '../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements OnInit {


  public myForm: FormGroup;
  messages;
  token;
  verificationToken;

  user = {
    email: '',
    name: '',
    mobile: '',
    company_name: '',
    preferred_lang: '',
  }

  submitted = false;
  loading = false;
  sent = false;
  lang;
  logo = 'logo.png';

  constructor(private toastrService: NbToastrService, private api: ApiService,
    private fb: FormBuilder, private translate: TranslateService,  private themeService: NbThemeService,
    private route: ActivatedRoute, protected cd: ChangeDetectorRef, private nbLayoutDirectionService: NbLayoutDirectionService) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    });
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });

  }




  ngOnInit() {
    if(this.themeService.currentTheme == 'dark'){
      this.logo = "logo-w.png";
    }
    this.route.queryParams.subscribe(params => {
      this.lang = params['lang'];
      if(this.lang != null){
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        this.user.preferred_lang = this.lang;
        if (this.lang == 'ar') {
          this.nbLayoutDirectionService.setDirection(NbLayoutDirection.RTL);
        } else {
          this.nbLayoutDirectionService.setDirection(NbLayoutDirection.LTR);
        }
      }

      this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    });
  }

  update(): void {
    this.loading = true;
    this.submitted = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.api.post("register-with-temp-subs", this.user).subscribe((data: any) => {
      this.sent = true;
      this.user = data;
      this.submitted = false;
      this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    }, err => {
      this.loading = false;
      this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      
    });
  }
}