import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserProfileService } from '../services/user-profile.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ErrorService } from '@app/errors/error.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { environment } from '@environments/environment';
import { BriefcaseService } from '../services/briefcase.service';
import { ActiveProfileService } from '../services/active-profile.service';
import { UserProfile } from '../models/user.model';
import { MediaService } from '../services/media.service';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  private stepper: Stepper;
  model: any;
  previewUrl: any;
  profileForm = new FormGroup({});
  activeProfile: UserProfile;
  role: string;
  name: AbstractControl;
  errors: string[] = [];


  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService,
              private activeProfileService: ActiveProfileService,
              private briefcaseService: BriefcaseService,
              private errorService: ErrorService,
              private mediaService: MediaService,
              private router: Router,
              private route: ActivatedRoute
              ) {
    this.activeProfileService.activeProfileType$.subscribe(
      profileType => {
        this.activeProfile = profileType === 'CLIENT' ? this.userProfileService.client : this.userProfileService.serviceProvider;
      }
    );
    this.profileForm = this.formBuilder.group({
      accountType: [this.activeProfile.userProfileAccount],
      accountName: [this.activeProfile.userProfileAccount === 'PERSONAL' ? this.activeProfile.name : ''],
      companyName: [this.activeProfile.userProfileAccount === 'COMPANY' ? this.activeProfile.name : ''],
      profilePicture: [''],
      countries: [''],
      services: [''],
      curriculum: [''],
      comments: [this.activeProfile.comment],
      gallery: ['']
    });


  }


  ngOnInit() {

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true

    });
    if (this.activeProfile.picture.length > 0) { // Si length > 0 tiene foto de perfil
      this.previewUrl = environment.serverBaseURL + this.activeProfile.picture;
    } else {
      this.previewUrl = '../../assets/defaultProfile.png';
    }
    this.role = 'SERVICE_PROVIDER';

    this.profileForm.get('accountType').valueChanges.subscribe(
      value => {
        if (value === 'PERSONAL') {
          this.profileForm.get('accountName').enable();
          this.profileForm.get('companyName').disable();
          this.name = this.profileForm.get('accountName');
        } else {
          this.profileForm.get('accountName').disable();
          this.profileForm.get('companyName').enable();
          this.name = this.profileForm.get('companyName');

        }
      }
    );
    this.profileForm.get('accountType').setValue('PERSONAL');
  }

  editUserProfile() {
    const user_id = this.authenticationService.getLoggedUserId();

    const request = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      id: this.activeProfile.id,
      phone_number: 'phoneNumber for the user: ' + user_id,
      comment: this.profileForm.value.comments,
      summary: 'summary for the user: ' + user_id,
      user_id: user_id,
      scholarship_id: this.activeProfile.scholarshipid,
      picture: '',
      cv: '',
      user_profile_type: this.role,
      user_profile_account: this.profileForm.value.accountType,
      name: this.name.value,
      user_profile_briefcase: this.briefcaseService.briefcases
    };
    this.userProfileService.edit(request).subscribe(
     response => {
       console.log(response);
       this.router.navigate(['../'], {relativeTo: this.route});
     },
     err => this.errors.push(err)
    );
  }

  edit() {

  }

  next() {
    this.stepper.next();
   }

  previous() {
    this.stepper.previous();
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
