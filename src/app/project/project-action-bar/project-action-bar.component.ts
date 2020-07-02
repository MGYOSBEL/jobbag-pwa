import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ProjectAction, ProjectState } from '../models/project.model';
import {projectStatusToString} from '../models/mappers';

@Component({
  selector: 'app-project-action-bar',
  templateUrl: './project-action-bar.component.html',
  styleUrls: ['./project-action-bar.component.css']
})
export class ProjectActionBarComponent implements OnInit {

  @Input()
  actions: ProjectAction[]; // Lista de acciones q seran mostradas en la barra

  @Input()
  statusFilter: ProjectState[]; // Estados q se mostraran en el filter status select

  @Output()
  selectAll = new EventEmitter<boolean>(); // Evento emitido cuando se marca el check de selectAll

  @Output()
  action = new EventEmitter<string>(); // Accion emitida desde el actionBar

  @Output()
  filters = new EventEmitter<{ // Se emite cada vez q se selecciona un filtro en el actionBar
    locations?: number[],
    services?: number[],
    status?: ProjectState
  }>();

  APPLY: boolean;
  SELECTALL: boolean;
  CREATE: boolean;
  DELETE: boolean;
  selectAllCheckbox = false;
  showCU: boolean = false;

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

  changeShowCU() {
    if (this.showCU === true) {
      this.showCU = false;
    } else {
      this.showCU = true;
    }
  }

  statusStringify(status: ProjectState): string {
    return projectStatusToString(status);
  }

  onStatusFilter(event) {
    this.selectAll.emit(false);
    this.selectAllCheckbox = false;
    this.filters.emit({ status: event.target.value });
  }
}
