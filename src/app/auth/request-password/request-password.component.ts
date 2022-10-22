import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbRequestPasswordComponent, NbAuthService, NB_AUTH_OPTIONS, NbAuthResult } from '@nebular/auth';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutDirectionService, NbLayoutDirection, NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-request-password',
  templateUrl: './request-password.component.html',
})
export class NgxRequestPasswordComponent extends NbRequestPasswordComponent implements OnInit {


  lang;
  logo = 'logo.png';

  constructor(authService: NbAuthService, @Inject(NB_AUTH_OPTIONS) options = {}, cd: ChangeDetectorRef, router: Router, private themeService: NbThemeService,
    private translate: TranslateService, private route: ActivatedRoute, private nbLayoutDirectionService: NbLayoutDirectionService) {
    super(authService, options, cd, router);
  }


  ngOnInit() {
    this.showMessages.error = false;
    this.showMessages.success = false;

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

  requestPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.service.requestPassword(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      var body = result.getResponse().body;
      this.submitted = false;
      if(!body.success){
        this.showMessages.success = false;
        this.showMessages.error = true;
      } else {
        this.showMessages.success = true;
        this.showMessages.error = false;
        this.messages = result.getMessages();
        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      }

     
    }, err => {
      console.log(err);
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