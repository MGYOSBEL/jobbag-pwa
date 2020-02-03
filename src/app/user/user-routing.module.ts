import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolverService } from './services/dashboard-resolver.service';
import { AuthGuard } from '@app/auth/helpers/auth.guard';
import { ProfileExtrasComponent } from './profile-extras/profile-extras.component';
import { ProfessionsEditComponent } from './professions-edit/professions-edit.component';
import { RoleSelectComponent } from '../sharedComponents/role-select/role-select.component';


const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        children: [
          {
            path: 'profile-extras', component: ProfileExtrasComponent
          },
          {
            path: 'edit-professions', component: ProfessionsEditComponent
          },
          {
            path: 'briefcase', component: ProfileExtrasComponent
          },
          {
            path: 'select-role', component: RoleSelectComponent
          },
          {
            path: '',
            component: DashboardComponent,
            resolve: { user: DashboardResolverService }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
