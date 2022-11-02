import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Inject,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DOCUMENT } from '@angular/common';
import { ApiService } from '../../../providers/api.service'
import { NbThemeService } from '@nebular/theme';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'ngx-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['calendar-new.component.scss'],
  templateUrl: 'calendar-new.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarNewComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  events = [];
  eventsWithoutHolidy = [];

  users: any = [];
  myId;
  activeDayIsOpen: boolean = true;
  private readonly darkThemeClass = 'dark-theme';
  token;
  loading = true;

  constructor(private modal: NgbModal, @Inject(DOCUMENT) private document,
    private api: ApiService,
    private themeService: NbThemeService,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    if (this.themeService.currentTheme == 'dark')
      this.document.body.classList.add(this.darkThemeClass);
    this.load();
    let user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.myId = user.id;
    }
  }

  load() {
    this.token = localStorage.getItem('token');
    var month = this.viewDate.getMonth() + 1;
   
    this.api.protectedGet("events?year=" + this.viewDate.getFullYear() + "&month=" + month, this.token).subscribe(async (data: any) => {
      this.loading = false;
      this.cdr.detectChanges();
      if (data.length > 0) {
        this.users = await this.api.protectedGet('get-fellow-users', this.token).toPromise();
        data.forEach(element => {
          let event = {
            id: element.id,
            user_ids: element.users_ids.map(userid=> userid === this.myId? element.user_id:userid),
            title: element.title,
            holdiay: false,
            user_id: element.user_id,
            start: new Date(element.starts_at),
            end: new Date(element.ends_at),
            color: {
              primary: element.color
            },
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
          }
          this.events.push(event);
        });
        this.refresh.next();
      }
    });
    this.api.protectedGet("holidays-all", this.token).subscribe((data: any) => {
      if (data.length > 0) {
        data.forEach(element => {
          this.events.push({
            id: element.id,
            user_ids: [],
            holdiay: true,
            user_id: null,
            title: element.name,
            start: new Date(element.from),
            end: new Date(element.to),
            color: colors.red,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
          },
          )
          if(element.is_yearly_repeated){
            for (let index = 1; index < 4; index++) {
              let starts = new Date(element.from);
              let end = new Date(element.to);
              starts.setFullYear(starts.getFullYear() + index);
              end.setFullYear(end.getFullYear() - index);
              this.events.push({
                id: element.id,
                user_ids: [],
                user_id: null,
                holdiay: true,
                title: element.name,
                start: starts,
                end: end,
                color: colors.red,
                draggable: true,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
              });
            }
          }
        });
      }
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  async addEvent() {
    this.events = [
      ...this.events,
      {
        id: null,
        user_ids: [],
        user_id: this.myId,
        title: 'New event',
        holdiay: false,
        start: null,
        end: null,
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    if (this.users.length == 0) {
      this.users = await this.api.protectedGet('get-fellow-users', this.token).toPromise();
    }
  }

  save(event, index) {
    console.log(event)
    event.start = new Date(event.start).toLocaleString()
    event.end = new Date(event.end).toLocaleString()
    this.api.protectedPost('events', event, this.token).subscribe((data: any) => {
      event.id = data.id;
      this.events[index] = event;
      this.cdr.detectChanges();
    })
  }

  deleteEvent(eventToDelete) {
    this.api.protectedDelete("events/" + eventToDelete.id, this.token).subscribe((data: any) => {
      this.cdr.detectChanges();
    })
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}