import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Project, ProjectState, ProjectAction } from '../models/project.model';
import { UserProfile, UserProfileBriefcase } from '@app/user/models/user.model';
import { ProjectService } from '../services/project.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { PersonalProjectService } from '../services/personal-project.service';
import { MessagesService } from '@app/services/messages.service';
import { filterByStatus, filterByLocation, filterByService, substractMonths, filterByCreationDate, filterByProjectTitle } from '../models/filters';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BriefcaseService } from '@app/user/services/briefcase.service';
import { LoadingService } from '@app/services/loading.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  // showActionBar: boolean = false;
  userProfile: UserProfile;
  projects$: Observable<Project[]>;
  previewProject$: Observable<Project>;
  detailProject$: Observable<Project>;
  newProjects$: Observable<Project[]>;
  inProgressProjects$: Observable<Project[]>;
  finishedProjects$: Observable<Project[]>;
  selectedCard$: Observable<number>;
  selectAll$ = new Observable<boolean>();
  private statusFilterSubject = new BehaviorSubject<ProjectState>(null);
  currentStatus$ = this.statusFilterSubject.asObservable();
  locationFilterSubject = new BehaviorSubject<number[]>([]);
  serviceFilterSubject = new BehaviorSubject<number[]>([]);
  searchFilterSubject = new BehaviorSubject<string>('');
  dateFilterSubject = new BehaviorSubject<number>(12);
  locationFilter$: Observable<number[]> = this.locationFilterSubject.asObservable();
  servicesFilter$: Observable<number[]> = this.serviceFilterSubject.asObservable();
  dateFilter$: Observable<number> = this.dateFilterSubject.asObservable();
  searchFilter$: Observable<string> = this.searchFilterSubject.asObservable();
  actionBar = [
    ProjectAction.Delete,
    ProjectAction.SelectAll
  ];
  showBriefcaseForm: boolean;
  statusFilter = [];
  dateFilter: number[] = [1, 6, 12];
  statusValue: string;
  requestForBriefcaseModal: boolean;
  briefcaseEditForm: FormGroup;
  previewUrl;
  imageBase64: string;
  imageLoaded: boolean;
  private picturesSubject = new BehaviorSubject<string[]>([]);
  pictures$: Observable<string[]> = this.picturesSubject.asObservable(); // adding pictures array to briefcase
  executionIdForBriefcase: number; // saves the id of the selected execution once the briefcase is generated


  constructor(
    private userService: UserService,
    private messages: MessagesService,
    private personalProjectService: PersonalProjectService,
    private formBuilder: FormBuilder,
    private briefcaseService: BriefcaseService,
    private loading: LoadingService,
    private router: Router
  ) {
    this.picturesSubject.next([]);
    this.imageLoaded = false;
    this.showBriefcaseForm = false;
    this.requestForBriefcaseModal = false;
    this.briefcaseEditForm = this.formBuilder.group({
      comments: [''],
      description: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });


    this.detailProject$ = personalProjectService.activeProject$;
    personalProjectService.userProfile$.subscribe(
      ([user, role]) => {
        if (!!user) {
          this.personalProjectService.reset();
          this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
          const actions = [
            ProjectAction.Delete,
            ProjectAction.SelectAll
          ];
          this.actionBar = this.userProfile.userProfileType === 'CLIENT' ? [ProjectAction.Create, ...actions] : actions;
          const filters = [
            ProjectState.FINISH,
            ProjectState.CANCEL
          ];
          this.statusFilter =
            this.userProfile.userProfileType === 'CLIENT' ? [ProjectState.NEW, ...filters] : [ProjectState.PROGRESS, ...filters];
          this.statusFilterSubject.next(this.statusFilter[0]);
          this.locationFilterSubject.next(this.userProfile.divisions);
          this.serviceFilterSubject.next(this.userProfile.services);
          this.projects$ = combineLatest(
            this.personalProjectService.personalProjects$,
            this.currentStatus$,
            this.locationFilter$,
            this.servicesFilter$,
            this.dateFilter$,
            this.searchFilter$).pipe(
            map(([projects, status, locationFilter, servicesFilter, datesFilter, searchFilter]) => {
              // console.log('projects => ', projects);
              const filteredByStatus = filterByStatus(projects, status);
              // console.log('filteredByStatus => ', filteredByStatus);
              // const filteredByLocations = filterByLocation(filteredByStatus, locationFilter);
              // console.log('filteredByLocations => ', filteredByLocations);
              // const filteredByServices = filterByService(filteredByLocations, servicesFilter);
              // console.log('filteredByServices => ', filteredByServices);
              const today = Date.now();
              const todayLocale = formatDate(today, 'yyyy-MM-dd', 'en-US');
              const limitDate = substractMonths(todayLocale, datesFilter);
              const filteredByCreationDate = filterByCreationDate(filteredByStatus, limitDate);
              const filteredByTitle = filterByProjectTitle(filteredByCreationDate, searchFilter);
              // console.log('filteredByCreationDate => ', filteredByCreationDate);
              return filteredByTitle;

            })
          );
        }
      }
    );
  }

  ngOnInit() {
    this.selectedCard$ = this.personalProjectService.previewProject$.pipe(map(proj => {
      if (proj != null) {
        return proj.id;
      } else {
        return null;
      }
    }));
    this.previewProject$ = this.personalProjectService.previewProject$;
    // this.personalProjectService.getPersonalProjects(this.userProfile.id);
    this.selectAll$ = this.personalProjectService.selectAll$;
    this.currentStatus$.subscribe(
      status => this.statusValue = status
    );
  }

  onProjectChecked(event) {
    // Aca deberia setear el multiselected Projects del servicio personal projects, para en caso de acciones multiples
  }

  onCardClicked(event) {
    // this.router.navigateByUrl(`/project/${event}`);
    this.personalProjectService.preview(event);
  }

  onCreate() {
    this.router.navigateByUrl('/project/create');
  }

  onApply() {

  }

  viewDetail(event) {
    this.personalProjectService.viewDetail(this.userProfile.id, event);
  }
  onBackToList() {
    this.personalProjectService.backToList();
  }

  onAction(event) {
    switch (event) {
      case ProjectAction.Create:
        this.onCreate();
        break;
      case ProjectAction.Apply:
        this.onApply();
        break;

      default:
        break;
    }
  }

  onActionBarFilters({ locations, services, date, search }) {
    if (!!locations) {
      this.locationFilterSubject.next(locations);
    }
    if (!!services) {
      this.serviceFilterSubject.next(services);
    }
    if (!!date) {
      this.dateFilterSubject.next(date);
    }
    if (search !== null) {
      this.searchFilterSubject.next(search);
    }
  }

  onSelectAll(state) {
    this.personalProjectService.selectAll(state);
  }
  // Se llama cuando se da me interesa desde el preview
  onPreviewAction({ projectId, action }) {
    switch (action) {
      case 'APPLY':
        break;
      case 'START':
        break;
      case 'FINISH':
        this.finishExecution(projectId);
        break;
      case 'CANCEL':
        this.cancelExecution(projectId);
        break;
      case 'BRIEFCASE':
        this.onShowBriefcaseForm(projectId);
        break;
      case 'CANCEL_CLIENT':
        this.onUpdateClienProjectState(projectId, ProjectState.CANCEL);
        break;
      case 'FINISH_CLIENT':
        this.onUpdateClienProjectState(projectId, ProjectState.FINISH);
        break;
      default:
        break;
    }
  }

  onUpdateClienProjectState(projectId: number, state: ProjectState.FINISH | ProjectState.CANCEL) {
    this.personalProjectService.updateProjectState(projectId, state).pipe(
      tap( () => {
        this.personalProjectService.backToList();
      })
    ).subscribe(
      () => {
        const isFinish = state === ProjectState.FINISH;
        this.messages.showMessages(`You have succesfully
          ${ isFinish ? 'finished' : 'canceled'} a project. You can view it in ${ isFinish ? 'FINISH' : 'CANCEL'} section.`);
      },
      err =>
        this.messages.showErrors(`There has been an error
          ${ state === ProjectState.FINISH ? 'finishing' : 'canceling'} the project. Try it later.`)
    );
  }

  finishExecution(executionId: number, briefcaseId?: number) {
    this.personalProjectService.updateExecution(executionId, 'FINISH', briefcaseId).pipe(
      tap( () => {
        this.personalProjectService.backToList();
      })
    ).subscribe(
      () => {
        this.messages.showMessages('You have succesfully finished a project execution. You can view it in My Projects tab.');
        this.requestForBriefcaseModal = true;
      },
      err => this.messages.showErrors('There has been an error finishing the project execution. Try it later.')
    );
  }

  cancelExecution(executionId: number) {
    this.personalProjectService.updateExecution(executionId, 'CANCEL').pipe(
      tap( () => {
        this.personalProjectService.backToList();
      })
    ).subscribe(
      () => this.messages.showMessages('You have succesfully cancelled a project execution. You can view it in My Projects tab.'),
      err => {
        this.messages.showErrors('There has been an error canceling the project execution. Try it later.');
        console.log(err);
      }
    );

  }

  onStatusChange(status) {
    this.statusFilterSubject.next(status);
    this.personalProjectService.preview(null);
    this.showBriefcaseForm = false;
  }


  // hideActionBar(){
  //   this.showActionBar = false;
  // }

  // showActionBarMethod(){
  //   this.showActionBar = true;
  // }
  onShowBriefcaseForm(projectId: number) {
    this.showBriefcaseForm = true;
    this.executionIdForBriefcase = projectId;
    const project = this.personalProjectService.getProjectById(projectId);
    if (!!project) {
      this.briefcaseEditForm.patchValue({
        description: project.name || ''
      });
    }
  }

  createBriefcase() {

  }

  uploadPicture($event) {
    const files = ($event.target as HTMLInputElement).files;
    const base64Pictures = this.picturesSubject.value;
    for (let index = 0; index < files.length; index++) {
      const file = files.item(index);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        // this.previewUrl = reader.result;
        base64Pictures.push(reader.result.toString());
      };
    }
    this.imageLoaded = true;
    this.picturesSubject.next(base64Pictures);

  }
  cancelBriefcase() {
    this.showBriefcaseForm = false;
    this.resetForm();
  }

  saveBriefcase() {
    const form = this.briefcaseEditForm.value;
    const startDate = form.startDate;
    const endDate = form.endDate;
    const createBriefcase$ = this.briefcaseService.create(this.userProfile.id, {
      comments: form.comments,
      description: form.description,
      start_date: `${startDate.year}-${startDate.month}-${startDate.day}`,
      end_date: `${endDate.year}-${endDate.month}-${endDate.day}`,
      id_profession: null,
      pictures: this.picturesSubject.value.map(pic => pic.split(',')[1]),     // adding pictures array to briefcase
    });
    this.loading.showLoaderUntilCompletes(createBriefcase$).subscribe(
      (briefcase: UserProfileBriefcase) => {
        this.finishExecution(this.executionIdForBriefcase, briefcase.id);
        this.messages.showMessages('You have succesfully added this project to your briefcase. ' +
        'The client will be asked to review your work.');
      },
      err => this.messages.showErrors('There was an error adding this project to your briefcase. Try again later')
    );
    this.showBriefcaseForm = false;
    this.resetForm();
  }



  resetForm() {
    this.briefcaseEditForm.reset();
    this.picturesSubject.next([]);
  }
}
