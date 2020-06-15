import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Project } from '../models/project.model';
import { CandidateProjectService } from '../services/candidate-project.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input()
  project: Project;

  @Output() checked = new EventEmitter<{state: boolean, projectId: number}>();

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

}
