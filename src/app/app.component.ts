/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { NbLayoutDirectionService, NbLayoutDirection, NbThemeService } from '@nebular/theme';



@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  lang;
  dir;
  theme;
  constructor(private analytics: AnalyticsService, private seoService: SeoService, translate: TranslateService, private themeService: NbThemeService, private nbLayoutDirectionService: NbLayoutDirectionService) {
    this.lang = localStorage.getItem('lang');
    if(this.lang == null){
      translate.setDefaultLang('en');
      translate.use('en');
      this.dir = "ltr";
    } else {
      translate.setDefaultLang(this.lang);
      translate.use(this.lang);

      if(this.lang == 'ar'){
        this.nbLayoutDirectionService.setDirection(NbLayoutDirection.RTL);
      }
      
    }
    translate.addLangs(['en', 'ar']);
    this.theme = localStorage.getItem('theme');
    if(this.theme != null && this.theme != 'default'){
      this.themeService.changeTheme(this.theme);
    }

    
}
  
  // get isAuthorized() {
  //   return this.authService.isAuthorized();
  // }
  // get isAdmin() {
  //   return this.authService.hasRole(Role.Admin);
  // }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
