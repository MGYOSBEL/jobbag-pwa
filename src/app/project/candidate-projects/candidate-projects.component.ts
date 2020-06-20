import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, of, combineLatest } from 'rxjs';
import { Project, ProjectAction } from '../models/project.model';
import { MessagesService } from '@app/services/messages.service';
import { UserProfile } from '@app/user/models/user.model';
import { UserProfileService } from '@app/user/services/user-profile.service';
import { UserService } from '@app/user/services/user.service';

@Component({
  selector: 'app-candidate-projects',
  templateUrl: './candidate-projects.component.html',
  styleUrls: ['./candidate-projects.component.css'],
  providers: [CandidateProjectService]
})
export class CandidateProjectsComponent implements OnInit {

  userProfile: UserProfile;

  candidateProjects$: Observable<Project[]>;
  selectedCandidates$: Observable<number[]>;
  selectAll$ = new Observable<boolean>();

  masterSelected$: Observable<boolean>;

  actionBar = [ProjectAction.Apply, ProjectAction.Delete, ProjectAction.SelectAll];

  constructor(
    private userService: UserService,
    private candidateProjectService: CandidateProjectService,
    private messages: MessagesService
  ) {
    this.candidateProjects$ = this.candidateProjectService.candidateProjects$;
    this.masterSelected$ = this.candidateProjectService.selectAll$;
    this.selectedCandidates$ = this.candidateProjectService.multiSelectedProjects$;
    const userProfile$ = combineLatest(
      userService.loggedUser$,
      userService.role$
    );
    userProfile$.subscribe(
      ([user, role]) => {
        this.userProfile = user.profiles.find(profile => profile.userProfileType === role);
      }
    );
  }

  ngOnInit() {
    this.candidateProjectService.loadCandidatesByUserProfileId(this.userProfile.id);
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

  onApply() {
    console.log('applying candidates');
    this.candidateProjectService.registerInterest(this.userProfile.id).subscribe(
      success => {
        if (success) {
          console.log('Candidates set as interests');
        } else {
          this.messages.showErrors('Some error applying. Try again later.');
        }
      }
    );
  }

  onAction(event) {
    switch (event) {
      case ProjectAction.Apply:
        this.onApply();
        break;

      default:
        break;
    }
  }

}
