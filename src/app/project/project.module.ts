import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { SharedComponentsModule } from '@app/sharedComponents/shared-components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditProjectComponent, CreateProjectComponent, ProjectDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
