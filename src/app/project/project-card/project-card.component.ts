import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private candidateProjectService: CandidateProjectService) { }

  ngOnInit() {
  }

  onClick() {
    this.candidateProjectService.preview(this.project.id);
  }

}
