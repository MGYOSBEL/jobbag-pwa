import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@app/sharedComponents/shared-components.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { EditProjectComponent } from './edit-project/edit-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectRoutingModule } from './project-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCardComponent } from './project-card/project-card.component';//project-card


@NgModule({
  declarations: [
    EditProjectComponent,
    CreateProjectComponent,
    ProjectDetailComponent,
    ProjectCardComponent//project-card
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    NgSelectModule,
    NgbModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
