import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserProfileService } from '../services/user-profile.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ErrorService } from '@app/errors/error.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';
import { environment } from '@environments/environment';
import { BriefcaseService } from '../services/briefcase.service';
import { ActiveProfileService } from '../services/active-profile.service';

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
  imageBase64: string;
  cvBase64: string;
  imageLoaded: boolean;
  cvUrl: any;
  name: AbstractControl;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private userProfileService: UserProfileService,
              private activeProfileService: ActiveProfileService,
              private briefcaseService: BriefcaseService,
              private errorService: ErrorService,
              private router: Router,
              private route: ActivatedRoute
              ) {

    this.imageLoaded = false;
    this.profileForm = this.formBuilder.group({
      accountType: ['PERSONAL', Validators.required],
      accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      companyName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
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
      picture: this.imageBase64,
      cv: this.cvBase64,
      user_profile_type: this.role,
      user_profile_account: this.profileForm.value.accountType,
      name: this.name.value,
      user_profile_briefcase: this.briefcaseService.briefcases.map(briefcase => {
        return {
          description: briefcase.description,
          end_date: briefcase.enddate,
          start_date: briefcase.startdate,
          comments: briefcase.comments,
          id_profession: briefcase.idProfessionFk
        };
      })
    };
    console.log('userProfileRequest: ', JSON.stringify(userProfileRequest));
    this.userProfileService.create(userProfileRequest)
    .subscribe(
      response => {
        console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
        this.role === 'CLIENT' ? this.activeProfileService.activateClient() : this.activeProfileService.activateServiceProvider() ;
        this.router.navigate(['../'], {relativeTo: this.route});
      }, (err) => {
        this.errorService.errorMessage = err;
        this.router.navigate(['/error']);
      }
    );
   }

  uploadPicture(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.imageBase64 = this.previewUrl.toString().split(',')[1];
    };
    this.imageLoaded = true;
  }

  uploadCV(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.cvUrl = reader.result;
      this.cvBase64 = this.cvUrl.toString().split(',')[1];
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
