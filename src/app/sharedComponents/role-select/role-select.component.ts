import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.css']
})
export class RoleSelectComponent implements OnInit {

  returnUrl: string;
  constructor(private router: Router,
              private route: ActivatedRoute) {
      this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/auth/register';
  }

  ngOnInit() {
  }

  work() {
    localStorage.setItem('registrationRole', 'SERVICE_PROVIDER');
    this.router.navigate([this.returnUrl], { queryParams: { role: 'SERVICE_PROVIDER', function: 'CREATE' } });
  }

  hire() {
    localStorage.setItem('registrationRole', 'CLIENT');
    this.router.navigate([this.returnUrl], { queryParams: { role: 'CLIENT', function: 'CREATE' } });

  }

}
