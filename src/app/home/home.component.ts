import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/user/services/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth/services/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) { }
  userId: string;

  ngOnInit() {
    this.userId = this.authenticationService.getLoggedUserId();
  }



}

