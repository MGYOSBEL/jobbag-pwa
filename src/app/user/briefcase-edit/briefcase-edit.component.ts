import { Component, OnInit } from '@angular/core';
import { Briefcase, Profession } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-birefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css']
})
export class BriefcaseEditComponent implements OnInit {

  briefcases: Briefcase[];
  professions: Profession[];


  briefcaseEditForm: FormGroup;
  title = new FormControl('');
  comments = new FormControl('');
  description = new FormControl('');
  startDate = new FormControl('');
  endDate = new FormControl('');

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {
    this.briefcaseEditForm = this.formBuilder.group({
      title: [''],
      comments: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      profession: ['']
    });
              }

  ngOnInit() {
    this.userService.getAllProfessions().subscribe(
      data => {
        this.professions = data;
        console.log('PROFESSIONS: ' + JSON.stringify(data));
      });
  }

  selectProfession(e) {
    this.profession.setValue(e.target.value, {
       onlySelf: true
    });
  }

  get profession() {
    return this.briefcaseEditForm.get('profession');
  }

  saveBriefCase() {
    console.log('PROFESSION: ' + JSON.stringify(this.briefcaseEditForm.get('profession').value));
    this.briefcases.push(
      {description: this.description.value,
        endDate: this.endDate.value,
        startDate: this.startDate.value,
        idProfession: this.briefcaseEditForm.get('profession').value,
        id: null
      }
    );

  }

  save() {}

  skip() {}

}
