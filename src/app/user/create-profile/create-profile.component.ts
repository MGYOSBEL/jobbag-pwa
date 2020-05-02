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

  services: Service[];
  // = [
  //   {
  //     id: 1,
  //     shortDescription: 'Consulta de información legal y consejo',
  //     descriptionEs: 'Consulta de información legal y consejo',
  //     descriptionEn: 'Consultation for legal information and advice',
  //     descriptionFr: null,
  //     keywords: ['Servicios Legales', 'Leyes y Seguridad Pública', 'inf']
  //   },
  //   {
  //     id: 2,
  //     shortDescription: 'Preparacion de documentos',
  //     descriptionEs: 'Preparacion de documentos',
  //     descriptionEn: 'Preparation of documents',
  //     descriptionFr: null,
  //     keywords: ['Servicios Legales', 'Leyes y Seguridad Pública']
  //   },
  //   {
  //     id: 3,
  //     shortDescription: 'Representacion de clientes en negociaciones',
  //     descriptionEs: 'Representacion de clientes en negociaciones',
  //     descriptionEn: 'Representing clients in negotiations',
  //     descriptionFr: null,
  //     keywords: ['Servicios Legales', 'Leyes y Seguridad Pública']
  //   },
  //   {
  //     id: 4,
  //     shortDescription: 'Consultor de recursos Humanos',
  //     descriptionEs: 'Consultor de recursos Humanos',
  //     descriptionEn: 'Human Resource Consultant',
  //     descriptionFr: null,
  //     keywords: ['Agente', 'Administracion y Negocios']
  //   },
  //   {
  //     id: 5,
  //     shortDescription: 'Profesor de animacion',
  //     descriptionEs: 'Profesor de animacion',
  //     descriptionEn: 'Teaching on Animation',
  //     descriptionFr: null,
  //     keywords: ['Arte y multimedia', 'Servicios de animacion', 'Arte, Diseño y Entretenimiento', 'Educación']
  //   }
  // ];

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService,
    private briefcaseService: BriefcaseService,
    private errorService: ErrorService,
    private countryService: CountryService,
    private servicesService: ServicesService,
    private loadingService: LoadingService,
    private messages: MessagesService,
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

  createUserProfile() {
    this.loadingService.loadingOn();

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
    console.log(userProfileRequest);

    this.userProfileService.create(userProfileRequest)
      .subscribe(
        response => {
          console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
          // this.role === 'CLIENT' ? this.activeProfileService.activateClient() : this.activeProfileService.activateServiceProvider() ;
          this.router.navigate(['../'], { relativeTo: this.route });
          this.loadingService.loadingOff();
        }, (err) => {
          this.errorService.errorMessage = err;
          this.messages.showErrors('There has been an error creating the profile. Please try again in a few minutes.');
          console.log(err);
          this.loadingService.loadingOff();
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
    this.cvFileName = file.name;
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (_event) => {
      this.cvUrl = reader.result;
      this.cvBase64 = this.cvUrl.toString().split(',')[1];
      this.uploadedCV = true;
    };

    console.log('CV:' + this.cvBase64);
  }

  selectDivision(division: DivisionElement) {
    // this.divisions = (division.divisions as Array<any>).map(elem => elem.nameEs);
    console.log(division);
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

    console.log('CV:' + this.cvBase64) //;
  }

  viewCV() {
    // let myWindow = window.open("", "MsgWindow", "width=600,height=600");
    // myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
    // myWindow.document.write(`<iframe src=${this.cvUrl} style='width: 100%'></iframe>`);
  }

  cvViewerLoaded(pdf) {
  }

  // showCVName(){
  //   var input = document.getElementById( 'file-upload' );
  //   var infoArea = document.getElementById( 'file-upload-filename' );

  //   input.addEventListener( 'change', showFileName );

  //   function showFileName( event ) {

  //     // the change event gives us the input it occurred in
  //     var input = event.srcElement;

  //     // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
  //     var fileName = input.files[0].name;

  //     // use fileName however fits your app best, i.e. add it into a div
  //     infoArea.textContent = fileName;
  //   }
  //  }


}
