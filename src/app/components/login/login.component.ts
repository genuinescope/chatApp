import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import { Md5 } from 'ts-md5/dist/md5';
import { DatePipe } from '@angular/common';
import { AuthServiceService } from '../../services/auth-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  nickname = '';
  isValidUser = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private chatService: ChatServiceService,
    public datepipe: DatePipe,
    private AuthServiceService: AuthServiceService
  ) {
    localStorage.setItem('isAdmin', '0');
  }

  ngOnInit(): void {

    if (this.AuthServiceService.getAuthStatus()) {
      // this.router.navigate(['/chatRoom']);
      this.router.navigate(['chatRoom']);
    }
    this.loginForm = this.formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }
  async onFormSubmit(form: any) {
    this.isValidUser = true;
    const login = form;

    const snapshot = await this.chatService.checkUser(login.username);

    if (snapshot.exists()) {
      let userData: any = Object.values(snapshot.val());
      let hash_password = Md5.hashStr(login.password);
      if (!!userData[0] && userData[0].password == hash_password) {
        if (!!userData[0] && !!userData[0].isAdmin && userData[0].isAdmin == true) {
          localStorage.setItem('isAdmin', '1');
        }

        localStorage.setItem('nickname', userData[0].fullname);
        localStorage.setItem('uid', userData[0].uid);
        this.AuthServiceService.setAuthStatus(true);
        this.chatService.updateUserOnlineStatus(userData[0].uid, 'online');
        this.router.navigate(['/chatroom']);
      }
    } else {
      this.AuthServiceService.setAuthStatus(false);
      this.isValidUser = false;
    }

  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
