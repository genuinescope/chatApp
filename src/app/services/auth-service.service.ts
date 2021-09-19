import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  isAuthenticated = false;
  constructor() {

  }
  getAuthStatus(): any {
    return this.isAuthenticated;

  }
  setAuthStatus(status: any) {
    this.isAuthenticated = status;
  }
}
