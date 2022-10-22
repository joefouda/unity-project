import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS, NbAuthResult } from '@nebular/auth';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutDirectionService, NbLayoutDirection, NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent implements OnInit {


  lang;
  logo = 'logo.png';

  constructor(authService: NbAuthService, @Inject(NB_AUTH_OPTIONS) options = {}, cd: ChangeDetectorRef, router: Router, private themeService: NbThemeService,
    private translate: TranslateService, private route: ActivatedRoute, private nbLayoutDirectionService: NbLayoutDirectionService) {
    super(authService, options, cd, router);
  }


  ngOnInit() {
    if(this.themeService.currentTheme == 'dark'){
      this.logo = "logo-w.png";
    }

    this.route.queryParams.subscribe(params => {
      this.lang = params['lang'];
      if (this.lang != null) {
        this.setLang();
      }


      this.translate.get('TOAST_MESSAGES')
        .subscribe((data) => {
          this.messages = data;
        });
    });
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    console.log(this.strategy);
    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        var body = result.getResponse().body;
        if (body.employee != null) {
          body.user.picture = body.employee.picture;
        }
        if (body.user.preferred_lang != null) {
          this.lang = body.user.preferred_lang
          this.setLang();
        }
        localStorage.setItem('user', JSON.stringify(body.user));
        localStorage.setItem('userId', body.user.id);
        localStorage.setItem('roleId', body.user.role_id);
        localStorage.setItem('employeeId', body.user.employee_id);
        localStorage.setItem('token', body.token);
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }


  setLang() {
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);

    if (this.lang == 'ar') {
      this.nbLayoutDirectionService.setDirection(NbLayoutDirection.RTL);
    } else {
      this.nbLayoutDirectionService.setDirection(NbLayoutDirection.LTR);
    }
  }

}