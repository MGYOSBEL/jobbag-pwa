import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolverService } from './services/dashboard-resolver.service';
import { AuthGuard } from '@app/auth/helpers/auth.guard';
import { ProfileExtrasComponent } from './profile-extras/profile-extras.component';
import { ProfessionsEditComponent } from './professions-edit/professions-edit.component';
import { RoleSelectComponent } from '../sharedComponents/role-select/role-select.component';
import { BriefcaseEditComponent } from './briefcase-edit/briefcase-edit.component';
import { EditUserComponent } from './edit-user/edit-user.component';


const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        children: [
          {
            path: 'profile-extras', component: ProfileExtrasComponent,
            resolve: {user: DashboardResolverService}
          },
          {
            path: 'edit-professions', component: ProfessionsEditComponent
          },
          {
            path: 'edit-user', component: EditUserComponent
          },
          {
            path: 'briefcase', component: BriefcaseEditComponent
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
