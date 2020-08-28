import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
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
import { LoadingService } from '@app/services/loading.service';
import { MessagesService } from '@app/services/messages.service';
import { Service } from '../models/services.model';
import { ServicesService } from '../services/services.service';
import { LoggingService } from '@app/services/logging.service';
import { UserService } from '../services/user.service';

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
  cvFileName: string;
  cvFile: any;
  name: AbstractControl;
  // countries$: Observable<Country[]>;
  divisions: string[];
  activeStep: number;
  countryDivisions: number[] = [];
  myDate = new Date();
  currentDate: string;
  selectedServices: FormControl;
  // selectedServices: number[] = [];
  closeProfileHidder: boolean;
  services: Service[];

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService,
    private logger: LoggingService,
    private briefcaseService: BriefcaseService,
    private errorService: ErrorService,
    private countryService: CountryService,
    private servicesService: ServicesService,
    private loadingService: LoadingService,
    private messages: MessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: UserService
  ) {
    this.currentDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.role = this.route.snapshot.params.role;
    this.imageLoaded = false;
    this.profileForm = this.formBuilder.group({
      accountType: ['PERSONAL', Validators.required],
      accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      companyName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      profilePicture: [''],
      onlineJob: [false],
      // countries: [''],
      selectedServices: [''],
      curriculum: [''],
      comments: [''],
      // gallery: ['']
    });
  }

  ngOnInit() {
    this.servicesService.getAll().subscribe(
      services => this.services = services
    );
      console.log('initiate create profile stepper');
    this.closeProfileHidder = this.route.snapshot.queryParams.btnhidder;

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    document.getElementById('stepper1').addEventListener('shown.bs-stepper', (e: any) => {
      this.activeStep = e.detail.indexStep;
    });

    // this.role = this.route.snapshot.queryParams.role; // Aca debe ir el param role del activatedRouteSnapshot
    this.profileForm.get('accountType').valueChanges.subscribe(
      value => {
        if (value === 'PERSONAL') {
          this.profileForm.get('accountName').enable();
          this.profileForm.get('companyName').disable();
          this.name = this.profileForm.get('accountName');
        } else if (value === '') {
          //this.profileForm.get('accountName').disable();
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

  clearServices() {
    this.profileForm.patchValue({
      selectedServices: []
    });
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
      remoteWork: this.profileForm.value.onlineJob,
      divisions: this.countryDivisions,
      services: this.profileForm.value.selectedServices,
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

    const createProfile$ = this.userProfileService.create(userProfileRequest);
    this.loadingService.showLoaderUntilCompletes(createProfile$).subscribe(
      response => {
        // this.role === 'CLIENT' ? this.activeProfileService.activateClient() : this.activeProfileService.activateServiceProvider() ;
        this.userService.role = this.role;
        this.router.navigate(['user', this.authenticationService.getLoggedUserId(), this.role]);
      }, (err) => {
        this.errorService.errorMessage = err;
        this.messages.showErrors('There has been an error creating the profile. Please try again in a few minutes.');
        this.logger.log(err);
      }
    );
  }

  onDivisionsSelect(event) {
    this.countryDivisions = event;
  }

  onOnlineJobChange(event) {
    // console.log('online => ', this.profileForm.value.onlineJob);
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
    if (file.type === 'application/pdf') {
      this.cvFileName = file.name;
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (_event) => {
        this.cvUrl = reader.result;
        this.cvBase64 = this.cvUrl.toString().split(',')[1];
        this.uploadedCV = true;
      };
    } else {
      this.messages.showErrors('You can just select pdf files');
    }
  }

  selectDivision(division: DivisionElement) {
    // this.divisions = (division.divisions as Array<any>).map(elem => elem.nameEs);
  }

  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  delSelectedPicture() {
    this.imageLoaded = false;
    this.imageBase64 = '';
  }

  deleteCV() {
    this.cvBase64 = null;
    this.uploadedCV = false;

  }

  closeRegister() {
    const userId = this.authenticationService.getLoggedUserId();
    const userRole = this.route.snapshot.params.role;
    if (userRole === 'CLIENT') {
      this.userService.role = 'SERVICE_PROVIDER';
      this.router.navigate([`/user/${userId}/SERVICE_PROVIDER`]);
    } else {
      this.userService.role = 'CLIENT';
      this.router.navigate([`/user/${userId}/CLIENT`]);
    }
  }

}
