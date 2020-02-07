import { Component, OnInit } from '@angular/core';
import { Briefcase } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-birefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css']
})
export class BriefcaseEditComponent implements OnInit {

  briefcases: Briefcase[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    const bc = this.userService.getBriefcase()
    this.briefcases = bc ? bc : [] ;
  }

  save() {}

  skip() {}

}
