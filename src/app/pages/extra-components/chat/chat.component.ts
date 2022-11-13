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
    console.log(this.user)
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
      console.log(this.messages)
      this.initIoConnection();
      this.messages.forEach(element => {
        if (element.message_type != 'TEXT') {
          element.message = ''
          element.message_type = 'file';
          element.files[0].icon = 'file-text-outline'
        }
        element.sender.picture = element.sender.picture?'https://api.unisync.app/storage/employees/'+element.sender.picture : element.sender.picture
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
      this.imgURL = '../../../../assets/images/file.png';
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }
  
  // upload() {
  //   const uploadData = new FormData();
  //   uploadData.append('file', this.file, this.file.name);
  //   this.api.protectedPost('upload-file', uploadData, this.token).subscribe((data : any) => {
  //     this.messageType = "file";
  //     this.sendMessage({message: data.link})
  //   }, err => {
  //   })
  // }

  sendMessage(event: any) {
    const fullMessage = new FormData();
    fullMessage.append('message_session_id', this.chat.id);
    fullMessage.append('receiver_id', this.chat.receiver_id);

    if(this.file){
      fullMessage.append('message_type', 'FILE');
      fullMessage.append('file', this.file);
      fullMessage.append('file_type', this.file.type)
    } else {
      fullMessage.append('message_type', 'TEXT');
      fullMessage.append('message', event.message);
    }


    this.api.protectedPost("messages", fullMessage, this.token).subscribe((data: any) => {
      this.messages.push({
        message: data.message.message.includes('https://api.unisync.app')?'':data.message.message,
        created_at: new Date(),
        reply: true,
        message_type:data.message.message.includes('https://api.unisync.app')?'file':'text',
        files: [
          {
            url:data.message.message,
<<<<<<< HEAD
            type:this.file?.type,
=======
            type:this.file.type,
>>>>>>> 30799142f3327aa0c73ea81058137699399a27bd
            icon: 'file-text-outline'
          }
        ],
        sender: {
          name: this.user.name,
          picture: this.user.picture ?'https://api.unisync.app/storage/employees/'+this.user.picture : this.user.picture,
        },
      });
      this.imgURL = ''
    })
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
            message: data.message.message.includes('https://api.unisync.app')?'':data.message.message,
            created_at: new Date(),
            reply: false,
            message_type: data.message.message.includes('https://api.unisync.app')?'file':'text',
            files: [
              {
                url:data.message.message,
                type:data.message.file_type,
                icon: 'file-text-outline'
              }
            ],
            sender: {
              name: data.user.name,
              picture: data.user.picture ?'https://api.unisync.app/storage/employees/'+data.user.picture : data.user.picture,
            },
          });
        }
      }).listenForWhisper('typing', (e) => {
        this.isTyping = true;
        this.typingName = e.name;
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
