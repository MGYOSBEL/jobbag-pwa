import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RegisterRequest } from '../models/auth.model';
import { QueryValueType } from '@angular/compiler/src/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = new FormControl('');
  name = new FormControl('');
  password = new FormControl('');
  confirmPassword = new FormControl('');
  registerForm: FormGroup;
  returnUrl: string;

  registerRequest: RegisterRequest;

  loading = false;
  socialUser: SocialUser;
  hiddenPasswords = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private logging: LoggingService,
              private socialAuthService: AuthService,
              private authenticationService: AuthenticationService) {

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe(
      (user) => {
        if (user != null && this.loading === true) {
          this.loading = false;
          this.hiddenPasswords = true;
          this.socialUser = user;
          localStorage.clear();
          localStorage.setItem('socialUser', JSON.stringify(user));
          this.email.setValue(user.email);
          this.name.setValue(user.name);
          this.password.setValue(user.name);
          this.confirmPassword.setValue(user.name);
        }
      }
    );

  }

  register() {
    this.loading = true;
    this.registerRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      username: this.name.value,
      password: this.password.value,
      email: this.email.value
    };
    console.log(this.registerRequest);
    this.http.post<any>('http://localhost/user', this.registerRequest, { headers: { 'Content-type': 'application/json' } })
      .subscribe(
        (data) => {
          if (data.status_code === 200) {
            const content = JSON.parse(JSON.parse(data.content));
            const username = content.username;
            console.log('content: ' + content);
            console.log(JSON.stringify('username: ' + username));
            this.authenticationService.signInWithJobbag(this.name.value, this.password.value).subscribe(
              data => {
                const role = this.route.snapshot.queryParams.role;
                console.log('role: ' + role);
                if (this.authenticationService.isLoggedIn) {
                  const user_id = JSON.parse(JSON.parse(localStorage.getItem('bearerToken')).content).user_id;
                  const profileExtrasUrl = '/user/' + user_id + '/profile-extras';
                  if (role) {
                    console.log('navegando a profile extras...');
                    this.router.navigate([profileExtrasUrl], { queryParams: { role } });
                  } else {
                    this.router.navigate(['/user/3/select-role'], { queryParams: { returnUrl: profileExtrasUrl } });
                  }
                }
              });
          }

        });

  }

  facebookLogin() {
    this.loading = true;
    this.authenticationService.authProvider = 'FACEBOOK';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  googleLogin() {
    this.loading = true;
    this.authenticationService.authProvider = 'GOOGLE';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');

  //   return password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMissMatch': true } ;
  // }

}
