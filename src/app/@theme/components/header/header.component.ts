import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService, NbLayoutDirectionService, NbLayoutDirection, NbMediaBreakpointsService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../../@core/utils';
import { Subject } from 'rxjs';
import { NbAuthService, NbAuthJWTToken} from '@nebular/auth';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IMAGE_URL } from '../../../providers/providers';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../providers/api.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile',  id: 'profile' }, { title: 'Log out', id: 'logout' } ];
  langItems = [{ title: 'Profile' , id: 'ar' }, { title: 'Log out', id: 'en'}];
  notificationExists = false;
  notifications = [];
  messages = [];
  token;
  loaded= false;
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private authService: NbAuthService,
              private layoutService: LayoutService,
              private nbLayoutDirection: NbLayoutDirectionService,
              private translate: TranslateService,
              private breakpointService: NbMediaBreakpointsService,
    private api: ApiService,
              private router: Router) {
                this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.user = JSON.parse(localStorage.getItem('user'));
          if(this.user.picture != null)
            this.user.picture = IMAGE_URL + "/employees/" + this.user.picture;
        }
      });

      nbLayoutDirection.onDirectionChange()
      .subscribe((direction) => {
        this.fillHeaderLabel();
      });

  }


  fillHeaderLabel(){
    this.translate.get('HEADER_ITEMS')
        .subscribe((data) => {
          this.langItems[0].title = data.ARABIC;
          this.langItems[1].title = data.ENGLISH;
          this.userMenu[0].title = data.PROFILE;
          this.userMenu[1].title = data.LOGOUT;
          this.themes[0].name = data.LIGHT;
          this.themes[1].name = data.DARK;
          
        });
  }
  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.token = localStorage.getItem('token');
    this.api.protectedGet("notifications-count", this.token).subscribe((data: any) => {
      if(data.notifications + data.messages > 0 )
      console.log(data.notifications + data.messages)
        this.notificationExists = true
    })
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
      )
      .subscribe((data: any) => {
        if(data.item.id == 'ar'){
          this.setArabic();
        } else if(data.item.id == 'en'){
          this.setEnglish();
        } else if(data.item.id == 'logout'){
          this.logout();
        } else {
          this.router.navigate(['/pages/users/profile'])
        }
      });

      const { sm } = this.breakpointService.getBreakpointsMap(); 

      this.menuService.onItemSelect() 
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: { tag: string, item: any }) => {
              if (document.documentElement.clientWidth < sm){
                this.sidebarService.collapse('menu-sidebar');
              }
          });
  }


  getNotifications(){
    if(!this.loaded){
      this.api.protectedGet("notifications-unseen", this.token).subscribe((data: any) => {
        setTimeout(() => {
          this.loaded = true;
          this.notifications = data.notifications;
          this.messages = data.messages;
          this.notificationExists = false;
        }, 300);
      });
    }
  }

  openMessages(id){
    this.router.navigate(['/pages/extra/chat'])
    this.messages = this.messages.filter(message=>message.id != id);
  }

  openNotifications(id){
    this.router.navigate(['/pages/users/profile'])
    this.notifications = this.notifications.filter(note=>note.id != id);
  }


  setArabic(){
    this.translate.setDefaultLang('ar');
    this.translate.use('ar');
    this.nbLayoutDirection.setDirection(NbLayoutDirection.RTL);
    localStorage.setItem('lang', 'ar');
  }

  setEnglish(){
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.nbLayoutDirection.setDirection(NbLayoutDirection.LTR);
    localStorage.setItem('lang', 'en');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
    localStorage.setItem('theme', themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  navigateToChat(){

  }

  logout() {
    let token = localStorage.getItem('token');
    if(token != null){
      this.api.protectedDelete('logout', token).subscribe((data) => {
        console.log(data);
      });
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }
  }
}
