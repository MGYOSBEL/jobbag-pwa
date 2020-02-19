import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/user/services/user.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  profileExtrasUrl: string;
  loggedUser;
  socialUser;
  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private socialAuthService: AuthService,
              private router: Router) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn) {
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      this.socialUser = JSON.parse(localStorage.getItem('socialUser'));
      console.log('NAVBAR: ', this.loggedUser);
    }
  }

  signout() {
    if (this.authenticationService.authProvider === 'GOOGLE' || this.authenticationService.authProvider === 'FACEBOOK') {
      this.socialAuthService.signOut();
    }
    this.authenticationService.signOut();
    this.router.navigate(['']);
  }

}
