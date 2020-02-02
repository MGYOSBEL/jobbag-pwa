import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoggingService } from '@app/services/logging.service';
import { SocialUser, AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { User } from '@app/user/models/user.model';
import { ErrorService } from '@app/errors/error.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('');
  password = new FormControl('');
  loginForm: FormGroup;
  returnUrl: string;

  socialUser: SocialUser;




  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private errorService: ErrorService,
              private socialAuthService: AuthService,
              private logging: LoggingService) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  jobbagLogin() {
    this.authenticationService.signInWithJobbag(this.email.value, this.password.value)
        .subscribe( data =>  {
          if (this.authenticationService.isLoggedIn) {
            const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
            this.router.navigate([this.returnUrl, user_id ]);
          }
        }, (error) => {
          this.errorService.errorMessage = error;
          this.router.navigate(['/error']);
          this.logging.log('error on the post request of the login method: ' + error + ' ... (LoginComponent)');
        });
  }

  facebookLogin() {
    this.authenticationService.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleLogin() {
    this.authenticationService.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe(
      (user) => {
        if (user != null) {
          this.logging.log('SocialUser: ' + JSON.stringify(user));
          this.logging.log('AuthProvider: ' + JSON.stringify(this.authenticationService.authProvider));
          this.socialUser = user;
          this.authenticationService.socialLogin(user, this.authenticationService.authProvider).subscribe(
            (data) => {
              this.logging.log('googleLogin - entering signInWithGoogle subscribe callback');
              if (data) {
                const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
                console.log('googleLogin - user_id: ' + user_id);
                console.log('googleLogin - returnUrl: ' + this.returnUrl);
                this.router.navigate([this.returnUrl, user_id]);
              } else {
                this.logging.log('isLoggedIn subscription was false.... (LoginComponent)');
              }
            }
            // }, (error) => {
            //   this.errorService.errorMessage = error;
            //   this.router.navigate(['/error']);
            //   this.logging.log('error on the post request of the login method: ' + JSON.stringify(error) + ' ... (LoginComponent)');
            // }
          );
        }
      }
    );

  }

}
