import { Component, OnInit } from '@angular/core';
import { UserProfileBriefcase, IDProfessionFk } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ProfessionService } from '../services/profession.service';
import { UserProfileService } from '../services/user-profile.service';
import { BriefcaseService } from '../services/briefcase.service';
import { ErrorService } from '@app/errors/error.service';

@Component({
  selector: 'app-briefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css']
})
export class BriefcaseEditComponent implements OnInit {
  briefcases: UserProfileBriefcase[];
  // professions: IDProfessionFk[];  
  briefcaseEditForm: FormGroup;
  function: string;
  previewUrl: any;
  imageBase64: string;
  imageLoaded: boolean;
  pictures: string[]; // adding pictures array to briefcase

  constructor(private userService: UserService,
              // private professionService: ProfessionService,
              private briefcaseService: BriefcaseService,
              private userProfileService: UserProfileService,
              private errorService: ErrorService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {

    this.function = this.route.snapshot.queryParams.function;
    this.briefcaseEditForm = this.formBuilder.group({
      title: ['', Validators.required],
      comments: [''],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      // profession: ['', Validators.required]  Remover profesion
      pictures: [''],     // adding pictures array to briefcase inside the folr
    });
    this.briefcases = [];
    this.pictures = []; // adding pictures array to briefcase
  }

  ngOnInit() {
    // this.professionService.getAll().subscribe(     Remover Profesion
    //   data => {
    //     this.professions = data;
    //   });
    this.briefcaseService.getAll().subscribe(
      briefcases => this.briefcases = briefcases
    );

  }

  saveBriefCase() {
    const bc: UserProfileBriefcase = {
      description: this.briefcaseEditForm.value.description,
      enddate:   this.briefcaseEditForm.value.endDate.year.toString() + '-'
                + this.briefcaseEditForm.value.endDate.month.toString() + '-'
                + this.briefcaseEditForm.value.endDate.day.toString(),
      startdate: this.briefcaseEditForm.value.startDate.year.toString() + '-'
                + this.briefcaseEditForm.value.startDate.month.toString() + '-'
                + this.briefcaseEditForm.value.startDate.day.toString(),
      comments: this.briefcaseEditForm.value.comments,
      // idProfessionFk: this.briefcaseEditForm.value.profession,
      idUserProfileFk: null,
      id: null,
      pictures: this.pictures,      // adding pictures array to briefcase
    };
    this.briefcaseService.briefcases.push(bc);
    this.briefcases.push(bc);
    console.log('BriefcaseEditComponent array: ', this.briefcases);
    // this.briefcaseService.create(this.userProfileService.serviceProvider.id, bc).subscribe(
    //   response => {
    //     this.briefcaseService.getAll().subscribe(
    //       briefcases => this.briefcases = briefcases
    //     );
    //   }, err => {
    //     this.errorService.errorMessage = err;
    //     this.router.navigate(['/error']);
    //   }
    // );

    this.briefcaseEditForm.reset();
    this.imageLoaded = false;

  }


  exit() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  uploadPicture(event) {
    const file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.imageBase64 = this.previewUrl.toString().split(',')[1];
    };

    this.pictures[0] = this.imageBase64;      // adding pictures array to briefcase (pictures[0]) just one image 
    
    this.imageLoaded = true;
  }



}
