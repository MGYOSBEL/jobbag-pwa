import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { AuthGuard } from '@app/auth/helpers/auth.guard';


const projectRoutes: Routes = [
  {
    path: 'project',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: CreateProjectComponent
      },
      {
        path: ':id',
        children: [
          {
            path: 'edit',
            component: EditProjectComponent

          },
          {
            path: '',
            component: ProjectDetailComponent
          }
        ]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(projectRoutes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
