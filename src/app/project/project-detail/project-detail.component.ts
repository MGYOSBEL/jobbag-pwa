import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { PersonalProjectService } from '../services/personal-project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  @Input()
  project: Project;

  constructor(
    private personalProjectService: PersonalProjectService
  ) { }

  ngOnInit() {
  }

  backToList() {
    this.personalProjectService.backToList();
  }



}
