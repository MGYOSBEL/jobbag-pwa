import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs/operators';
import { Scholarship } from '../models/user.model';
import { relative } from 'path';
import { ScholarshipService } from '../services/scholarship.service';
import { UserProfileService } from '../services/user-profile.service';

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

    const OAuth2Response = localStorage.getItem('bearerToken');
    const user_id = JSON.parse(OAuth2Response).user_id;

    const userProfileRequest = {
      phone_number: this.profileExtrasForm.value.phoneNumber,
      comment: this.profileExtrasForm.value.comments,
      summary: this.profileExtrasForm.value.summary,
      user_id: user_id,
      scholarship_id: this.profileExtrasForm.value.scholarship,
      user_profile_type: this.role
    };

    if (this.function === 'CREATE') {
      this.userProfileService.cacheUserProfileData(userProfileRequest);

      if (this.role === 'SERVICE_PROVIDER') {
        this.router.navigate(['../', 'briefcase'], { relativeTo: this.route });
      } else {
        this.userProfileService.create()
          .subscribe(
            response => {
              console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
              // Navigate to Dashboard
              this.router.navigate(['../'], { relativeTo: this.route });
            }
          );
      }
    } else { // function === 'EDIT'
      this.userProfileService.edit()
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
