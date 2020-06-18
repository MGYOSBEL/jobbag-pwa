import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Project } from '../models/project.model';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-project-card-list',
  templateUrl: './project-card-list.component.html',
  styleUrls: ['./project-card-list.component.css']
})
export class ProjectCardListComponent implements OnInit {

  @Input()
  projects: Project[];

  @Input()
  masterSelected$: Observable<boolean>;

  private selectedProjects: number[];

  @Output()
  checkedProjects = new EventEmitter<number[]>();

  constructor(
  ) {
   }

  ngOnInit() {
    this.masterSelected$
      .subscribe(state => {
        this.selectedProjects = state ? this.projects.map(elem => elem.id) : [];
        this.checkedProjects.emit(this.selectedProjects);
      });
  }

  onCardCheck(event) {
    let checked = new Set(this.selectedProjects);
    if (event.state) {
      checked.add(event.projectId);
    } else {
      checked.delete(event.projectId);
    }
    this.selectedProjects = Array.from(checked);
    this.checkedProjects.emit(this.selectedProjects);
  }
}
