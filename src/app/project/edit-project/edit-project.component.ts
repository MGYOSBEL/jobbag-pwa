import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { combineLatest } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Service } from '@app/user/models/services.model';
import { Project } from '../models/project.model';
import { dateToModel, dateFromModel } from '@app/models/date.format';
import { ServicesService } from '@app/user/services/services.service';
import { ProjectService } from '../services/project.service';
import { MessagesService } from '@app/services/messages.service';

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
  dataChange: boolean;
  project: Project;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private messages: MessagesService,
    private userService: UserService
  ) {
    const projectId = this.route.snapshot.params.id;
    this.projectService.getProjectDetailByProfileType(this.userService.loggedUser.id, projectId).subscribe(
      project => {
        this.project = project;
        this.dataChange = false;
        this.countryDivisions = project.divisions;
        this.editProjectForm = this.formBuilder.group({
          projectTitle: [project.name, Validators.required],
          projectResume: [project.description],
          selectedServices: [project.services, Validators.required],
          divisions: [project.divisions, Validators.required],
          startDate: dateFromModel(project.startDateExpected),
          onlineJob: !!project.remote
        });
        this.editProjectForm.valueChanges.subscribe(
          () => this.dataChange = true

        );
      }
    );
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
      services: this.editProjectForm.value.selectedServices,
      id: this.project.id
    };
    return project;
  }

  onEdit() {
    const project = this.formToModel();
    this.projectService.edit(project).subscribe(
      () => this.router.navigateByUrl(this.dashboardRoute),
      err => this.messages.showErrors('There was an error editing the project. Try again Later')
    );
  }

  onClose() {
    this.router.navigateByUrl(this.dashboardRoute);
  }
}
