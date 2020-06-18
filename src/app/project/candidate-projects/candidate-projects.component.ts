import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, of } from 'rxjs';
import { Project } from '../models/project.model';
import { MessagesService } from '@app/services/messages.service';

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
    private candidateProjectService: CandidateProjectService,
    private messages: MessagesService
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

  onCardClicked(event) {
    this.candidateProjectService.preview(event);
  }

  onSelectCandidates(event) {
    this.candidateProjectService.setMultiSelected(event);
  }

  onAction(event) {
    switch (event) {
      case 'apply':
        console.log('applying candidates');
        this.candidateProjectService.registerInterest(this.userProfileId).subscribe(
          success => {
            if (success) {
              console.log('Candidates set as interests');
            } else {
              this.messages.showErrors('Some error applying. Try again later.');
            }
          }
        );
        break;

      default:
        break;
    }
  }

}
