import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: Project;
  projects$: Observable<Project[]>;

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projects$ = this.projectService.getAllProjectSummariesByProfileId(1);
  }

  createProject() {
    this.projectService.create(
      {
        name: 'proyecto de prueba',
        description: 'comentario del proyecto de prueba',
        startDateExpected: '2020-5-30',
        remote: false,
        state: null,
        services: [1],
        divisions: [44, 45, 1, 2, 57, 58]
      }, 1
    ).subscribe(
      proj => this.project = proj
    );
  }

}
