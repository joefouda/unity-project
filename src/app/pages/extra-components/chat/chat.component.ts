import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service';
import { IMAGE_URL, DOMAIN_NAME } from '../../../providers/providers'

import { SelectUserComponent } from '../../modal-overlays/select-user/select-user.component'
import { NbDialogService, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import Echo from "laravel-echo"
(window as any).Pusher = require('pusher-js');

@Component({
  selector: 'ngx-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss'],
})
export class ChatComponent implements OnInit {



  messages: any[];
  req_messages;
  chat;
  sessions = [];
  token;
  loaded = false;
  users: any = [];
  myId;
  user;
  echo;
  sessionId;
  isTyping = false;
  typingName;
  companyGroup;
  imgURL;
  file;
  messageType = 'TEXT';
  mimeType;
  constructor(
    private api: ApiService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private translate: TranslateService,
  ) {
    // this.messages = this.chatService.loadMessages();
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user != null) {
      this.myId = this.user.id;
    }
    this.load();
  }

  load() {
    this.api.protectedGet("messages", this.token).subscribe((data: any) => {
      this.sessions = data.data;
      this.loaded = true;
    });

    this.api.protectedGet("company-chat", this.token).subscribe((data: any) => {
      this.companyGroup = data;
    });
  }

  openSession(chat, name, receiver_id) {
    this.chat = chat;
    this.sessionId = chat.id;
    this.chat.name = name;
    this.chat.receiver_id = receiver_id;
    this.api.protectedGet("messages/" + chat.id, this.token).subscribe((data: any) => {
      this.messages = data;
      this.initIoConnection();
      this.messages.forEach(element => {
        if (element.message_type != 'TEXT') {
          element.type = 'file';
          element.files = {
            url: element.message,
            type: element.message_type,
            icon: 'file-text-outline',
          };
        }
        element.reply = element.sender_id === this.myId;
      });
    })
  }


  async newConv() {
    if (this.users.length == 0) {
      this.users = await this.api.protectedGet('get-fellow-users', this.token).toPromise();
    }
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.req_messages = data;
        this.dialogService.open(SelectUserComponent, {
          context: {
            users: this.users
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedPost('create-session', { receiver_id: data }, this.token).subscribe((data) => {
              this.load();
              this.toastrService.success(this.req_messages.SUCCESS_INFO, this.req_messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.req_messages.ERROR_INFO, this.req_messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
        });
      });
  }

  preview(files) {
    this.imgURL = null
    files = files.target.files;
    if (files.length === 0)
      return;

    this.mimeType = files[0].type;
    this.file = files[0];

    if (this.mimeType.match(/image\/*/) == null) {
      this.imgURL = 'assets/imgs/file.png';
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }
  
  upload() {
    const uploadData = new FormData();
    uploadData.append('file', this.file, this.file.name);
    this.api.protectedPost('upload-file', uploadData, this.token).subscribe((data : any) => {
      this.messageType = "file";
      this.sendMessage({message: data.link})
    }, err => {
    })
  }

  sendMessage(event: any) {
    let files = [];
    if (this.messageType == 'file') {
      files = [{
        url: event.message,
        type: this.mimeType,
        icon: 'nb-compose',
      }]
    }
    this.api.protectedPost("messages", { message: event.message, message_session_id: this.chat.id, receiver_id: this.chat.receiver_id, message_type: this.messageType }, this.token).subscribe((data: any) => {
    })
    this.messages.push({
      message: event.message,
      date: new Date(),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      sender: {
        name: this.user.name,
        picture: 'https://i.gifer.com/no.gif',
      },
    });
    this.messageType = "TEXT";

    this.echo.private('session.' + this.sessionId)
      .listen('.message', (data) => {
        if (data.senderId == this.chat.receiver_id) {
          this.messages.push({
            message: data.message,
            date: new Date(),
            reply: false,
            type: files.length ? 'file' : 'text',
            files: files,
            sender: {
              name: data.user.name,
              picture: 'https://i.gifer.com/no.gif',
            },
          });
        }
      });
  }

  initIoConnection() {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'websocketkey',
      wsHost: 'api.unisync.app',
      wsPort: 6001,
      forceTLS: true,
      wssPort: 6001,
      disableStats: false,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: DOMAIN_NAME + 'broadcasting/auth',
      cluster: 'mt-1',
      auth: {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    });

    this.echo.private(`session.${this.sessionId}`)
      .listen('MessageSent', (data) => {
        if (data.user.id == this.chat.receiver_id) {
          this.messages.push({
            message: data.message.message,
            date: new Date(),
            reply: false,
            type: 'text',
            files: [],
            sender: {
              name: data.user.name,
              picture: data.user.picture ? IMAGE_URL + data.user.picture : 'assets/avatar.png',
            },
          });
        }
      }).listenForWhisper('typing', (e) => {
        this.isTyping = true;
        this.typingName = e.name;
        console.log(e);
        setTimeout(function () {
          this.isTyping = false
        }, 2000);
      });

    this.echo.private(`session.${this.sessionId}`)
      .listenForWhisper('typing', (e) => {
        this.isTyping = true;
        console.log(e);
        setTimeout(function () {
          this.isTyping = false
        }, 2000);
      });
  }

  whsiperTyping() {
    this.echo.private(`session.${this.sessionId}`)
      .whisper('typing', {
        name: this.user.name
      });
  }

  onTypingChange(searchValue: string): void {
    setTimeout(() => {
      this.whsiperTyping();
    }, 500);
  }
}
