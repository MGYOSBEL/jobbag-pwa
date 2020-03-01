import { Component, OnInit } from '@angular/core';
import { Briefcase, Profession } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ProfessionService } from '../services/profession.service';
import { UserProfileService } from '../services/user-profile.service';
import { BriefcaseService } from '../services/briefcase.service';
import { ErrorService } from '@app/errors/error.service';

@Component({
  selector: 'app-birefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css']
})
export class BriefcaseEditComponent implements OnInit {

  briefcases: Briefcase[];
  professions: Profession[];

  briefcaseEditForm: FormGroup;

  function: string;


  constructor(private userService: UserService,
              private professionService: ProfessionService,
              private briefcaseService: BriefcaseService,
              private userProfileService: UserProfileService,
              private errorService: ErrorService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {

    this.briefcaseEditForm = this.formBuilder.group({
      title: ['', Validators.required],
      comments: [''],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      profession: ['', Validators.required]
    });
    this.briefcases = [];

  }

  ngOnInit() {
    this.professionService.getAll().subscribe(
      data => {
        this.professions = data;
      });
  }



  saveBriefCase() {
    const bc = {
      description: this.briefcaseEditForm.value.description,
      endDate: this.briefcaseEditForm.value.endDate,
      startDate: this.briefcaseEditForm.value.startDate,
      comments: this.briefcaseEditForm.value.comments,
      idProfession: this.briefcaseEditForm.value.profession,
      id: null
    };
    this.briefcaseService.create(this.userProfileService.serviceProvider.id, bc).subscribe(
      response => {
        console.log(response);
      }, err => {
        this.errorService.errorMessage = err;
        this.router.navigate(['/error']);
      }
    );

    this.briefcaseEditForm.reset();

  }


  exit() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }



}
