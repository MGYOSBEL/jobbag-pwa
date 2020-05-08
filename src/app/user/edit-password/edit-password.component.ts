import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { LoadingService } from '@app/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessagesService } from '@app/services/messages.service';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  passwordForm: FormGroup;

  loggedUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private logger: LoggingService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', [ Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [ Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.passwordForm.valueChanges.subscribe(
      value => {
        if (value.newPassword !== value.confirmPassword) {
          this.passwordForm.setErrors({ passwordsMissmatch: true });
        }
        if (value.password === value.newPassword) {
          this.passwordForm.setErrors({ samePassword: true });
        }
      }
    );

    this.loggedUser = this.userService.loggedUser;

  }

  submit() {
    this.logger.log(this.passwordForm.value);
    const editPwdRequest = {
      id: this.loggedUser.id,
      username: this.loggedUser.username,
      password: this.passwordForm.value.password,
      new_password: this.passwordForm.value.newPassword
    };
    const request$ = this.userService.editPassword(editPwdRequest);

    this.loading.showLoaderUntilCompletes(request$).subscribe(
      res => {},
      err => this.messages.showErrors(err),
      () => this.router.navigate(['../CLIENT'], {relativeTo: this.route})
    );
  }

}
