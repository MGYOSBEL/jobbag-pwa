import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/user/services/user.service';

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
    private route: ActivatedRoute) {
    // this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/auth/register';
  }

  ngOnInit() {
  }

  work() {
    this.userService.role = 'SERVICE_PROVIDER';
    this.router.navigate([`${this.router.url}/SERVICE_PROVIDER`]);
  }

  hire() {
    this.userService.role = 'CLIENT';
    this.router.navigate([`${this.router.url}/CLIENT`]);

  }

}
