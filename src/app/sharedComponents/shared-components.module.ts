import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters/filters.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RoleSelectComponent } from './role-select/role-select.component';



@NgModule({
  declarations: [
    FiltersComponent,
    FooterComponent,
    NavbarComponent,
    RoleSelectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltersComponent,
    FooterComponent,
    NavbarComponent,
    RoleSelectComponent
  ]
})
export class SharedComponentsModule { }
