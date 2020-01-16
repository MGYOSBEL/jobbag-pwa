import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { UserService } from './user.service';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { Observable, of, from } from 'rxjs';
import {TokenRequest} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // public members
  bearerToken;
  // private members
  private socialUser: SocialUser;
  private _isLoggedIn = false;
  private authProvider;
  private tokenRequest: TokenRequest = {
    client_id: null,
    client_secret: null,
    username: null,
    password: null,
    identity_source: null,
    id_token: null,
    token: null
  };

  // public methods
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  constructor(private http: HttpClient,
              private userService: UserService,
              private socialAuthService: AuthService,
              private logging: LoggingService) {
      this.socialAuthService.authState.subscribe(
        (user) => {
          this.socialLogin(user, this.authProvider );
        }
      );

  }


  signInWithJobbag(username: string, password: string) {
    this.logging.log('starting signInWithJobbag routine... (AuthenticationService)');
    const tokenRequestJSON = this.parseTokenRequest(username, password, 'JOBBAG');
    this.logging.log('exiting signInWithJobbag routine. Returning the post Observable(not subscribed yet)... (AuthenticationService)');
    return this.http.post<any>('http://localhost/login', tokenRequestJSON, { headers: { 'Content-type': 'application/json' } })
      .pipe(map(token => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.logging.log('Pipe routine of the login post request. saving the token... (AuthenticationService)');
        localStorage.setItem('bearerToken', JSON.stringify(token));
        this.bearerToken = token;
        this.logging.log('Setting _isLoggedIn to true. User is logged from now on... (AuthenticationService)');
        this._isLoggedIn = true;
        return token;
      }));

  }

  signInWithGoogle() {
    this.logging.log('starting signInWithGoogle routine...');
    this.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.logging.log('exiting signInWithGoogle routine...');
    return this.socialAuthService.authState;
  }

  signInWithFB() {
    this.logging.log('starting signInWithGoogle routine...');
    this.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.logging.log('exiting signInWithGoogle routine...');
    return this.socialAuthService.authState;
  }

  signOut(): void {
    if (this.tokenRequest.identity_source === 'GOOGLE' || this.tokenRequest.identity_source === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.socialUser = null;
    localStorage.removeItem('bearerToken');
    this._isLoggedIn = false;
  }


  // private mehods
  private parseTokenRequest(username?: string, password?: string, identity_source?: string, id_token?: string, token?: string) {

    this.tokenRequest = {
      client_id: null,
      client_secret: null,
      username: null,
      password: null,
      identity_source: null,
      id_token: null,
      token: null
    };
    this.logging.log('null token request: ' + JSON.stringify(this.tokenRequest) + ' ... (AuthenticationService)');
    this.tokenRequest.client_id = environment.clientId;
    this.tokenRequest.client_secret = environment.clientSecret;
    this.tokenRequest.identity_source = identity_source;

    if (identity_source === 'JOBBAG') {
      this.tokenRequest.username = username;
      this.tokenRequest.password = password;
    } else
      if (identity_source === 'FACEBOOK' || identity_source === 'GOOGLE') {
        this.tokenRequest.id_token = id_token;
        this.tokenRequest.token = token;
      }

    const tokenRequestJSON = JSON.stringify(this.tokenRequest);
    this.logging.log('Filled token request: ' + JSON.stringify(this.tokenRequest) + ' ... (AuthenticationService)');
    return tokenRequestJSON;

  }

  private socialLogin(user: SocialUser, authProvider: string) {
    this.logging.log('signInWithGoogle authState subscribe routine...');
    this.socialUser = user;
    if (user != null) {
      this.logging.log('_isLoggedIn:' + this._isLoggedIn);
      const tokenRequestJSON = this.parseTokenRequest(null, null, authProvider, this.socialUser.idToken, this.socialUser.authToken);
      this.http.post<any>('http://localhost/login', tokenRequestJSON, { headers: { 'Content-type': 'application/json' } })
        .subscribe(token => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.logging.log('saving the token for google');
          localStorage.setItem('bearerToken', JSON.stringify(token));
          this.bearerToken = token;
          this._isLoggedIn = true;
        });
    }
  }





}
