import { Component, OnInit } from '@angular/core';
import { Briefcase, Profession } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-birefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css']
})
export class BriefcaseEditComponent implements OnInit {

  briefcases: Briefcase[];
  professions: Profession[];


  briefcaseEditForm: FormGroup;


  constructor(private userService: UserService,
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
    this.userService.getAllProfessions().subscribe(
      data => {
        this.professions = data;
        console.log('PROFESSIONS: ' + JSON.stringify(data));
      });
  }



  saveBriefCase() {
    console.log('PROFESSION: ' + JSON.stringify(this.briefcaseEditForm.value));
    this.briefcases[this.briefcases.length] = {
      description: this.briefcaseEditForm.value.description,
      endDate: this.briefcaseEditForm.value.endDate,
      startDate: this.briefcaseEditForm.value.startDate,
      comments: this.briefcaseEditForm.value.comments,
      idProfession: this.briefcaseEditForm.value.profession,
      id: null
    };
    // console.log('resetting the form.....');
    this.briefcaseEditForm.reset();

  }

  save() {
    this.userService.setUserProfileBriefcase(this.briefcases);
    this.userService.createUserProfile()
      .subscribe(
        response => {
          // console.log('createUserProfile RESPONSE: ' + JSON.stringify(response));
          // Navigate to Dashboard
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      );
  }

  skip() { }



}
