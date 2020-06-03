import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: Project;

  constructor(
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    // this.projectService.create(
    //   {
    //     "name": "proyecto de prueba",
    //     "description": "comentario del proyecto de prueba",
    //     "start_date_expected": "2020-5-30",
    //     "remote": false,
    //     "services": [1],
    //     "divisions": [44, 45, 1, 2, 57, 58]
    //   }, 1
    // ).subscribe(
    //   proj => this.project = proj
    // );
  }

}
