import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { first, switchMap, catchError } from 'rxjs/operators';
import { LoggingService } from '@app/services/logging.service';
import { SocialUser, AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { User } from '@app/user/models/user.model';
import { ErrorService } from '@app/errors/error.service';
import { UserService } from '@app/user/services/user.service';
import { LoadingService } from '@app/services/loading.service';
import { MessagesService } from '@app/services/messages.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  socialLogin$: Observable<any>;
  socialUser: SocialUser;
  loading = false;
  loginErr: {
    err: boolean;
    message?: string;
  };



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private errorService: ErrorService,
    private socialAuthService: AuthService,
    private loadingService: LoadingService,
    private messages: MessagesService,
    private logger: LoggingService) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.loading = false;
    this.loginErr = { err: false };
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  jobbagLogin() {
    this.loadingService.loadingOn();
    this.authenticationService.signInWithJobbag(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        catchError(err => throwError(err)),
        switchMap(bearer => this.userService.get(bearer.user_id))
      )
      .subscribe(
        data => {
          if (this.authenticationService.isLoggedIn) {
            const returnURL = localStorage.getItem('returnURL');
            if (returnURL != null) {
              this.router.navigateByUrl(returnURL);
            } else {
              this.router.navigate(['/']);
            }
          }
          this.loadingService.loadingOff();
        },
        (error) => {
          this.errorService.errorMessage = error;
          const message = ` ${error}`;
          this.messages.showErrors(message);
          this.loadingService.loadingOff();
        });
  }

  facebookLogin() {
    this.loading = true;
    this.loadingService.loadingOn();
    this.authenticationService.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleLogin() {
    this.loading = true;
    this.loadingService.loadingOn();
    this.authenticationService.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit() {
    this.socialLogin$ = this.socialAuthService.authState.pipe(
      switchMap(user => {
        if (user != null && this.loading === true) {
          this.socialUser = user;
          localStorage.clear();
          localStorage.setItem('socialUser', JSON.stringify(user));
          return this.authenticationService.socialLogin(user, this.authenticationService.authProvider);
        } else {
          return EMPTY;
        }
      })
    );

    this.socialLogin$.subscribe(
      (data) => {
        if (data.status_code) {
          this.loading = false;
          this.loadingService.loadingOff();
          this.loginErr = { err: true, message: data.text };
          const message = `There was an error: ${data.text}`;
          this.messages.showErrors(message);
        } else {
          const user_id = this.authenticationService.getLoggedUserId();
          this.router.navigate([this.returnUrl, user_id, 'CLIENT']);
        }
      }
    );

    // this.socialAuthService.authState.subscribe(
    //   (user) => {
    //     if (user != null && this.loading === true) {
    //       this.socialUser = user;
    //       localStorage.clear();
    //       localStorage.setItem('socialUser', JSON.stringify(user));
    //       this.authenticationService.socialLogin(user, this.authenticationService.authProvider).subscribe(
    //         (data) => {
    //           if (data.status_code) {
    //             this.loading = false;
    //             this.loadingService.loadingOff();
    //             this.loginErr = { err: true, message: data.text };
    //             const message = `There was an error: ${data.text}`;
    //             this.messages.showErrors(message);
    //           } else {
    //             const user_id = this.authenticationService.getLoggedUserId();
    //             this.router.navigate([this.returnUrl, user_id, 'CLIENT']);
    //           }
    //         }
    //       );
    //     }
    //   }
    // );

  }

}
