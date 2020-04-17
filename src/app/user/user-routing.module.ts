import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolverService } from './services/dashboard-resolver.service';
import { AuthGuard } from '@app/auth/helpers/auth.guard';
import { RoleSelectComponent } from '../sharedComponents/role-select/role-select.component';
import { BriefcaseEditComponent } from './briefcase-edit/briefcase-edit.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        children: [
          {
            path: 'create-profile', component: CreateProfileComponent,
            resolve: {user: DashboardResolverService}
          },
          {
            path: 'edit', component: EditProfileComponent
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
