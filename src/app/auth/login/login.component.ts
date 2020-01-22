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
import { SocialUser } from 'angularx-social-login';
import { User } from '@app/user/models/user.model';


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




  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private logging: LoggingService) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  jobbagLogin() {
    this.logging.log('submitting the form...Subscribing to the post Observable returned from signInWithJobbag (LoginComponent)');
    this.authenticationService.signInWithJobbag(this.email.value, this.password.value)
        .subscribe( data =>  {
          if (this.authenticationService.isLoggedIn) {
            this.logging.log('Callback method for the login. isLoggedIn==true, so navigating to dashboard... (LoginComponent)');
            this.router.navigate([this.returnUrl]);
          }
        }, (error) => {
          // this.router.navigate(['']);
          this.logging.log('error on the post request of the login method: ' + error + ' ... (LoginComponent)');
        });
  }

  facebookLogin() {
    this.authenticationService.signInWithFB().subscribe (
      (user) => {
        if (user != null ) {
          this.logging.log('isLoggedIn subscription was true. Lets router navigate.... (LoginComponent)');
          this.logging.log('The USER is: ' + JSON.stringify(user));
          this.router.navigate([this.returnUrl]);
        } else {
          this.logging.log('isLoggedIn subscription was false.... (LoginComponent)');
        }
      }
    );
  }

  googleLogin() {
    this.authenticationService.signInWithGoogle().subscribe (
      (user) => {
        if (user != null ) {
          this.logging.log('isLoggedIn subscription was true. Lets router navigate.... (LoginComponent)');
          this.logging.log('The USER is: ' + JSON.stringify(user));
          this.router.navigate([this.returnUrl]);
        } else {
          this.logging.log('isLoggedIn subscription was false.... (LoginComponent)');
        }
      }
    );
    // this.router.navigate([this.returnUrl]);
  }

  ngOnInit() {

  }

}
