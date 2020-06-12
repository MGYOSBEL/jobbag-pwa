import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-project-card-list',
  templateUrl: './project-card-list.component.html',
  styleUrls: ['./project-card-list.component.css']
})
export class ProjectCardListComponent implements OnInit {

  @Input()
  projects: Project[];

  constructor() { }

  ngOnInit() {
  }

}
