import { Component, OnInit } from '@angular/core';
import { ProfessionService } from '@app/user/services/profession.service';
import { ScholarshipService } from '@app/user/services/scholarship.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProfile } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { environment } from '@environments/environment';
import { findIndex } from 'rxjs/operators';
import { BriefcaseService } from '@app/user/services/briefcase.service';
import { UserService } from '@app/user/services/user.service';
import { Observable } from 'rxjs';
import { ActiveProfileService } from '@app/user/services/active-profile.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  editProfileForm: FormGroup;
  changePassword: boolean;
  imageLoaded: boolean;
  imageBase64: string;
  previewUrl: string;
  activeProfile: UserProfile;

  constructor(
    private activeProfileService: ActiveProfileService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {

    this.activeProfile = this.activeProfileService.activeProfile;
    this.changePassword = false;
    this.imageLoaded = false;

    this.previewUrl = `${environment.serverBaseURL}/${this.activeProfileService.activeProfile.picture}`;

    this.editProfileForm = this.formBuilder.group({
      username: [this.userService.loggedUser.username, Validators.required],
      password: [''],
      passwordConfirm: [''],
      email: [this.userService.loggedUser.email, [Validators.required, Validators.email]],
      accountType: ['PERSONAL', Validators.required],
      accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      companyName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]]

    });
  }

  ngOnInit() {

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
    };
    this.imageLoaded = true;
  }

  uploadAvatar(event) {
    console.clear();
    const file = event.target as HTMLImageElement;
    const dx = file.width;
    const dy = file.height;


    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d',);
    const base_image = new Image();
    base_image.src = file.src;
    base_image.onload = () => {
      canvas.width = 475; // Este es el tamano de los iconos en el filesystem
      canvas.height = 514;

      context.drawImage(base_image, 0 , 0);
      let dataUrl = canvas.toDataURL('image/png');
      this.previewUrl = file.src;
      this.imageBase64 = dataUrl.toString().split(',')[1];
    };
    this.imageLoaded = true;
  }

  // uploadCV(event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = (_event) => {
  //     this.cvUrl = reader.result;
  //     this.cvBase64 = this.cvUrl.toString().split(',')[1];
  //   };
  //   this.imageLoaded = true;

  // }




}
