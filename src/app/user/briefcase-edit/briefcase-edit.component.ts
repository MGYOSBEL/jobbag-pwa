import { Component, OnInit } from '@angular/core';
import { Briefcase, Profession } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ProfessionService } from '../services/profession.service';
import { UserProfileService } from '../services/user-profile.service';

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
              private professionService: ProfessionService,
              private userProfileService: UserProfileService,
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
    this.userProfileService.cacheBriefcase(
      {
        comments: bc.comments,
        description: bc.description,
        start_date: bc.startDate,
        end_date: bc.endDate,
        id_profession: bc.idProfession
      }

    );
    this.briefcases.push(bc);
    this.briefcaseEditForm.reset();

  }

  save() {
    this.userProfileService.create()
      .subscribe(
        response => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      );
  }

  skip() { }



}
