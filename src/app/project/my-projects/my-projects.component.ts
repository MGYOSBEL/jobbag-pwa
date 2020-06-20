import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Project, ProjectState, ProjectAction } from '../models/project.model';
import { UserProfile } from '@app/user/models/user.model';
import { ProjectService } from '../services/project.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@app/user/services/user.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {


  userProfile: UserProfile;
  projects$: Observable<Project[]>;

  newProjects$: Observable<Project[]>;
  inProgressProjects$: Observable<Project[]>;
  finishedProjects$: Observable<Project[]>;

  selectAll$ = new Observable<boolean>();

  actionBar = [
    ProjectAction.Delete,
    ProjectAction.SelectAll
  ];

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router
  ) {
    const userProfile$ = combineLatest(
      userService.loggedUser$,
      userService.role$
    );
    userProfile$.subscribe(
      ([user, role]) => {
        this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
        this.projects$ = this.projectService.getAllProjectSummariesByProfileId(this.userProfile.id);
        this.actionBar = [
          ProjectAction.Delete,
          ProjectAction.SelectAll,
          this.userProfile.userProfileType === 'CLIENT' ? ProjectAction.Create : null
        ];
      }
    );
   }

  ngOnInit() {

    this.newProjects$ = this.projects$.pipe(
      map(projects => projects.filter(elem => elem.state === ProjectState.NEW))
    );
    this.inProgressProjects$ = this.projects$.pipe(
      map(projects => projects.filter(elem => elem.state === ProjectState.PROGRESS))
    );
    this.finishedProjects$ = this.projects$.pipe(
      map(projects => projects.filter(elem => elem.state === ProjectState.FINISH || elem.state === ProjectState.CANCEL))
    );
  }

  onProjectChecked(event) {
    console.log('checked projects', event);
  }

  onCardClicked(event) {
    this.router.navigateByUrl(`/project/${event}`);
  }

  onCreate() {
    this.router.navigateByUrl('/project/create');
  }

  onApply() {

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

}
