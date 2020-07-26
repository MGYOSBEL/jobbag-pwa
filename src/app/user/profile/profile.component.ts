import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile, UserProfileBriefcase } from '../models/user.model';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile: UserProfile;
  briefcaseDetailSubject = new BehaviorSubject<UserProfileBriefcase>(null);
  briefcaseDetail$ = this.briefcaseDetailSubject.asObservable();

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(( data: {profile: UserProfile}) => {
      this.userProfile = data.profile;
    }
    );
  }

  onBriefcaseDetail(briefcaseId: number) {
    const selectedBriefcase = this.userProfile.briefcases.find(briefcase => briefcase.id === briefcaseId);
    this.briefcaseDetailSubject.next(selectedBriefcase);
  }

  onBriefcaseDetailClose() {
    this.briefcaseDetailSubject.next(null);
  }

}
