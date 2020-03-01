import { Component, OnInit } from '@angular/core';
import { ProfessionService } from '@app/user/services/profession.service';
import { ScholarshipService } from '@app/user/services/scholarship.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserProfile } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { environment } from '@environments/environment';
import { findIndex } from 'rxjs/operators';
import { BriefcaseService } from '@app/user/services/briefcase.service';
import { UserService } from '@app/user/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  professions;
  scholarships;
  userProfile;
  briefcase$: Observable<any>;
  errors: string[] = [];
  testForm: FormGroup;
  briefcaseForm: FormGroup;

  constructor( private professionService: ProfessionService,
               private scholarshipService: ScholarshipService,
               private userProfileService: UserProfileService,
               private briefcaseService: BriefcaseService,
               private userService: UserService,
               private formBuilder: FormBuilder) {

                this.testForm = this.formBuilder.group({
                  id: [''],
                  phone_number: [''],
                  comment: [''],
                  summary: [''],
                  user_id: [''],
                  scholarship_id: [''],
                  user_profile_type: ['']
                });

                this.briefcaseForm = this.formBuilder.group({
                  bc_id: [''],
                  bc_description: [''],
                  bc_comment: [''],
                  bc_start_date: [''],
                  bc_end_date: [''],
                  bc_id_profession: [''],
                });
               }

  ngOnInit() {
    this.professionService.getAll().subscribe(
      data => this.professions = data,
      err => this.errors.push(err)
    );

    this.scholarshipService.getAll().subscribe(
      data => this.scholarships = data,
      err => this.errors.push(err)
    );

  }


  edit() {
    const request = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      id: this.testForm.value.id,
      comment: this.testForm.value.comment,
      summary: this.testForm.value.summary,
      user_id: this.testForm.value.user_id,
      phone_number: this.testForm.value.phone_number,
      scholarship_id: this.testForm.value.scholarship_id,
      user_profile_type: this.testForm.value.user_profile_type
    };
    this.userProfileService.edit(request).subscribe(
     response => this.userProfile = response,
     err => this.errors.push(err)
    );
  }


  delete() {
    this.userProfileService.delete(this.testForm.value.id).subscribe(
     response => this.userProfile = response,
     err => this.errors.push(err)
    );
  }


  create() {
    const request = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      comment: this.testForm.value.comment,
      summary: this.testForm.value.summary,
      user_id: this.testForm.value.user_id,
      phone_number: this.testForm.value.phone_number,
      scholarship_id: this.testForm.value.scholarship_id,
      user_profile_type: this.testForm.value.user_profile_type
    };
    this.userProfileService.create(request).subscribe(
     response => {
       console.log(response);
       this.userProfile = response;
    },
     err => {
       console.log(err);
       this.errors.push(err);
      }
    );
  }

  array() {
    const array: Array<any> = [
      {id: 12,
      client: 'string12',
      secret: 'asdasdasd'},
      {id: 13,
      client: 'string13',
      secret: 'asdasdasd13'},
      {id: 14,
      client: 'string14',
      secret: 'asdasdasd14'},
      {id: 15,
      client: 'string15',
      secret: 'asdasdasd14'},
      {id: 16,
      client: 'string16',
      secret: 'asdasdasd14'},
      {id: 17,
      client: 'string17',
      secret: 'asdasdasd14'},
      {id: 18,
      client: 'string18',
      secret: 'asdasdasd14'}
    ];
    console.log('ORIGINAL');
    console.log(array);
    const userProfiles = array;
    this.professionService.getAll().subscribe(
      data => {
        this.professions = data;
        for (const iterator of userProfiles) {
          if (iterator.id === 17) {
            userProfiles.splice(userProfiles.indexOf(iterator), 1);
          }
        }
      },
      err => this.errors.push(err)
    );

    const index = array.findIndex(elem => elem.id === 16 );


    console.log('index', index);

    console.log('MODIFIED');
    console.log(userProfiles);

  }

  bc_create() {
    this.briefcase$ = this.briefcaseService.create(this.userProfileService.serviceProvider.id,
                                                    {
                                                      comments: this.briefcaseForm.value.bc_comment,
                                                      description: this.briefcaseForm.value.bc_description,
                                                      start_date: this.briefcaseForm.value.bc_start_date,
                                                      end_date: this.briefcaseForm.value.bc_end_date,
                                                      id_profession: this.briefcaseForm.value.bc_id_profession
                                                    });
  }
bc_edit() {
  this.briefcase$ = this.briefcaseService.edit(this.userProfileService.serviceProvider.id,
    {
      id: this.briefcaseForm.value.bc_id,
      comments: this.briefcaseForm.value.bc_comment,
      description: this.briefcaseForm.value.bc_description,
      start_date: this.briefcaseForm.value.bc_start_date,
      end_date: this.briefcaseForm.value.bc_end_date,
      id_profession: this.briefcaseForm.value.bc_id_profession
    });
  console.log('bc_edit data: ', this.userProfileService.serviceProvider.id,
    {
      id: this.briefcaseForm.value.bc_id,
      comments: this.briefcaseForm.value.bc_comment,
      description: this.briefcaseForm.value.bc_description,
      start_date: this.briefcaseForm.value.bc_start_date,
      end_date: this.briefcaseForm.value.bc_end_date,
      id_profession: this.briefcaseForm.value.bc_id_profession
    });
}

bc_delete() {
  this.briefcase$ = this.briefcaseService.delete(this.briefcaseForm.value.bc_id);

}



}
