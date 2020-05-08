import { Component, OnInit } from '@angular/core';
import { ProfessionService } from '@app/user/services/profession.service';
import { ScholarshipService } from '@app/user/services/scholarship.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { UserProfile, User, UserProfileBriefcase } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { environment } from '@environments/environment';
import { findIndex } from 'rxjs/operators';
import { BriefcaseService } from '@app/user/services/briefcase.service';
import { UserService } from '@app/user/services/user.service';
import { Observable, forkJoin, EMPTY, combineLatest, of } from 'rxjs';
import { MediaService } from '@app/user/services/media.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryService } from '../services/country.service';
import { Country } from '../models/country.model';
import { DatePipe } from '@angular/common';
import { LoadingService } from '@app/services/loading.service';
import { MessagesService } from '@app/services/messages.service';
import { Service } from '../models/services.model';
import { ServicesService } from '../services/services.service';
import { LoggingService } from '@app/services/logging.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [DatePipe]
})
export class EditProfileComponent implements OnInit {

  // Component related variables
  editProfileForm = new FormGroup({});
  loggedUser: User;
  role: string;
  defaultPicture: boolean;
  // Edit user related variables
  changePassword: boolean;
  // Edit ProfileUser related variables
  activeProfile: UserProfile;
  countryDivisions: number[];
  // Edit CV related variables
  // cvLoaded: boolean;
  // cvDelete: boolean; // true when want to delete the cv
  cvChange: string; // null || 'LOADED' || 'DELETED'
  cvUrl: string;
  cvBase64: string;
  cvFileName: string;
  // Edit profile Picture related variables
  // imageLoaded: boolean;
  // pictureDelete: boolean; // true when want to delete picture
  imageChange: string; // null || 'LOADED' || 'DELETED'
  imageBase64: string;
  previewUrl: string;


  profileName: AbstractControl;
  myDate = new Date();
  currentDate: string;

  services: Service[];


  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private messages: MessagesService,
    private logger: LoggingService,
    private servicesService: ServicesService,
    private userProfileService: UserProfileService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private briefcaseService: BriefcaseService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {

    this.currentDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.changePassword = false;
    // this.imageLoaded = false;
    // this.cvLoaded = false;
    // this.cvDelete = false;
    // this.pictureDelete = false;
    this.cvChange = null;
    this.imageChange = null;


    this.userService.role$.subscribe(role => {
      this.role = role;
      this.updateActiveProfile();
    });

    this.userService.loggedUser$.subscribe(user => {
      this.loggedUser = user;
      this.updateActiveProfile();
    });

    this.editProfileForm = this.formBuilder.group({
      username: [this.userService.loggedUser.username, Validators.required],
      password: [''],
      passwordConfirm: [''],
      email: [this.userService.loggedUser.email, [Validators.required, Validators.email]],
      accountType: [this.activeProfile.userProfileAccount, Validators.required],
      accountName: [this.activeProfile.name, [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      profilePicture: [''],
      curriculum: [''],
      selectedServices: [this.activeProfile.services],
      comments: [this.activeProfile.comment]
    });
  }

  ngOnInit() {
    this.servicesService.getAll().subscribe(
      services => {
        this.services = services;
      }
    );
  }

  toggleChangePassword(event) {
    this.changePassword = event.target.checked;
  }

  // Public method for Searching services
  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  // Public method (event callback) for upload a picture as response to picture input file
  uploadPicture(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result as string;
      this.imageBase64 = this.previewUrl.toString().split(',')[1];
      // this.imageLoaded = true;
      this.defaultPicture = false;
      // this.pictureDelete = false;
      this.imageChange = 'LOADED';
    };
  }

  // Public method (event callback) for upload a picture as response to avatar selection
  uploadAvatar(event) {
    const file = event.target as HTMLImageElement;
    const dx = file.width;
    const dy = file.height;
    const canvas = document.createElement("canvas");
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
      // this.imageLoaded = true;
      this.imageChange = 'LOADED';
      this.defaultPicture = false;
    };
  }

  // Public method (event callback) for upload a CV as response to CV input file
  uploadCV(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.cvFileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.cvUrl = reader.result as string;
      this.cvBase64 = this.cvUrl.toString().split(',')[1];
      // this.cvLoaded = true;
      // this.cvDelete = false;
      this.cvChange = 'LOADED';
    };

  }

  // Edit profile method
  saveProfile() {
    console.clear();
    this.loadingService.loadingOff();
    this.logger.log('ActiveProfile: ', this.activeProfile);
    // Editing the user
    const userEditRequest = {
      id: this.userService.loggedUser.id,
      username: this.editProfileForm.value.username,
      email: this.editProfileForm.value.email,
      password: this.changePassword ? this.editProfileForm.value.password : null
    };
    this.logger.log('userEditRequest: ', userEditRequest);
    const userEdit$ = this.userService.edit(userEditRequest);
    // Editing the profile
    const briefcaseChangeLog = this.briefcaseService.getChangeLog();
    const add = briefcaseChangeLog.added.map(this.briefcaseToRequest)
      .map(bc => {
        return {
          comments: bc.comments,
          description: bc.description,
          end_date: bc.end_date,
          start_date: bc.start_date,
          pictures: bc.pictures
        };
      });
    const del = briefcaseChangeLog.deleted.map(this.briefcaseToRequest);
    const upd = briefcaseChangeLog.edited.map(this.briefcaseToRequest);
    this.logger.log('add: ', add,
      'upd: ', upd,
      'del: ', del);
    // Making the profileEdit request
    const profileEditRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      id: this.activeProfile.id,
      phone_number: '',
      comment: this.editProfileForm.value.comments,
      summary: '',
      user_id: this.userService.loggedUser.id,
      scholarship_id: 1,
      picture: '',
      cv: '',
      user_profile_type: this.role,
      user_profile_account: this.editProfileForm.value.accountType,
      name: this.editProfileForm.value.accountName,
      add_briefcase: this.role === 'SERVICE_PROVIDER' ? add : [],
      edit_briefcase: this.role === 'SERVICE_PROVIDER' ? upd : [],
      delete_briefcase: this.role === 'SERVICE_PROVIDER' ? del : [],
      divisions: this.role === 'SERVICE_PROVIDER' ? this.activeProfile.divisions : [],
      services: this.role === 'SERVICE_PROVIDER' ? this.editProfileForm.value.selectedServices : [],
    };

    this.logger.log('profileEditRequest: ' + profileEditRequest);

    const profileEdit$ = this.userProfileService.edit(profileEditRequest);

    // Editing the picture and the cv
    let imageEdit$;
    switch (this.imageChange) {
      case 'LOADED':
        imageEdit$ = this.mediaService.editProfilePicture(this.activeProfile.id, this.imageBase64);
        break;
        case 'DELETED':
        imageEdit$ = this.mediaService.deleteProfilePicture(this.activeProfile.id, this.activeProfile.picture);
        break;
      default:
        imageEdit$ = of (1);
        break;
    }

    let cvEdit$;
    switch (this.cvChange) {
      case 'LOADED':
        cvEdit$ = this.mediaService.editProfileCV(this.activeProfile.id, this.cvBase64);
        break;
        case 'DELETED':
        cvEdit$ = this.mediaService.deleteProfileCV(this.activeProfile.id, this.activeProfile.cv);
        break;
      default:
        cvEdit$ = of (1);
        break;
    }

    // this.logger.log('cv: ', this.cvBase64);
    // const cvEdit$ = this.cvDelete ? // if cv delete flag is activated cvEdit$ call is for delete
    //                 this.mediaService.deleteProfileCV(this.activeProfile.id, this.activeProfile.cv) :
    //                 this.mediaService.editProfileCV(this.activeProfile.id, this.cvBase64);
    const editProfileCall$ = forkJoin(
      [
        imageEdit$,
        cvEdit$,
        userEdit$,
        profileEdit$
      ]
    );

    this.logger.log('Making edit request');

    this.loadingService.showLoaderUntilCompletes(editProfileCall$).subscribe(
      res => {

        this.logger.log('COMBINED RESPONSE: ', res);
        this.userService.get(this.loggedUser.id).subscribe();
      },
      (err: []) => {
        const message = 'Error in the edit operation. Please, try again.';
        this.messages.showErrors(message);
        // Es necesario recargar el componente para q se reinicie broefcaseEdit Component
        // Y reinicie a su vez el el changeLog.
        this.router.navigate(['./'], {relativeTo: this.route});
        this.logger.log(err);
      },
      () => this.router.navigateByUrl(`/user/${this.userService.loggedUser.id}/${this.activeProfile.userProfileType}`)
    );
  }

  onCollapse(event) {
    this.logger.log(event);
  }

  onClose() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  clearServices() {
    this.editProfileForm.patchValue({
      selectedServices: []
    });
  }

  onDivisionsSelect(event) {
    this.activeProfile.divisions = event;
  }

  private updateActiveProfile() {
    if (!!this.loggedUser) {
      this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
      if (!!this.activeProfile) {
        // this.briefcaseService.briefcases = this.activeProfile.briefcases;
        this.cvChange = this.activeProfile.cv != null ? 'LOADED' : null ;
        this.logger.log(this.cvChange);
        this.defaultPicture = this.activeProfile.picture == null;
        this.previewUrl = `${environment.serverBaseURL}/${this.activeProfile.picture}`;
        // this.selectedServices = this.activeProfile.services;
        this.editProfileForm.patchValue({
          accountType: this.activeProfile.userProfileAccount,
          accountName: this.activeProfile.name,
          selectedServices: this.activeProfile.services,
          comments: this.activeProfile.comment
        });
        this.logger.log('activeProfile updated: ', this.activeProfile);
      }
    }
  }

  private briefcaseToRequest(bc: UserProfileBriefcase) {
    return {
      id: bc.id,
      description: bc.description,
      comments: bc.comments,
      pictures: bc.pictures,
      end_date: bc.enddate,
      start_date: bc.startdate
    };
  }

  delSelectedPicture() {
    this.defaultPicture = true;
    this.imageBase64 = '';
    this.imageChange = 'DELETED';
  }

  viewCV() {
    this.logger.log(`${environment.serverBaseURL}/${this.activeProfile.cv}`);
    window.open(`${environment.serverBaseURL}/${this.activeProfile.cv}`, '_blank');
  }

  deleteCV() {
    // this.cvLoaded = false;
    // this.cvDelete = true;
    this.cvChange = 'DELETED';
    }

}
