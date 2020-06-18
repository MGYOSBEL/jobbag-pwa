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

  checkedProjects: number[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  onCardCheck(event) {
    let checked = new Set(this.checkedProjects);
    if (event.state) {
      checked.add(event.projectId);
    } else {
      checked.delete(event.projectId);
    }
    this.checkedProjects = Array.from(checked);
  }
}
