import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolderComponent } from './components/holder/holder.component';

const routes: Routes = [
  { 
    path : '', 
    component : HolderComponent,
    children : [
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'courses', loadChildren: () => import('../course/course.module').then(m => m.CourseModule) },
      { path: 'organization', loadChildren: () => import('../organization/organization.module').then(m => m.OrganizationModule) },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
