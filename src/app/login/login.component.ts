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
    this.authenticationService.login(this.email.value, this.password.value)
        .subscribe( data =>  {
          this.logging.log(data);
          this.email.setValue('');
          this.password.setValue('');

          this.router.navigate([this.returnUrl]);
        });


  }

  ngOnInit() {

  }

}
