import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Project, ProjectState } from '../models/project.model';
import { CandidateProjectService } from '../services/candidate-project.service';
import { timeInterval } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input()
  project: Project;

  @Output() checked = new EventEmitter<{ state: boolean, projectId: number }>();

  @Output() clicked = new EventEmitter<number>();

  @Input()
  cardSelected: boolean;

  @Input()
  cardMode: 'wide' | 'compact';

  constructor() { }

  ngOnInit() {

  }

  onClick() {
    this.clicked.emit(this.project.id);
  }

  onCheck(event) {
    this.checked.emit({
      state: event.target.checked,
      projectId: this.project.id
    });
  }

  getColor() {
    switch (this.project.state) {
      case ProjectState.NEW:
        return 'solid 8px #7bcff4';
      case ProjectState.PROGRESS:
        return 'solid 8px #a1d173';
      case ProjectState.FINISH:
        return 'solid 8px #f99d6e';
      case ProjectState.CANCEL:
        return 'solid 8px #7bcff4';

      default:
        break;
    }
  }

  checkCard(state: boolean) {
    this.cardSelected = state;
    this.checked.emit({
      state,
      projectId: this.project.id
    });
  }

}
