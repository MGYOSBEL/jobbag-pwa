import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessagesService } from '@app/services/messages.service';
import { LoadingService } from '@app/services/loading.service';
import { interval } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messages: MessagesService,
    private loading: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.forgotForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
  }

  submit() {
    const call$ = interval(2000).pipe(
      take(1),
      tap( res => console.log(res))
    );

    this.loading.showLoaderUntilCompletes(call$).subscribe(
      () => this.router.navigate(['../login'], {relativeTo: this.route}),
      err => this.messages.showErrors('Something went wrong. Try again later.')
    );
  }

}
