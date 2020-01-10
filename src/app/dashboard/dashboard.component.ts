import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  $loggedUser: Observable<User>;
  constructor(private userService: UserService, private logging: LoggingService) {
  }

  ngOnInit() {
    this.logging.log('initiating dashboard');
    this.$loggedUser = this.userService.getUser();
  }

}
