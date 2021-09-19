import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemporaryStorageService {

  constructor() { }

  // I get the data associated with the given key.
  public get(uid: any): any {
    return localStorage.getItem(uid);

  }

  // I store the given value with the given key.
  public set(chacheMessage: any): void {
    if (localStorage.getItem(chacheMessage.value) !== '') {
      localStorage.setItem(chacheMessage.key, chacheMessage.value);
    }

  }
}
