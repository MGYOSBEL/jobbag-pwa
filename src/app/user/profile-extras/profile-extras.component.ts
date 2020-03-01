import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { UserService } from '../services/user.service';
import { switchMap, catchError } from 'rxjs/operators';
import { Scholarship } from '../models/user.model';
import { relative } from 'path';
import { ScholarshipService } from '../services/scholarship.service';
import { UserProfileService } from '../services/user-profile.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { of } from 'rxjs';
import { ErrorService } from '@app/errors/error.service';

@Component({
  selector: 'app-profile-extras',
  templateUrl: './profile-extras.component.html',
  styleUrls: ['./profile-extras.component.css']
})
export class ProfileExtrasComponent implements OnInit {

  // scholarship = new FormControl('');
  profileExtrasForm: FormGroup;

  scholarships: Scholarship[];
  isServiceProvider: boolean;
  role: string;
  function: string;




  constructor( private route: ActivatedRoute,
               private scholarshipService: ScholarshipService,
               private userProfileService: UserProfileService,
               private authenticationService: AuthenticationService,
               private errorService: ErrorService,
               private formBuilder: FormBuilder,
               private router: Router
               ) {

    this.role = this.route.snapshot.queryParams.role;
    this.function = this.route.snapshot.queryParams.function;
    this.isServiceProvider = (this.role === 'SERVICE_PROVIDER');

  }

  ngOnInit() {
    this.profileExtrasForm = this.formBuilder.group({
      scholarship: [this.function === 'CREATE' ? '' : this.userProfileService.currentUserProfile.scholarship, Validators.required],
      phoneNumber: [this.function === 'CREATE' ? '' : this.userProfileService.currentUserProfile.phone_number],
      comments: [this.function === 'CREATE' ? '' : this.userProfileService.currentUserProfile.comment],
      summary: [this.function === 'CREATE' ? '' : this.userProfileService.currentUserProfile.summary]
    });
    this.scholarshipService.getAll().subscribe(
      data => {
        this.scholarships = data;
      });
  }

  save() {

    const user_id = this.authenticationService.getLoggedUserId();

    const userProfileRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      phone_number: this.profileExtrasForm.value.phoneNumber,
      comment: this.profileExtrasForm.value.comments,
      summary: this.profileExtrasForm.value.summary,
      user_id: user_id,
      scholarship_id: this.profileExtrasForm.value.scholarship,
      user_profile_type: this.role
    };

    if (this.function === 'CREATE') {
      // this.userProfileService.cacheUserProfileData(userProfileRequest);


        this.userProfileService.create(userProfileRequest)
          .subscribe(
            response => {
              console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
              if (this.role === 'SERVICE_PROVIDER') {
                this.router.navigate(['../', 'briefcase'], { relativeTo: this.route });
              } else {
              // Navigate to Dashboard
              this.router.navigate(['../'], { relativeTo: this.route });
              }
            }, (err) => {
              this.errorService.errorMessage = err;
              this.router.navigate(['/error']);
            }
          );

    } else { // function === 'EDIT'
      this.userProfileService.edit(userProfileRequest)
        .subscribe(
          response => {
            console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
            // Navigate to Dashboard
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        );
    }
  }

  skip() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }



}
