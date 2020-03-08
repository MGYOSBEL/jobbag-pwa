import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserProfileService } from '../services/user-profile.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ErrorService } from '@app/errors/error.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { environment } from '@environments/environment';
import { BriefcaseService } from '../services/briefcase.service';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  private stepper: Stepper;
  model: any;
  previewUrl: any;
  profileForm: FormGroup;
  role: string;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService,
              private briefcaseService: BriefcaseService,
              private errorService: ErrorService,
              private router: Router,
              private route: ActivatedRoute
              ) {

    this.profileForm = this.formBuilder.group({
      accountName: [''],
      companyName: [''],
      profilePicture: [''],
      countries: [''],
      services: [''],
      curriculum: [''],
      comments: [''],
      gallery: ['']
    });
   }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true

    });
    this.previewUrl = '../../assets/defaultProfile.png';
    this.role = 'SERVICE_PROVIDER';
  }

  next() {
    this.stepper.next();
   }

  previous() {
    this.stepper.previous();
   }

   createUserProfile() {

    const user_id = this.authenticationService.getLoggedUserId();

    const userProfileRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      phone_number: 'phoneNumber for the user: ' + user_id,
      comment: this.profileForm.value.comments,
      summary: 'summary for the user: ' + user_id,
      user_id: user_id,
      scholarship_id: 1,
      user_profile_type: this.role,
      user_profile_briefcase: this.briefcaseService.briefcases
    };
    this.userProfileService.create(userProfileRequest)
    .subscribe(
      response => {
        console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));

      }, (err) => {
        this.errorService.errorMessage = err;
        this.router.navigate(['/error']);
      }
    );
   }

   createBriefcase() {

   }

   preview(event) {
     const file = (event.target as HTMLInputElement).files[0];
     let reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = (_event) => {
       this.previewUrl = reader.result;
     };
   }

   search = (text$: Observable<string>) =>
     text$.pipe(
       debounceTime(200),
       distinctUntilChanged(),
       map(term => term.length < 2 ? []
         : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
     )

}
