import { Component, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class ChatServiceService {
  users = [];
  items: any;
  chats = [];
  item: any;
  scrolltop: any;

  item$: Observable<any>;
  constructor(
    private db: AngularFireDatabase
  ) {
  }

  //get all users from db
  getChatUsers(): Observable<any[]> {
    return this.db.object('/users').valueChanges().pipe(map((val: any) => {
      return val;
    }));
  }

  //get chat details from user id
  getChatByUid(uid: any): Observable<any> {
    return this.db.object('chats/' + uid).valueChanges();
  }

  //get user details from user id
  getUserByUid(uid: any): Observable<any> {
    return this.db.object('users/' + uid).valueChanges();
  }

  //save specific chat data
  saveChat(chatId: any, chat: any): Promise<any> {
    return this.db
      .list('/chats/' + chatId)
      .push(chat);
  }

  //update if user is online or offline
  updateUserOnlineStatus(userId: any, status: any): Promise<any> {
    console.log(userId); console.log(status);
    return this.db.object('/users/' + userId + '/status').set(status)
  }

  //register new user
  createNewUser(key: any, user: any) {
    this.db
      .object('/users/' + key)
      .set(user);
  }

  //check username if exists
  async checkUsername(username: any) {
    return this.db.database.ref('users/').orderByChild('username').equalTo(username).once("value", (snapshot) => {
      return snapshot;
    });

  }


  async checkUser(username: any) {
    return this.db.database.ref('users/').orderByChild('username').equalTo(username).once("value", (snapshot) => {
      return snapshot;
    });

  }
}
