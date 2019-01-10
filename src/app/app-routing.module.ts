import { CustomPreloadingService } from './CustomPreloadingService';
import { EmployeeModule } from "./employee/employee.module";
import { PageNotFoundComponent } from "./page-not-found.component";
import { HomeComponent } from "./home.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

const appRoutes: Routes = [
  { path: "home", component: HomeComponent },
  {
    path: "employees",
    data: { preload: true },
    loadChildren: "./employee/employee.module#EmployeeModule"
  },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: CustomPreloadingService
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
