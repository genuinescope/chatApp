import { Component, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
// export const snapshotToArray = (snapshot: any) => {
//   const returnArr: any = [];

//   snapshot.forEach((childSnapshot: any) => {
//     const item = childSnapshot.val();
//     item.key = childSnapshot.key;
//     returnArr.push(item);
//   });

//   return returnArr;
// };
export const snapshotToArray = (snapshot: any) => {

  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot;
    returnArr.push(item);
  });

  return returnArr;
};

@Injectable({
  providedIn: 'root'
})


export class ChatServiceService {
  // @ViewChild('chatcontent')
  // chatcontent!: ElementRef;
  // private itemsCollection: AngularFirestoreCollection<any>;
  users = [];
  items: any;
  chats = [];
  item: any;
  scrolltop: any;
  // ref = firebase.database().ref('users/');

  item$: Observable<any>;
  constructor(
    private db: AngularFireDatabase
  ) {


  }

  getChatUsers(): Observable<any[]> {
    return this.db.object('/users').valueChanges().pipe(map((val: any) => {
      return val;
    }));
  }

  getChatByUid(uid: any): Observable<any> {
    return this.db.object('chats/' + uid).valueChanges();
  }
  getUserByUid(uid: any): Observable<any> {
    return this.db.object('users/' + uid).valueChanges();
  }

  saveChat(chatId: any, chat: any): Promise<any> {
    return this.db
      .list('/chats/' + chatId)
      .push(chat);
  }
  updateUserOnlineStatus(userId: any, status: any): Promise<any> {
    console.log(userId);console.log(status);
    return this.db.object('/users/' + userId + '/status').set(status)
  }

  createNewUser(key: any, user: any) {
    this.db
      .object('/users/' + key)
      .set(user);
  }


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
