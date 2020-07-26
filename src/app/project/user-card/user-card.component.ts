import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Output()
  cardClicked = new EventEmitter<number>();

  userPictureUrl;

  constructor() {
   }

  ngOnInit() {
    this.userPictureUrl = `${environment.serverBaseURL}/${this.userProfile.picture}`;
    console.log(this.userProfile);
  }
  onCardClicked() {
    console.log('user card clicked => ', this.userProfile.id);
    this.cardClicked.emit(this.userProfile.id);
  }
}
