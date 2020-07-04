import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from '@app/user/models/user.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input()
  userProfile: UserProfile;

  userPictureUrl;

  constructor() {
   }

  ngOnInit() {
    this.userPictureUrl = `${environment.serverBaseURL}/${this.userProfile.picture}`;

  }

}
