import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-candidate-projects',
  templateUrl: './candidate-projects.component.html',
  styleUrls: ['./candidate-projects.component.css'],
  providers: [CandidateProjectService]
})
export class CandidateProjectsComponent implements OnInit {

  @Input()
  userProfileId: number;

  candidateProjects$: Observable<Project[]>;
  selectedCandidates$: Observable<number[]>;
  selectAll$ = new Observable<boolean>();

  masterSelected$: Observable<boolean>;



  constructor(
    private candidateProjectService: CandidateProjectService
  ) {
    this.candidateProjects$ = this.candidateProjectService.candidateProjects$;
    this.masterSelected$ = this.candidateProjectService.selectAll$;
    this.selectedCandidates$ = this.candidateProjectService.multiSelectedProjects$;

   }

  ngOnInit() {
    this.candidateProjectService.loadCandidatesByUserProfileId(this.userProfileId);
  }

  onSelectAll(state) {
    this.candidateProjectService.selectAll(state);
  }

  onSelectCandidates(event) {
    this.candidateProjectService.setMultiSelected(event);
  }

  onAction(event) {
    switch (event) {
      case 'apply':
        this.candidateProjectService.onApply();
        break;

      default:
        break;
    }
  }

}
