import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { SocialUser } from 'angularx-social-login';


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
      email: [' ', Validators.required],
      password: [' ', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit() {
    this.logging.log('submitting the form');
    this.authenticationService.signInWithJobbag(this.email.value, this.password.value)
        .subscribe( data =>  {
          this.loginCallback(data);
        }, (error) => {
          // this.router.navigate(['']);
          this.logging.log('error on the post request of the login method: ' + error);
        });
  }

  facebookLogin() {
    this.authenticationService.signInWithFB();
  }

  googleLogin() {
    this.authenticationService.signInWithGoogle()
    .then(
      data => {
        this.loginCallback(data);
      }
    );

  }

  loginCallback( data: any ) {
    this.logging.log('object on the post callback: ' + data);
    this.email.setValue('');
    this.password.setValue('');

    this.router.navigate([this.returnUrl]);
  }

  ngOnInit() {

  }

}
