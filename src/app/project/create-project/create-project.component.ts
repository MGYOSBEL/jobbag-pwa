import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  createProjectForm = new FormGroup({});



  constructor(private formBuilder: FormBuilder) {
    this.createProjectForm = this.formBuilder.group({
    });
  }

  ngOnInit() {
  }

}
