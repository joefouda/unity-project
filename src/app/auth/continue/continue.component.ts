import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NbToastrService, NbLayoutDirectionService, NbLayoutDirection, NbGlobalPhysicalPosition, NbThemeService } from '@nebular/theme';
import { ApiService } from '../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NbAuthService, NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './continue.component.html',
})
export class ContinueComponent implements OnInit {


  public myForm: FormGroup;
  picture: File
  messages;
  token;
  verificationToken;

  user = {
    email: '',
    name: '',
    password: '',
    token: '',
  }

  submitted = false;
  loading = false;
  lang;
  logo = 'logo.png';

  constructor(private toastrService: NbToastrService, private api: ApiService, private themeService: NbThemeService,
    private fb: FormBuilder, private translate: TranslateService,
    private route: ActivatedRoute, private router: Router, protected cd: ChangeDetectorRef, private authService: NbAuthService,
    private nbLayoutDirectionService: NbLayoutDirectionService) {

    this.myForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    });
  }




  ngOnInit() {
    if(this.themeService.currentTheme == 'dark'){
      this.logo = "logo-w.png";
    }
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.token != null) {
        this.api.get("get-user-from-token/" + data.params.token).subscribe((response: any) => {
          this.user.email = response.email;
          this.user.name = response.name;
          this.user.token = data.params.token;
        });
      } else {
        this.router.navigate(['/auth/login']);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.lang = params['lang'];
      if(this.lang != null){
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
  
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
    console.log(this.user);
    this.api.post("update-user-from-token", this.user).subscribe((data: any) => {
      this.user = data;
      this.submitted = false;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('roleId', data.user.role_id);
      localStorage.setItem('token', data.token);
      this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      setTimeout(() => {
        return this.router.navigate(["/pages/dashboard"]);
      }, 500);
      this.cd.detectChanges();
    });
  }


  login(){
    this.authService.authenticate("email", this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
        var body = result.getResponse().body;
        localStorage.setItem('user', JSON.stringify(body.user));
        localStorage.setItem('roleId', body.user.role_id);
        localStorage.setItem('userId', body.user.id);
        localStorage.setItem('token', body.token);
      }
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, 1000);
      }
      this.cd.detectChanges();
    });
  }

}