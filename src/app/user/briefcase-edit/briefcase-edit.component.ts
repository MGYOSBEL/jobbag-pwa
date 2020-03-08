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

  briefcases: any[];
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

    this.function = this.route.snapshot.queryParams.function;
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
    this.briefcaseService.getAll().subscribe(
      briefcases => this.briefcases = briefcases
    );

  }



  saveBriefCase() {
    const bc = {
      description: this.briefcaseEditForm.value.description,
      end_date:   this.briefcaseEditForm.value.endDate.year.toString() + '-'
                + this.briefcaseEditForm.value.endDate.month.toString() + '-'
                + this.briefcaseEditForm.value.endDate.day.toString(),
      start_date: this.briefcaseEditForm.value.startDate.year.toString() + '-'
                + this.briefcaseEditForm.value.startDate.month.toString() + '-'
                + this.briefcaseEditForm.value.startDate.day.toString(),
      comments: this.briefcaseEditForm.value.comments,
      id_profession: this.briefcaseEditForm.value.profession,
      id: null
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

  }


  exit() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }



}
