import { NgModule } from '@angular/core';


import { EmployeeRoutingModule } from './employee-routing-module';


import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeeComponent } from './list-employee.component';
import { SharedModule } from '../shared/shared/shared.module';


@NgModule({
  imports: [
    EmployeeRoutingModule,
    SharedModule
        
  ],
  declarations: [
    CreateEmployeeComponent,
    ListEmployeeComponent,
  ]
})
export class EmployeeModule { }
