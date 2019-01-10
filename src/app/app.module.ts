import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
 import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';


import { EmployeeService } from './employee/employee.service';


import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { ListEmployeeComponent } from './employee/list-employee.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
