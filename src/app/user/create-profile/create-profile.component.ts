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
import { Country, DivisionValue, DivisionElement } from '../models/country.model';
import { CountryService } from '../services/country.service';
import { DatePipe } from '@angular/common';

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
  styleUrls: ['./create-profile.component.css'],
  providers: [DatePipe]
})
export class CreateProfileComponent implements OnInit {
  uploadedCV: boolean;
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
  countries$: Observable<Country>;
  divisions: string[];
  activeStep: number;
  countryDivisions: number[] = [];
  myDate = new Date();
  currentDate: string;
  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService,
    private briefcaseService: BriefcaseService,
    private errorService: ErrorService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.role = this.route.snapshot.params.role;

    this.imageLoaded = false;
    this.profileForm = this.formBuilder.group({
      accountType: ['PERSONAL', Validators.required],
      accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      companyName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      profilePicture: [''],
      // countries: [''],
      services: [''],
      curriculum: [''],
      comments: [''],
      // gallery: ['']
    });
  }

  ngOnInit() {
    this.countries$ = this.countryService.get();

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    document.getElementById('stepper1').addEventListener('shown.bs-stepper', (e: any) => {
      console.log(e.detail);
      this.activeStep = e.detail.indexStep;
    });

    // this.role = this.route.snapshot.queryParams.role; // Aca debe ir el param role del activatedRouteSnapshot

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
      divisions: this.countryDivisions,
      user_profile_briefcase: this.briefcaseService.briefcases.map(item => {
        return {
          comments: item.comments,
          description: item.description,
          end_date: item.enddate,
          pictures: item.pictures,
          start_date: item.startdate
        };
      })
    };

    this.userProfileService.create(userProfileRequest)
      .subscribe(
        response => {
          console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
          // this.role === 'CLIENT' ? this.activeProfileService.activateClient() : this.activeProfileService.activateServiceProvider() ;
          this.router.navigate(['../'], { relativeTo: this.route });
        }, (err) => {
          this.errorService.errorMessage = err;
          this.router.navigate(['/error']);
        }
      );
  }

  onDivisionsSelect(event) {
    this.countryDivisions = event;
    console.log('event: ', event);
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

  uploadAvatar(event) {
    const file = event.target as HTMLImageElement;
    const dx = file.width;
    const dy = file.height;


    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const base_image = new Image();
    base_image.src = file.src;
    base_image.onload = () => {
      canvas.width = 475; // Este es el tamano de los iconos en el filesystem
      canvas.height = 514;

      context.drawImage(base_image, 0, 0);
      let dataUrl = canvas.toDataURL('image/png');
      this.previewUrl = file.src;
      this.imageBase64 = dataUrl.toString().split(',')[1];
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
      this.uploadedCV = true;
    };
  }

  selectDivision(division: DivisionElement) {
    // this.divisions = (division.divisions as Array<any>).map(elem => elem.nameEs);
    console.log(division);
  }

  //  search = (text$: Observable<string>) =>
  //    text$.pipe(
  //      debounceTime(200),
  //      distinctUntilChanged(),
  //      map(term => term.length < 2 ? []
  //        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  //    )
}
