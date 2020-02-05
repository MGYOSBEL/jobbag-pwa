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

  scholarship = new FormControl('');
  phoneNumber = new FormControl('');
  comments = new FormControl('');
  summary = new FormControl('');
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
    const user_id = JSON.parse(JSON.parse(OAuth2Response).content).user_id;

    const userProfileRequest = {
      "client_id": environment.clientId,
      "client_secret": environment.clientSecret,
      "phone_number": this.phoneNumber.value,
      "comment": this.comments.value,
      "summary": this.summary.value,
      "user_id": user_id,
      "scholarship_id": 1,
      "user_profile_type": this.role
    };
    console.log('createUserProfile REQUEST: ' + userProfileRequest);
    console.log('createUserProfile scholarship select: ' + this.scholarship.get('id'));
    this.userService.createUserProfile(userProfileRequest).subscribe(
      response => {
        console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
        this.router.navigate(['../', 'edit-professions'], {relativeTo: this.route});
      }
    );
  }

  skip() {
    this.router.navigate(['../', 'edit-professions'], {relativeTo: this.route});
  }

}
