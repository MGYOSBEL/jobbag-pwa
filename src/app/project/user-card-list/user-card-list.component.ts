import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from '@app/user/models/user.model';

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.css']
})
export class UserCardListComponent implements OnInit {

  @Input()
  users: UserProfile[];

  constructor() { }

  ngOnInit() {
  }

}
