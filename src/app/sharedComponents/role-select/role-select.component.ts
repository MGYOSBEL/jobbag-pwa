import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { User } from '@app/user/models/user.model';
import { AuthenticationService } from '@app/auth/services/authentication.service';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.css']
})
export class RoleSelectComponent implements OnInit {

  returnUrl: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute) {
    // this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/auth/register';
  }

  ngOnInit() {
  }

  work() {
    this.userService.role = 'SERVICE_PROVIDER';
    const userId = this.authenticationService.getLoggedUserId();
    if (this.router.url.includes('user')) {
      this.router.navigate([`/user/${userId}/SERVICE_PROVIDER/create-profile`]);
    } else {
      this.router.navigate(['/auth/register/SERVICE_PROVIDER']);
    }
  }

  hire() {
    const userId = this.authenticationService.getLoggedUserId();
    this.userService.role = 'CLIENT';
    if (this.router.url.includes('user')) {
      this.router.navigate([`/user/${userId}/CLIENT/create-profile`]);
    } else {
      this.router.navigate(['/auth/register/CLIENT']);
    }
  }

}
