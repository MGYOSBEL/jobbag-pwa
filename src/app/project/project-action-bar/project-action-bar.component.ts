import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ProjectAction } from '../models/project.model';

@Component({
  selector: 'app-project-action-bar',
  templateUrl: './project-action-bar.component.html',
  styleUrls: ['./project-action-bar.component.css']
})
export class ProjectActionBarComponent implements OnInit {

  @Input()
  actions: ProjectAction[];

  @Output()
  selectAll = new EventEmitter<boolean>();

  @Output()
  action = new EventEmitter<string>();

  APPLY: boolean;
  SELECTALL: boolean;
  CREATE: boolean;
  DELETE: boolean;


  constructor(
  ) {

  }

  ngOnInit() {
    this.SELECTALL = this.actions.includes(ProjectAction.SelectAll);
    this.APPLY = this.actions.includes(ProjectAction.Apply);
    this.CREATE = this.actions.includes(ProjectAction.Create);
    this.DELETE = this.actions.includes(ProjectAction.Delete);
  }

  onSelectAll(event) {
    this.selectAll.emit(event.target.checked);
  }

  onAction(event: string) {
    switch (event) {
      case 'APPLY':
        this.action.emit(ProjectAction.Apply);
        break;
      case 'CREATE':
        this.action.emit(ProjectAction.Create);
        break;
      case 'SELECTALL':
        this.action.emit(ProjectAction.SelectAll);
        break;
      case 'DELETE':
        this.action.emit(ProjectAction.Delete);
        break;
      default:
        break;
    }
  }





}
