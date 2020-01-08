import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedin = false;

  constructor() { }

  login() {
    this.isLoggedin = true;
  }



}
