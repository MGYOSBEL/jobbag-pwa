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

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [DatePipe]
})
export class EditProfileComponent implements OnInit {
  editProfileForm = new FormGroup({});
  changePassword: boolean;
  imageLoaded: boolean;
  cvLoaded: boolean;
  imageBase64: string;
  previewUrl: string;
  activeProfile: UserProfile;
  cvUrl: string;
  cvBase64: string;
  profileName: AbstractControl;
  role: string;
  loggedUser: User;
  countryDivisions: number[];
  defaultPicture: boolean;
  myDate = new Date();
  currentDate: string;
  ngSelServices = new FormControl();

  // selectedServices: number[] = [1];

  services: Service[];


  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private messages: MessagesService,
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
    this.imageLoaded = false;


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
    console.log('FORM' , this.activeProfile.services, this.editProfileForm.value);
  }

  private updateActiveProfile() {
    if (!!this.loggedUser) {
      this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
      if (!!this.activeProfile) {
        // this.briefcaseService.briefcases = this.activeProfile.briefcases;
        this.defaultPicture = !this.activeProfile.picture.includes('uploads');
        this.previewUrl = `${environment.serverBaseURL}/${this.activeProfile.picture}`;
        // this.selectedServices = this.activeProfile.services;
        this.editProfileForm.patchValue({
          accountType: this.activeProfile.userProfileAccount,
          accountName: this.activeProfile.name,
          selectedServices: this.activeProfile.services,
          comments: this.activeProfile.comment
        });
        console.log('activeProfile updated: ', this.activeProfile);
      }
    }
  }

  ngOnInit() {
    // this.editProfileForm.get('accountType').valueChanges.subscribe(
    //   value => {
    //     if (value === 'PERSONAL') {
    //       this.editProfileForm.get('accountName').enable();
    //       this.profileName = this.editProfileForm.get('accountName');
    //     } else if (value === '') {
    //       this.editProfileForm.get('companyName').enable();
    //       this.profileName = this.editProfileForm.get('accountName');
    //     }
    //   }
    // );
    // this.editProfileForm.get('accountType').setValue('PERSONAL');
    this.servicesService.getAll().subscribe(
      services => {
        this.services = services;
        console.log(this.services);
      }
    );

    console.log('activeProfile: ', this.activeProfile.divisions, this.activeProfile.services);
  }

  toggleChangePassword(event) {
    this.changePassword = event.target.checked;
  }

  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  uploadPicture(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result as string;
      this.imageBase64 = this.previewUrl.toString().split(',')[1];
      this.imageLoaded = true;
      this.defaultPicture = false;
    };
  }

  uploadAvatar(event) {
    console.clear();
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
      this.imageLoaded = true;
      this.defaultPicture = false;
    };
  }

  uploadCV(event) {
    this.showCVName();
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.cvUrl = reader.result as string;
      this.cvBase64 = this.cvUrl.toString().split(',')[1];
      this.cvLoaded = true;
      console.log(this.cvUrl);
    };

  }

  saveProfile() {
    console.clear();
    this.loadingService.loadingOff();
    console.log('ActiveProfile: ', this.activeProfile);

    // Editing the user
    const userEditRequest = {
      id: this.userService.loggedUser.id,
      username: this.editProfileForm.value.username,
      email: this.editProfileForm.value.email,
      password: this.changePassword ? this.editProfileForm.value.password : null
    };
    console.log('userEditRequest: ', userEditRequest);
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
    console.log('add: ', add,
      'upd: ', upd,
      'del: ', del);

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
      divisions: this.role === 'SERVICE_PROVIDER' ? this.activeProfile.divisions : []
    };

    console.log('profileEditRequest: '+ profileEditRequest);

    const profileEdit$ = this.userProfileService.edit(profileEditRequest);

    // Editing the picture and the cv
    const imageEdit$ = this.mediaService.editProfilePicture(this.activeProfile.id, this.imageBase64);

    console.log('image: ', this.imageBase64);
    console.log('cv: ', this.cvBase64);
    const cvEdit$ = this.mediaService.editProfileCV(this.activeProfile.id, this.cvBase64);
    const editProfileCall$ = combineLatest(
      [
        this.imageLoaded ? imageEdit$ : of(1),
        this.cvLoaded ? cvEdit$ : of(1),
        userEdit$,
        profileEdit$
      ]
    );

    console.log('Making edit request');

    this.loadingService.showLoaderUntilCompletes(editProfileCall$).subscribe(
      res => {

        console.log('COMBINED RESPONSE: ', res);
      },
      (err: []) => {
        const message = 'Error in the edit operation. Please, try again.';
        this.messages.showErrors(message);
        console.log(err);
      },
      () => this.router.navigateByUrl(`/user/${this.userService.loggedUser.id}/${this.activeProfile.userProfileType}`)
    );
  }

  onCollapse(event) {

    console.log(event);
  }

  onClose() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDivisionsSelect(event) {
    this.activeProfile.divisions = event;

    console.log('event: ', event);
    console.log('activeProfile: ', this.activeProfile);
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

     console.log(this.imageBase64);
   }

   deleteCV() {
    this.cvLoaded = false;
    delete(this.cvBase64);

    console.log('cv' + this.cvBase64);
   }

   showCVName(){
    var input = document.getElementById( 'file-upload' );
    var infoArea = document.getElementById( 'file-upload-filename' );

    input.addEventListener( 'change', showFileName );

    function showFileName( event ) {

      // the change event gives us the input it occurred in
      var input = event.srcElement;

      // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
      var fileName = input.files[0].name;

      // use fileName however fits your app best, i.e. add it into a div
      infoArea.textContent = fileName;
    }
   }
}
