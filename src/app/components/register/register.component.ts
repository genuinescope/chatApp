import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import { Md5 } from 'ts-md5/dist/md5';
import { Guid } from "guid-typescript";
import { DatePipe } from '@angular/common';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userKey: any;
  registerForm: FormGroup;
  validPassword = true;
  validUsername = true;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private chatService: ChatServiceService,
    public datepipe: DatePipe,
    private AuthServiceService: AuthServiceService) { }

  ngOnInit(): void {

    this.userKey = Guid.create().toString();
    this.registerForm = this.formBuilder.group({
      'fullname': [null, Validators.required],
      'jobtitle': [null, Validators.required],
      'username': [null, Validators.required],
      'password': [null, Validators.required],
      'confirmPassword': [null, Validators.required]
    });
  }
  backToLogin() {
    this.router.navigate(['/login']);
  }
  
  async onFormSubmit(form: any) {
    this.validUsername = true;
    const registerData = form;
    const snapshot = await this.chatService.checkUsername(registerData.username);
    if (registerData.username != null && registerData.username != '' && snapshot.exists()) {
      this.validUsername = false;
    } else {
      if (this.validPassword) {
        //do the registration
        let hash_password = Md5.hashStr(registerData.password);
        registerData.password = hash_password;
        registerData.uid = this.userKey;
        registerData.status = 'online';
        registerData.isAdmin = false;
        await this.chatService.createNewUser(this.userKey, registerData);
        this.AuthServiceService.setAuthStatus(true);
        localStorage.setItem('nickname', registerData.fullname);
        localStorage.setItem('uid', this.userKey);
        this.router.navigate(['/chatroom']);
      }
    }


  }

  onPasswordChange() {
    if (this.registerForm.controls["password"].value !== '' && this.registerForm.controls["confirmPassword"].value !== '' && this.registerForm.controls["password"].value !== null && this.registerForm.controls["confirmPassword"].value !== null && this.registerForm.controls["password"].value == this.registerForm.controls["confirmPassword"].value) {
      this.validPassword = true;
    } else {
      this.validPassword = false;
    }
  }
}
