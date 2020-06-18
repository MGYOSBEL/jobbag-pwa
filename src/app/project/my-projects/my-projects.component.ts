import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectState } from '../models/project.model';
import { UserProfile } from '@app/user/models/user.model';
import { ProjectService } from '../services/project.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  @Input()
  userProfileId: number;

  projects$: Observable<Project[]>;

  newProjects$: Observable<Project[]>;
  inProgressProjects$: Observable<Project[]>;
  finishedProjects$: Observable<Project[]>;

  selectAll$ = new Observable<boolean>();

  constructor(
     private projectService: ProjectService,
     private router: Router
  ) {
   }

  ngOnInit() {
    this.projects$ = this.projectService.getAllProjectSummariesByProfileId(this.userProfileId);

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

}
