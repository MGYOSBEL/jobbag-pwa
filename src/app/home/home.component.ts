import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/user/services/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { ScholarshipService } from '@app/user/services/scholarship.service';
import { ProfessionService } from '@app/user/services/profession.service';
import { LoggingService } from '@app/services/logging.service';
import { tap } from 'rxjs/operators';
import { LoadingService } from '@app/services/loading.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private scholarshipService: ScholarshipService,
    private logger: LoggingService,
    private userService: UserService,
    private loadingService: LoadingService,
    private professionService: ProfessionService) { }
  userId: string;

  ngOnInit() {
    this.userId = this.authenticationService.getLoggedUserId();
    this.authenticationService.isLoggedIn$.subscribe(
      login => {
        if (login) {
          this.getUser();
        }
      }
    );
  }

  getUser() {
    // this.loadingService.loadingOn();
    const userId = this.authenticationService.getLoggedUserId();
    const user$ = this.userService.get(userId);
    this.loadingService.showLoaderUntilCompletes(user$).subscribe();

  }


}

