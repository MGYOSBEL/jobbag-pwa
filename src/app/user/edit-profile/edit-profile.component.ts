import { Component, OnInit } from '@angular/core';
import { ProfessionService } from '@app/user/services/profession.service';
import { ScholarshipService } from '@app/user/services/scholarship.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserProfile, User } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { environment } from '@environments/environment';
import { findIndex } from 'rxjs/operators';
import { BriefcaseService } from '@app/user/services/briefcase.service';
import { UserService } from '@app/user/services/user.service';
import { Observable, forkJoin, EMPTY, combineLatest, of } from 'rxjs';
import { MediaService } from '@app/user/services/media.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editProfileForm: FormGroup;
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


  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.changePassword = false;
    this.imageLoaded = false;
    this.userService.role$.subscribe(role => {
      this.role = role;
      this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
    });

    this.userService.loggedUser$.subscribe(user => {
      this.loggedUser = user;
      this.activeProfile = this.loggedUser.profiles.find(profile => profile.userProfileType === this.role);
    });


    this.previewUrl = `${environment.serverBaseURL}/${this.activeProfile.picture}`;

    this.editProfileForm = this.formBuilder.group({
      username: [this.userService.loggedUser.username, Validators.required],
      password: [''],
      passwordConfirm: [''],
      email: [this.userService.loggedUser.email, [Validators.required, Validators.email]],
      accountType: [this.activeProfile.userProfileAccount, Validators.required],
      accountName: [this.activeProfile.userProfileAccount === 'PERSONAL'
        ? this.activeProfile.name : '', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      companyName: [this.activeProfile.userProfileAccount === 'COMPANY'
        ? this.activeProfile.name : '', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      profilePicture: [''],
      curriculum: [''],
      comments: [this.activeProfile.comment]

    });
  }

  ngOnInit() {
    this.editProfileForm.get('accountType').valueChanges.subscribe(
      value => {
        if (value === 'PERSONAL') {
          this.editProfileForm.get('accountName').enable();
          this.editProfileForm.get('companyName').disable();
          this.profileName = this.editProfileForm.get('accountName');
        } else {
          this.editProfileForm.get('accountName').disable();
          this.editProfileForm.get('companyName').enable();
          this.profileName = this.editProfileForm.get('companyName');

        }
      }
    );
    this.editProfileForm.get('accountType').setValue('PERSONAL');
  }

  toggleChangePassword(event) {
    this.changePassword = event.target.checked;
  }

  uploadPicture(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result as string;
      this.imageBase64 = this.previewUrl.toString().split(',')[1];
      this.imageLoaded = true;

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

    };
  }

  uploadCV(event) {
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

    const userEditRequest = {
      id: this.userService.loggedUser.id,
      username: this.editProfileForm.value.username,
      email: this.editProfileForm.value.email,
      password: this.changePassword ? this.editProfileForm.value.password : null
    };
    console.log('userEditRequest: ', userEditRequest);

    const userEdit$ = this.userService.edit(userEditRequest);

    const profileEditRequest = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      id: this.activeProfile.id,
      phone_number: '',
      comment: this.editProfileForm.value.comments,
      summary: '',
      user_id: this.userService.loggedUser.id,
      scholarship_id: this.activeProfile.scholarshipid,
      picture: '',
      cv: '',
      user_profile_type: this.role,
      user_profile_account: this.editProfileForm.value.accountType,
      name: this.profileName.value,
      user_profile_briefcase: this.activeProfile.briefcases,
      divisions: ''
    };
    console.log('profileEditRequest: ', profileEditRequest);
    const profileEdit$ = this.userProfileService.edit(profileEditRequest);

    const imageEdit$ = this.mediaService.editProfilePicture(this.activeProfile.id, this.imageBase64);

    const cvEdit$ = this.mediaService.editProfileCV(this.activeProfile.id, this.cvBase64);

    const editProfileCall$ = combineLatest(
      [
        this.imageLoaded ? imageEdit$ : of(1),
        this.cvLoaded ? cvEdit$ : of(1),
        userEdit$,
        profileEdit$
      ]
    );

    editProfileCall$.subscribe(
      res => {
        console.log('COMBINED RESPONSE: ', res);
        this.router.navigate([`user/${this.userService.loggedUser.id}`]);
      },
      err => console.log(err),
      () => console.log('COMPLETED')
    );
  }

}
