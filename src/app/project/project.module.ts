import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@app/sharedComponents/shared-components.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { EditProjectComponent } from './edit-project/edit-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectRoutingModule } from './project-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCardComponent } from './project-card/project-card.component';
import { CandidateProjectsComponent } from './candidate-projects/candidate-projects.component';
import { ProjectPreviewComponent } from './project-preview/project-preview.component';
import { ProjectActionBarComponent } from './project-action-bar/project-action-bar.component';
import { ProjectCardListComponent } from './project-card-list/project-card-list.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { UserCardComponent } from './user-card/user-card.component';
import { UserCardListComponent } from './user-card-list/user-card-list.component';
import { ProjectCommentsComponent } from './project-comments/project-comments.component';
@NgModule({
  declarations: [
    EditProjectComponent,
    CreateProjectComponent,
    ProjectDetailComponent,
    ProjectCardComponent,
    CandidateProjectsComponent,
    ProjectPreviewComponent,
    ProjectActionBarComponent,
    ProjectCardListComponent,
    MyProjectsComponent,
    UserCardComponent,
    UserCardListComponent,
    ProjectCommentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    ProjectRoutingModule
  ],
  exports:  [
    CandidateProjectsComponent,
    ProjectCardListComponent,
    MyProjectsComponent
  ]
})
export class ProjectModule { }
