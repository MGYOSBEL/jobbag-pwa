import { Component, OnInit } from '@angular/core';
import { ProfessionService } from '@app/user/services/profession.service';
import { ScholarshipService } from '@app/user/services/scholarship.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserProfile } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { environment } from '@environments/environment';
import { findIndex } from 'rxjs/operators';
import { BriefcaseService } from '@app/user/services/briefcase.service';
import { UserService } from '@app/user/services/user.service';
import { Observable, forkJoin, EMPTY, combineLatest, of } from 'rxjs';
import { ActiveProfileService } from '@app/user/services/active-profile.service';
import { MediaService } from '@app/user/services/media.service';
import { Router } from '@angular/router';
import { CountryService } from '@app/user/services/country.service';
import { Country } from '@app/user/models/country.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  countries$: Observable<Country>;
  constructor(
    private countryService: CountryService
  ) {}


  ngOnInit() {
    this.countries$ = this.countryService.get();
  }





}
