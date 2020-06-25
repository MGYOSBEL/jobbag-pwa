import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Project, ProjectState, ProjectAction } from '../models/project.model';
import { UserProfile } from '@app/user/models/user.model';
import { ProjectService } from '../services/project.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '@app/user/services/user.service';
import { PersonalProjectService } from '../services/personal-project.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {


  userProfile: UserProfile;
  projects$: Observable<Project[]>;
  previewProject$: Observable<Project>;

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
    private personalProjectService: PersonalProjectService,
    private router: Router
  ) {

    personalProjectService.userProfile$.subscribe(
      ([user, role]) => {
        console.log(`role changed to ${role}`);
        this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
        this.projects$ = personalProjectService.personalProjects$;
        this.actionBar = [
          ProjectAction.Delete,
          ProjectAction.SelectAll,
          this.userProfile.userProfileType === 'CLIENT' ? ProjectAction.Create : null
        ];
      }
    );
   }

  ngOnInit() {
    this.previewProject$ = this.personalProjectService.activeProject$;
    this.personalProjectService.getPersonalProjects(this.userProfile.id);
  }

  filterProjectsByState(projects: Project[], state: string | ProjectState, extraState?: string | ProjectState): Project[] {
    return projects.filter(elem => elem.state === state || elem.state === extraState);
  }


  onProjectChecked(event) {
    console.log('checked projects', event);
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
