import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserProfile } from '@app/user/models/user.model';

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.css']
})
export class UserCardListComponent implements OnInit {

  @Input()
  users: UserProfile[];
  @Output()
  cardClicked = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onCardClicked(profileId: number) {
    this.cardClicked.emit(profileId);
  }

}
