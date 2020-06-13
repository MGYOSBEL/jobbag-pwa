import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesService } from '@app/user/services/services.service';
import { Service } from '@app/user/models/services.model';
import { Country, DivisionValue, DivisionElement } from '@app/user/models/country.model';
import { CountryService } from '@app/user/services/country.service';
import { LoggingService } from '@app/services/logging.service';
import { NgbDateAdapter, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { dateToModel } from '@app/models/date.format';
import { UserService } from '@app/user/services/user.service';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessagesService } from '@app/services/messages.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']

})
export class CreateProjectComponent implements OnInit {


  createProjectForm: FormGroup;

  activeProfileId: number;
  dashboardRoute: string;

  services: Service[]; // Services
  servicesTouched = false;
  divisionsDirty = false;
  countryDivisions: number[] = []; // Country



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private servicesService: ServicesService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private userService: UserService,
    private messages: MessagesService,
    private logger: LoggingService
  ) {
    this.createProjectForm = this.formBuilder.group({
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

  onClose() {
    this.router.navigateByUrl(this.dashboardRoute);
  }

  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  clearServices() {
    this.createProjectForm.patchValue({
      selectedServices: []
    });
  }

  // Methhod for creating a project by clicking on the Create button
  createProject() {
    const createProjectRequest = this.formToModel();
    this.projectService.create(createProjectRequest, this.activeProfileId)
    .subscribe(
      () => this.router.navigateByUrl(this.dashboardRoute),
      err => this.messages.showErrors(`There was an error creating the project. Please try again later.`)
    );
  }

  onDivisionsSelect(event) {
    this.countryDivisions = event;
    this.createProjectForm.patchValue({
      divisions: event
    });
  }

  onOnlineJobChange(event) {
    const state = event.target.checked;
    this.createProjectForm.get('divisions').setValidators(state ? null : Validators.required);
    this.createProjectForm.get('divisions').updateValueAndValidity();
    this.createProjectForm.patchValue({
      divisions: state ? [] : this.countryDivisions
    });

  }

  formToModel(): Project {
    const project: Project = {
      state: null,
      name: this.createProjectForm.value.projectTitle,
      description: this.createProjectForm.value.projectResume,
      startDateExpected: dateToModel(this.createProjectForm.value.startDate),
      remote: this.createProjectForm.value.onlineJob,
      divisions: this.createProjectForm.value.divisions,
      services: this.createProjectForm.value.selectedServices
    };
    return project;
  }
}
