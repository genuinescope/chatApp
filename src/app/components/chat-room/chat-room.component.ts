import { DatePipe } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import { from } from 'rxjs/internal/observable/from';
import { AuthServiceService } from '../../services/auth-service.service';
import { TemporaryStorageService } from 'src/app/services/temporary-storage.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {
  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop = null;
  isAdmin = true;
  chatForm: FormGroup;
  nickname: any;
  roomname: any;
  message: any;
  users: any;
  chats: any;
  selectedUser = {
    fullname: '',
    status: '',
    jobtitle: '',
    uid: ''
  };
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private chatService: ChatServiceService,
    private AuthServiceService: AuthServiceService,
    public datepipe: DatePipe,
    private temporaryStorageService: TemporaryStorageService
  ) {
    this.nickname = localStorage.getItem('nickname');
  }

  async ngOnInit(): Promise<void> {
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });

    //if user is admin
    if (localStorage.getItem('isAdmin') == '1') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    const userHeaders = from(this.chatService.getChatUsers()).subscribe(
      user => {
        let userData: any = Object.values(user);
        //if user is admin then display first chat
        if (this.isAdmin) {
          this.loadChat(userData[0].uid);
         
        }
        //if user is not admin ,load my chat history with admin
        if (!this.isAdmin) {
          this.loadChat(localStorage.getItem('uid'));
        }
        this.users = userData;
      }
    );

  }

  //save chat
  onFormSubmit(form: any) {
    const chat = form;
    if (this.isAdmin) {
      chat.nickname = 'Restaurant';
    } else {
      chat.nickname = this.selectedUser.fullname;
    }

    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    this.chatService.saveChat(this.selectedUser.uid, chat);
    let chacheMessage = {
      key: this.selectedUser.uid,
      value: ''
    }
    this.temporaryStorageService.set(chacheMessage);
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  //logout
  async exitChat() {
    console.log(this.selectedUser.uid);
    if (this.isAdmin) {
      this.chatService.updateUserOnlineStatus('8966f077-340c-def1-8a84-0185b3e30c8a', 'offline');
    } else {
      this.chatService.updateUserOnlineStatus(this.selectedUser.uid, 'offline');
    }
    localStorage.clear();
    localStorage.setItem('isLoggedIn', '0');
    this.AuthServiceService.setAuthStatus(false);
    this.router.navigate(['/login']);

  }

  //load chat when admin shifting from one user to another.
  loadChat(uid: any) {
    this.chatForm.controls['message'].setValue('');
    let chatCache = this.temporaryStorageService.get(uid);
    this.chatForm.controls['message'].setValue(chatCache);
    this.chats = [];
    this.chatService.getUserByUid(uid).subscribe(user => {
      this.selectedUser = user;
      console.log('...this.selectedUser...');
      console.log(this.selectedUser);
      this.chatService.getChatByUid(uid).subscribe(chat => {
        console.log('...chat..');
        console.log(chat);
        if (!!chat) {
          let chatDetails: any = Object.values(chat);
          this.chats = chatDetails;
        }
      });
    });

  }

  //save message cache when admin shifting from one user to another
  public saveToTemporaryStorage(): void {
    let chacheMessage = {
      key: this.selectedUser.uid,
      value: this.chatForm.controls['message'].value
    }

    this.temporaryStorageService.set(chacheMessage);
  }
}