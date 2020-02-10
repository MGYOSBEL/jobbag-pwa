import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs/operators';
import { Scholarship } from '../models/user.model';
import { relative } from 'path';

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


  constructor( private route: ActivatedRoute,
               private formBuilder: FormBuilder,
               private userService: UserService,
               private router: Router
               ) {

    this.profileExtrasForm = this.formBuilder.group({
      scholarship: ['', Validators.required],
      phoneNumber: [''],
      comments: [''],
      summary: ['']
    });


    this.role = this.route.snapshot.queryParams.role;
    this.isServiceProvider = (this.role === 'SERVICE_PROVIDER' );

  }

  ngOnInit() {
    // this.route.queryParamMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.role = (params.get('role'))));
    this.userService.getAllScolarships().subscribe(
      data => {
        this.scholarships = data;
      });
  }

  save() {

    const OAuth2Response = localStorage.getItem('bearerToken');
    const user_id = JSON.parse(OAuth2Response).user_id;

    const userProfileRequest = {
      "phone_number": this.profileExtrasForm.value.phoneNumber,
      "comment": this.profileExtrasForm.value.comments,
      "summary": this.profileExtrasForm.value.summary,
      "user_id": user_id,
      "scholarship_id": this.profileExtrasForm.value.scholarship,
      "user_profile_type": this.role
    };
    this.userService.setUserProfileData(userProfileRequest);

    if (this.role === 'SERVICE_PROVIDER') {
      this.router.navigate(['../', 'briefcase'], { relativeTo: this.route });
    } else {
      this.userService.createUserProfile()
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
