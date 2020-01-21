import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { AuthGuard } from './auth/helpers/auth.guard';



const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'auth' , component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
