import { Component, OnInit, Input } from '@angular/core';
import { CandidateProjectService } from '../services/candidate-project.service';
import { Observable, of, combineLatest } from 'rxjs';
import { Project, ProjectAction, ProjectState } from '../models/project.model';
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

  projectList$: Observable<Project[]>;

  candidateProjects$: Observable<Project[]>;
  interestProjects$: Observable<Project[]>;
  selectedCandidates$: Observable<number[]>;
  selectAll$ = new Observable<boolean>();
  previewProject$: Observable<Project>;
  masterSelected$: Observable<boolean>;

  actionBar = [ProjectAction.Apply, ProjectAction.Delete, ProjectAction.SelectAll];
  statusFilter = [ProjectState.NEW, 'INTEREST'];

  constructor(
    private userService: UserService,
    private candidateProjectService: CandidateProjectService,
    private messages: MessagesService
  ) {
    this.projectList$ = this.candidateProjects$;
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
    this.previewProject$ = this.candidateProjectService.activeProject$;
    this.candidateProjectService.loadCandidatesByUserProfileId(this.userProfile.id);
  }

  onSelectAll(state) {
    this.candidateProjectService.selectAll(state);
  }

  onCardClicked(event) {
    this.candidateProjectService.preview(event);
  }

  onSelectProjects(event) {
    this.candidateProjectService.setMultiSelected(event);
  }

  onActionBarFilter({status}) {
    switch (status) {
      case ProjectState.NEW:
        this.projectList$ = this.candidateProjectService.candidateProjects$;
        break;
      case 'INTEREST':
        this.projectList$ = this.candidateProjectService.interestProjects$;
        break;

      default:
        break;
    }
  }

  onApply() {
    console.log('applying candidates');
    this.candidateProjectService.registerInterest(this.userProfile.id, this.candidateProjectService.getMultiSelected()).subscribe(
      success => {
        if (success) {
          this.messages.showMessages('You have succesfuly applied to the project(s)');
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
