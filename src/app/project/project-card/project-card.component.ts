import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Project } from '../models/project.model';
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

  @Input()
  cardSelected: boolean;

  constructor(private candidateProjectService: CandidateProjectService) { }

  ngOnInit() {

  }

  onClick() {
    this.candidateProjectService.preview(this.project.id);
  }

  onCheck(event) {
    this.checked.emit({
      state: event.target.checked,
      projectId: this.project.id
    });
  }

  getColor() {
    if (this.project.state === "'NEW'") {
      return 'solid 8px #7bcff4';
    } else if (this.project.name === 'Read') {
      return 'solid 8px #a1d173';
    } else {
      return 'solid 8px #f99d6e';
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
