import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute) {

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/user';
  }

  ngOnInit() {
  }

  register() {

  }

  facebookLogin() {

  }

  googleLogin() {

  }

}
