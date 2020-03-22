import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IDProfessionFk } from '../models/user.model';
import { ProfessionService } from '../services/profession.service';

@Component({
  selector: 'app-professions-edit',
  templateUrl: './professions-edit.component.html',
  styleUrls: ['./professions-edit.component.css']
})
export class ProfessionsEditComponent implements OnInit {

  professionsEditForm: FormGroup;
  // profession = new FormControl('');
  professions: IDProfessionFk[];
  selectedProfession: IDProfessionFk;


  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private professionService: ProfessionService,
              private route: ActivatedRoute,
              private router: Router) {
    this. professionsEditForm = this.formBuilder.group({
      profession: ['']
    });
  }

  ngOnInit() {
    // this.route.queryParamMap.pipe(
    //   switchMap((params: ParamMap) =>
    //     this.role = (params.get('role'))));
    this.professionService.getAll().subscribe(
      data => {
        this.professions = data;
      });
  }

  save() {
   // http://localhost/api/profession/all/es
   console.log('PROFESSION: ' + JSON.stringify(this.professionsEditForm.get('profession').value));

  }

  skip() {
    this.router.navigate(['../', 'edit-professions'], {relativeTo: this.route});
  }

  selectProfession(e) {
    this.profession.setValue(e.target.value, {
       onlySelf: true
    });
  }

  get profession() {
    return this.professionsEditForm.get('profession');
  }

}
