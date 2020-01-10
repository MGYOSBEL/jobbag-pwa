import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators';
import { UserService } from './user.service';
import { LoggingService } from '../logging.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tokenRequestJson = {
    'client_id': '4_4zvxgaapb50kgsc4gw0cgso4gg80sss8kcokkososcwg4g4oco',
    'client_secret': '3zsn78hmyri84s4cssgww84c4wssoscos8cw8gok00g8w4oc8c',
    'grant_type': 'password',
    'username': 'test_user',
    'password': 'test'
   };

   bearerToken;

  isLoggedin = false;

  constructor(private http: HttpClient, private userService: UserService, private logging: LoggingService) { }

  login(email: string, password: string) {
    this.logging.log('starting login routine(authService)');
    return this.http.post<any>('http://localhost/oauth/v2/token', this.tokenRequestJson)
  .pipe(map(token => {
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  this.logging.log('saving the token');
  localStorage.setItem('bearerToken', JSON.stringify(token));
  this.bearerToken = token;
  this.isLoggedin = true;
  return token;
}));

}

// requestBearerToken() {
//   return this.http.post<any>('http://localhost/oauth/v2/token', this.tokenRequestJson)
//   .pipe(map(token => {
//   // store user details and jwt token in local storage to keep user logged in between page refreshes
//   localStorage.setItem('bearerToken', JSON.stringify(token));
//   this.bearerToken = token;
//   this.isLoggedin = true;
//   return token;
// }));
// }



}
