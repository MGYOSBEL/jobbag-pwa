import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { combineLatest } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Service } from '@app/user/models/services.model';
import { Project } from '../models/project.model';
import { dateToModel } from '@app/models/date.format';
import { ServicesService } from '@app/user/services/services.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  dashboardRoute: string;
  activeProfileId: number;
  editProjectForm: FormGroup;

  services: Service[]; // Services
  servicesTouched = false;
  divisionsDirty = false;
  countryDivisions: number[] = []; // Country

  project: Project;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.editProjectForm = this.formBuilder.group({
      projectTitle: ['', Validators.required],
      projectResume: [''],
      selectedServices: [[], Validators.required],
      divisions: [[], Validators.required],
      startDate: [null],
      onlineJob: [false]
    });
  }

  ngOnInit() {

    this.servicesService.getAll().subscribe(
      services => this.services = services
    );


    const activeUserProfile$ = combineLatest(
      this.userService.loggedUser$,
      this.userService.role$
    );

    activeUserProfile$.subscribe(
      ([user, role]) => {
        const activeProfile = user.profiles.find(profile => profile.userProfileType === role);
        this.activeProfileId = activeProfile.id;
        this.dashboardRoute = `/user/${user.id}/${activeProfile.userProfileType}`;
      }
    );
  }

  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  clearServices() {
    this.editProjectForm.patchValue({
      selectedServices: []
    });
  }

  onDivisionsSelect(event) {
    this.countryDivisions = event;
    this.editProjectForm.patchValue({
      divisions: event
    });
  }

  onOnlineJobChange(event) {
    const state = event.target.checked;
    this.editProjectForm.get('divisions').setValidators(state ? null : Validators.required);
    this.editProjectForm.get('divisions').updateValueAndValidity();
    this.editProjectForm.patchValue({
      divisions: state ? [] : this.countryDivisions
    });

  }

  formToModel(): Project {
    const project: Project = {
      state: null,
      name: this.editProjectForm.value.projectTitle,
      description: this.editProjectForm.value.projectResume,
      startDateExpected: dateToModel(this.editProjectForm.value.startDate),
      remote: this.editProjectForm.value.onlineJob,
      divisions: this.editProjectForm.value.divisions,
      services: this.editProjectForm.value.selectedServices
    };
    return project;
  }

onClose() {
  this.router.navigateByUrl(this.dashboardRoute);
}
}
